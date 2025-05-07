using inventorybackend.DTOS;
using inventorybackend.src.Core.Interface;
using inventorybackend.src.Entities;
using inventorybackend.src.Interface;
using inventorybackend.src.Repositories;
using Microsoft.EntityFrameworkCore;

namespace inventorybackend.src.Core.Service
{
    public class EqmborrowService : IEqmborrowService
    {
        private readonly IEqmborrowRepo _Eqmrepo;
        private readonly DataContext _dataContext;
        private readonly IStockRepo _stockRepo;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<EqmborrowService> _logger;

        public EqmborrowService(IEqmborrowRepo Eqmrepo, DataContext dataContext, IWebHostEnvironment environment, ILogger<EqmborrowService> logger , IStockRepo stockRepo)
        {
            _Eqmrepo = Eqmrepo;
            _dataContext = dataContext;
            _environment = environment;
            _logger = logger;
            _stockRepo = stockRepo;
            // ตรวจสอบและสร้างโฟลเดอร์ asset ใน wwwroot
            if (!Directory.Exists(Path.Combine(_environment.WebRootPath, "return")))
            {
                Directory.CreateDirectory(Path.Combine(_environment.WebRootPath, "return"));
            }
        }

        public async Task<List<EquipmentBorrowJoinDto>> GetPendingBorrowsAsync()
        {
            try
            {
                var pendingBorrows = await _Eqmrepo.GetPendingBorrowsAsync();
                return pendingBorrows;
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"An error occurred while retrieving pending borrow requests: {ex.Message}", ex);
            }
        }

        public async Task<List<EquipmentBorrowJoinDto>> GetBorrowByUserIDAsync(int userId)
        {
            try
            {
                var borrows = await _Eqmrepo.GetBorrowByUserAsync(userId);
                return borrows;
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"An error occurred while retrieving borrowing data for user {userId}: {ex.Message}", ex);
            }
        }

        public async Task<EquipmentborrowDbo> RequestBorrowAsync(EquipmentBorrowDto borrowDto)
        {
            // 1. ตรวจสอบข้อมูลที่จำเป็น
            if (borrowDto.UserID <= 0 || borrowDto.StockID <= 0 || borrowDto.Quantity <= 0)
            {
                throw new ArgumentException("UserID, StockID, and Quantity must be greater than zero");
            }

            // 2. เช็คว่า StockID มีและมี Quantity เพียงพอหรือไม่
            var stock = await _stockRepo.GetStockByIdAsync(borrowDto.StockID);
            if (stock == null)
            {
                throw new Exception($"ไม่พบ StockID {borrowDto.StockID} ในระบบ");
            }
            if (stock.Quantity < borrowDto.Quantity || stock.Status != 0) // 0 = พร้อมยืม
            {
                throw new Exception($"StockID {borrowDto.StockID} ไม่มีจำนวนเพียงพอ (Available: {stock.Quantity}, Requested: {borrowDto.Quantity}, Status: {stock.Status})");
            }

            // 3. บันทึกคำขอยืม (ไม่เช็คว่ามีคำขอรออนุมัติแล้วหรือไม่)
            var borrowRequest = new EquipmentborrowDbo
            {
                StockID = borrowDto.StockID,
                ItemID = borrowDto.ItemID,
                UserID = borrowDto.UserID,
                Quantity = borrowDto.Quantity,
                Itemtype = borrowDto.Itemtype,
                BorrowDate = borrowDto.BorrowDate,
                ReturnDate = borrowDto.ReturnDate,
                Reason = borrowDto.reason,
                BorrowStatus = borrowDto.BorrowStatus,
                Status = 0, // รออนุมัติ
            };

            var createdBorrow = await _Eqmrepo.CreatedEQMborrow(borrowRequest);
            return createdBorrow;
        }


        public async Task<EquipmentborrowDbo> ApproveBorrowAsync(EquipmentBorrowUpdateDto updateDto)
        {
            // 1. ดึงคำขอยืม
            var borrowRequest = await _Eqmrepo.GetBorrowByIdAsync(updateDto.BorrowId);
            if (borrowRequest == null)
            {
                throw new Exception($"ไม่พบคำขอยืม BorrowID {updateDto.BorrowId}");
            }

            // 2. ตรวจสอบว่ายังไม่ถูกอนุมัติ
            if (borrowRequest.Status != 0)
            {
                throw new Exception($"คำขอยืม BorrowID {updateDto.BorrowId} ถูกดำเนินการไปแล้ว");
            }

            // 3. ใช้ Transaction เพื่ออัปเดตทั้งสองตาราง
            using (var transaction = await _dataContext.Database.BeginTransactionAsync())
            {
                try
                {
                    // อัปเดตคำขอยืม
                    borrowRequest.Status = updateDto.Status; // 1 = อนุมัติ, 2 = Reject
                    borrowRequest.BorrowStatus = updateDto.BorrowStatus;

                    // ถ้า Status = 1 (อนุมัติ) ลด Quantity ใน Stock
                    if (borrowRequest.Status == 1)
                    {
                        var stock = await _stockRepo.GetStockByIdAsync(borrowRequest.StockID);
                        if (stock == null)
                        {
                            throw new Exception($"ไม่พบ StockID {borrowRequest.StockID} ในระบบ");
                        }
                        if (stock.Quantity < borrowRequest.Quantity || stock.Status != 0)
                        {
                            throw new Exception($"StockID {borrowRequest.StockID} ไม่มีจำนวนเพียงพอหรือไม่พร้อม (Available: {stock.Quantity}, Requested: {borrowRequest.Quantity}, Status: {stock.Status})");
                        }

                        stock.Quantity -= borrowRequest.Quantity; // ลดตามจำนวนที่ขอ
                        if (stock.Quantity == 0)
                        {
                            stock.Status = 1; // out_of_stock
                        }
                        await _stockRepo.UpdateStockAsync(stock);
                    }
                    // ถ้า Status = 2 (Reject) ไม่ต้องลด Quantity

                    await _Eqmrepo.UpdateEQMborrow(borrowRequest);
                    await transaction.CommitAsync();
                    return borrowRequest;
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    throw new Exception($"ไม่สามารถอนุมัติ/ปฏิเสธคำขอยืม BorrowID {updateDto.BorrowId}: {ex.Message}", ex);
                }
            }
        }



        public async Task<EquipmentborrowDbo> ReturnBorrowAsync(EquipmentBorrowReturnDto returnDto)
        {
            // 1. ดึงคำขอยืม
            var borrowRequest = await _Eqmrepo.GetBorrowByIdAsync(returnDto.BorrowId);
            if (borrowRequest == null)
            {
                _logger.LogWarning("ไม่พบคำขอยืม BorrowID {BorrowId}", returnDto.BorrowId);
                throw new Exception($"ไม่พบคำขอยืม BorrowID {returnDto.BorrowId}");
            }

            //2.ตรวจสอบสถานะยืม(ข้ามสำหรับทดสอบ หรือปรับตามความเหมาะสม)
             if (borrowRequest.BorrowStatus != 1)
            {
                _logger.LogWarning("คำขอยืม BorrowID {BorrowId} อยู่ในสถานะ {BorrowStatus}, ไม่สามารถคืนได้", returnDto.BorrowId, borrowRequest.BorrowStatus);
                throw new Exception($"คำขอยืม BorrowID {returnDto.BorrowId} ยังไม่ถูกยืมหรือคืนไปแล้ว");
            }

            // 3. จัดการรูปภาพถ้ามี
            string returnImagePath = null;
            if (returnDto.ReturnImage != null)
            {
                var uploadsFolder = Path.Combine(_environment.WebRootPath, "return");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(returnDto.ReturnImage.FileName)}";
                var fullPath = Path.Combine(uploadsFolder, fileName);
                returnImagePath = $"/return/{fileName}";

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await returnDto.ReturnImage.CopyToAsync(stream);
                }
                _logger.LogInformation("บันทึกรูปภาพสำหรับ BorrowID {BorrowId} ที่ {Path}", returnDto.BorrowId, returnImagePath);
            }

            // 4. ใช้ Transaction เพื่ออัปเดตทั้งสองตาราง
            using (var transaction = await _dataContext.Database.BeginTransactionAsync())
            {
                try
                {
                    // อัปเดตคำขอยืม
                    var updateDto = new UpdateborrowStatusDTO
                    {
                        BorrowID = returnDto.BorrowId, // ใช้ BorrowID
                        borrowStatus = returnDto.BorrowStatus,
                        Returnimage = returnImagePath
                    };
                    await _Eqmrepo.UpdateBorrowStatusAsync(updateDto);

                    // เพิ่ม Quantity กลับใน Stock
                    var stock = await _stockRepo.GetStockByIdAsync(borrowRequest.StockID);
                    if (stock == null)
                    {
                        _logger.LogWarning("ไม่พบ StockID {StockID} สำหรับ BorrowID {BorrowId}", borrowRequest.StockID, returnDto.BorrowId);
                        throw new Exception($"ไม่พบ StockID {borrowRequest.StockID} ในระบบ");
                    }

                    stock.Quantity += borrowRequest.Quantity;
                    stock.Status = 0;
                    await _stockRepo.UpdateStockAsync(stock);

                    await transaction.CommitAsync();
                    _logger.LogInformation("คืนอุปกรณ์สำเร็จสำหรับ BorrowID {BorrowId}", returnDto.BorrowId);
                    return await _Eqmrepo.GetBorrowByIdAsync(returnDto.BorrowId);
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    _logger.LogError(ex, "เกิดข้อผิดพลาดขณะคืนอุปกรณ์ BorrowID: {BorrowId}", returnDto.BorrowId);
                    throw new Exception($"ไม่สามารถคืนคำขอยืม BorrowID {returnDto.BorrowId}: {ex.Message}", ex);
                }
            }
        }

        public async Task<List<EquipmentBorrowJoinDto>> GetALLEQMjoinAsync()
        {
            try
            {
                var user = await _Eqmrepo.GetALLEQMborrowAsync();
                return user;
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"An error occurred while retrieving the Equipment : {ex.Message}", ex);
            }
        }
    }
}
