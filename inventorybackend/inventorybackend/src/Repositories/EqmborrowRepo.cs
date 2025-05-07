using inventorybackend.DTOS;
using inventorybackend.src.Entities;
using inventorybackend.src.Interface;
using Microsoft.EntityFrameworkCore;


namespace inventorybackend.src.Repositories
{
    public class EqmborrowRepo : IEqmborrowRepo
    {
        private readonly DataContext _dbContext;
        private readonly ILogger<EqmborrowRepo> _logger;

        public EqmborrowRepo(DataContext dbContext, ILogger<EqmborrowRepo> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<EquipmentborrowDbo> CreatedEQMborrow(EquipmentborrowDbo Equipment)
        {
            _dbContext.EQMM.Add(Equipment);
            await _dbContext.SaveChangesAsync();
            return Equipment;
        }

        public async Task<List<EquipmentBorrowJoinDto>> GetALLEQMborrowAsync()
        {
            try
            {
                var eqm = await (from e in _dbContext.EQMM
                                  join i in _dbContext.Item
                                  on e.ItemID equals i.ItemID
                                  join s in _dbContext.Stock
                                  on e.StockID equals s.StockID
                                  join u in _dbContext.User
                                  on e.UserID equals u.UserID
                                  select new EquipmentBorrowJoinDto
                                  {
                                      StockID = s.StockID,
                                      BorrowID = e.BorrowID,
                                      UserID = e.UserID,
                                      ItemID = e.ItemID,
                                      Quantity = e.Quantity,
                                      BorrowDate = e.BorrowDate,
                                      ReturnDate = e.ReturnDate,
                                      Itemtype = e.Itemtype,
                                      SerialNumber = s.SerialNumber,
                                      reason = e.Reason,
                                      Status = e.Status,
                                      ItemName = i.Itemname,
                                      BorrowStatus = e.BorrowStatus,
                                      Image = i.Image,
                                      Firstname = u.Firstname,
                                      Lastname = u.Lastname,
                                      Returnimage = e.Returnimage,
                                     
                                  }).ToListAsync();

                return eqm;
            }
            catch (Exception ex)
            {
                // เพิ่มข้อความแสดงข้อผิดพลาดจาก exception ที่แท้จริง
                throw new ApplicationException($"An error occurred while retrieving the BorrowEQM data: {ex.Message}", ex);
            }

        }

        public async Task<List<EquipmentBorrowJoinDto>> GetPendingBorrowsAsync()
        {
            try
            {
                var eqm = await (from e in _dbContext.EQMM
                                 join i in _dbContext.Item
                                 on e.ItemID equals i.ItemID
                                 join s in _dbContext.Stock
                                 on e.StockID equals s.StockID
                                 join u in _dbContext.User
                                 on e.UserID equals u.UserID
                                 where e.Status == 0  // Filter for Status = 0
                                 select new EquipmentBorrowJoinDto
                                 {
                                     StockID = s.StockID,
                                     BorrowID = e.BorrowID,
                                     UserID = e.UserID,
                                     ItemID = e.ItemID,
                                     Quantity = e.Quantity,
                                     BorrowDate = e.BorrowDate,
                                     ReturnDate = e.ReturnDate,
                                     Itemtype = e.Itemtype,
                                     SerialNumber = s.SerialNumber,
                                     reason = e.Reason,
                                     Status = e.Status,
                                     ItemName = i.Itemname,
                                     BorrowStatus = e.BorrowStatus,
                                     Image = i.Image,
                                     Firstname = u.Firstname,
                                     Lastname = u.Lastname,
                                 }).ToListAsync();

                return eqm;
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"An error occurred while retrieving pending borrow requests: {ex.Message}", ex);
            }
        }

        public async Task<EquipmentborrowDbo> GetBorrowByIdAsync(int borrowId)
        {
            return await _dbContext.EQMM.FindAsync(borrowId);
        }

        public async Task<List<EquipmentBorrowJoinDto>> GetBorrowByUserAsync(int userId)
        {
            try
            {
                var eqm = await (from e in _dbContext.EQMM
                                 join i in _dbContext.Item
                                 on e.ItemID equals i.ItemID
                                 join s in _dbContext.Stock
                                 on e.StockID equals s.StockID
                                 join u in _dbContext.User
                                 on e.UserID equals u.UserID
                                 where e.UserID == userId  // Added filter for UserID
                                 select new EquipmentBorrowJoinDto
                                 {
                                     StockID = s.StockID,
                                     BorrowID = e.BorrowID,
                                     UserID = e.UserID,
                                     ItemID = e.ItemID,
                                     Quantity = e.Quantity,
                                     BorrowDate = e.BorrowDate,
                                     ReturnDate = e.ReturnDate,
                                     Itemtype = e.Itemtype,
                                     SerialNumber = s.SerialNumber,
                                     reason = e.Reason,
                                     Status = e.Status,
                                     ItemName = i.Itemname,
                                     BorrowStatus = e.BorrowStatus,
                                     Image = i.Image,
                                     Firstname = u.Firstname,
                                     Lastname = u.Lastname,
                                     Returnimage = e.Returnimage,
                                 }).ToListAsync();

                return eqm;
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"An error occurred while retrieving the BorrowEQM data for user {userId}: {ex.Message}", ex);
            }
        }

        public async Task<EquipmentborrowDbo> UpdateEQMborrow(EquipmentborrowDbo borrow)
        {
            _dbContext.EQMM.Update(borrow);
            await _dbContext.SaveChangesAsync();
            return borrow;
        }

        public async Task<EquipmentborrowDbo?> GetPendingBorrowByStockIdAsync(int stockId)
        {
            return await _dbContext.EQMM
                .FirstOrDefaultAsync(b => b.StockID == stockId && b.Status == 0); // 0 = รออนุมัติ
        }


        public async Task UpdateStatusAsync(UpdateStatusDTO item)
        {
            var status = await _dbContext.EQMM.FirstOrDefaultAsync(p => p.ItemID == item.ItemID);
            if (status != null)
            {
                status.Status = item.Status; // อัปเดตเฉพาะ Status
                _dbContext.EQMM.Update(status);
                await _dbContext.SaveChangesAsync();
            }
            else
            {
                throw new Exception($"Status with ID {item.ItemID} not found.");
            }
        }

        // อัปเดต borrowStatus
        public async Task UpdateBorrowStatusAsync(UpdateborrowStatusDTO item)
        {
            var borrowstatus = await _dbContext.EQMM.FirstOrDefaultAsync(p => p.BorrowID == item.BorrowID);
            if (borrowstatus != null)
            {
                borrowstatus.BorrowStatus = item.borrowStatus;
                borrowstatus.Returnimage = item.Returnimage;
                _dbContext.EQMM.Update(borrowstatus);
                await _dbContext.SaveChangesAsync();
                _logger.LogInformation("อัปเดต BorrowStatus สำหรับ BorrowID {BorrowID} เป็น {BorrowStatus}", item.BorrowID, item.borrowStatus);
            }
            else
            {
                _logger.LogWarning("ไม่พบคำขอยืมสำหรับ BorrowID {BorrowID}", item.BorrowID);
                throw new Exception($"ไม่พบคำขอยืมสำหรับ BorrowID {item.BorrowID}");
            }
        }
    }
}
