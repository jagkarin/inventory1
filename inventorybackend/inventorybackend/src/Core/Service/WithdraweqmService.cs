using inventorybackend.DTOS;
using inventorybackend.src.Core.Interface;
using inventorybackend.src.Entities;
using inventorybackend.src.Interface;
using inventorybackend.src.Repositories;
using Newtonsoft.Json;
using inventorybackend.src.Models;
using Microsoft.EntityFrameworkCore;

namespace inventorybackend.src.Core.Service
{
    public class WithdraweqmService : IWithdraweqmService
    {
        private readonly IWithdraweqmRepo _WithdraweqmRepo;
        private readonly DataContext _dataContext;
        private readonly ILogger<WithdraweqmService> _logger;

        public WithdraweqmService(IWithdraweqmRepo WithdraweqmRepo, DataContext dataContext, ILogger<WithdraweqmService> logger)
        {
            _WithdraweqmRepo = WithdraweqmRepo;
            _dataContext = dataContext;
            _logger = logger;
        }

        private async Task<string> GenerateBorrowCodeAsync(int userId)
        {
            string currentYear = DateTime.Now.Year.ToString();
            string prefix = $"{currentYear}U{userId}B";

            var lastBorrow = await _WithdraweqmRepo.GetLastBorrowByPrefixAsync(prefix);
            int nextNumber = 1;
            if (lastBorrow != null && !string.IsNullOrEmpty(lastBorrow.BorrowCode))
            {
                string numberPart = lastBorrow.BorrowCode.Substring(prefix.Length);
                if (int.TryParse(numberPart, out int lastNumber))
                {
                    nextNumber = lastNumber + 1;
                }
            }

            if (nextNumber > 9999999)
            {
                throw new Exception("Borrow code exceeds maximum limit for this user and year");
            }

            return $"{prefix}{nextNumber:D7}";
        }

        public async Task<List<BorrowDto>> GetAllBorrowsAsync()
        {
            var borrows = await _WithdraweqmRepo.GetAllBorrowsAsync();
            return borrows.Select(borrow => new BorrowDto
            {
                BorrowId = borrow.BorrowId,
                UserId = borrow.UserId,
                BorrowDate = borrow.BorrowDate,
                ExpectedReturnDate = borrow.ExpectedReturnDate,
                Status = borrow.Status,
                BorrowDetails = borrow.BorrowDetails,
                Firstname = borrow.Firstname,
                Lastname = borrow.Lastname,
                BorrowCode = borrow.BorrowCode,
                ReturnStatus = borrow.ReturnStatus
            }).ToList();
        }

        public async Task<BorrowDto> GetBorrowByIdAsync(int borrowId)
        {
            var borrow = await _WithdraweqmRepo.GetBorrowByIdAsync(borrowId);
            if (borrow == null)
            {
                return null;
            }

            var borrowDetails = borrow.GetBorrowDetails();

            // ดึงข้อมูลอุปกรณ์จากตาราง EQM ด้วย JOIN
            var eqmNames = borrowDetails.Select(d => d.EQMNAME).ToList();
            var equipments = await _WithdraweqmRepo.GetEquipmentByNamesAsync(eqmNames);

            // เพิ่ม ImageUrl จาก EQM ลงใน BorrowDetails
            var detailsWithImages = borrowDetails.Select(detail =>
            {
                var equipment = equipments.FirstOrDefault(e => e.EQM_Name == detail.EQMNAME);
                return new BorrowDetailWithImageDto
                {
                    EQMNAME = detail.EQMNAME,
                    Quantity = detail.Quantity,
                    //CategoryId = detail.CategoryId,
                    Category = detail.Category,
                    ImageUrl = equipment?.EQMimage
                };
                
            }).ToList();

            // ดึงข้อมูลผู้ใช้จากตาราง User
            var user = await _dataContext.User.FirstOrDefaultAsync(u => u.UserID == borrow.UserID);

            return new BorrowDto
            {
                BorrowId = borrow.BorrowID,
                UserId = borrow.UserID,
                BorrowDate = borrow.BorrowDate,
                ExpectedReturnDate = borrow.ExpectedReturnDate,
                Status = borrow.Status ?? string.Empty,
                BorrowDetails = detailsWithImages,
                Firstname = user?.Firstname,
                Lastname = user?.Lastname,
                ReturnStatus = borrow.ReturnStatus,
                BorrowCode = borrow.BorrowCode
            };
        }

        public async Task<BorrowDto> AddBorrowAsync(CreateBorrowDto createBorrowDto)
        {
            using var transaction = await _dataContext.Database.BeginTransactionAsync();
            try
            {
                string borrowCode = await GenerateBorrowCodeAsync(createBorrowDto.UserId);

                if (await _WithdraweqmRepo.BorrowCodeExistsAsync(borrowCode))
                {
                    throw new Exception("Generated borrow_code already exists");
                }

                var eqmNames = createBorrowDto.BorrowDetails.Select(d => d.EQMNAME).ToList();
                var existingEqms = await _WithdraweqmRepo.GetEquipmentByNamesAsync(eqmNames);
                if (existingEqms.Count != eqmNames.Count)
                {
                    throw new ArgumentException("One or more EQM names do not exist in the system.");
                }

                var borrow = new BorroweqmDbo
                {
                    UserID = createBorrowDto.UserId,
                    BorrowCode = borrowCode,
                    BorrowDate = DateTime.Now,
                    ExpectedReturnDate = createBorrowDto.ExpectedReturnDate,
                    Status = createBorrowDto.Status,
                    ReturnStatus = createBorrowDto.ReturnStatus
                };

                borrow.SetBorrowDetails(createBorrowDto.BorrowDetails.Select(d => new BorrowDetail
                {
                    EQMNAME = d.EQMNAME,
                    Quantity = d.Quantity,
                    //CategoryId = d.CategoryId,
                    Category = d.Category,
                    ImageUrl = d.ImageUrl,
                }).ToList());

                var newBorrow = await _WithdraweqmRepo.AddBorrowAsync(borrow);

                await transaction.CommitAsync();

                // ดึงข้อมูลอุปกรณ์เพื่อรวม ImageUrl ใน response
                var borrowDetails = newBorrow.GetBorrowDetails();
                var equipments = await _WithdraweqmRepo.GetEquipmentByNamesAsync(borrowDetails.Select(d => d.EQMNAME).ToList());
                var detailsWithImages = borrowDetails.Select(detail =>
                {
                    var equipment = equipments.FirstOrDefault(e => e.EQM_Name == detail.EQMNAME);
                    return new BorrowDetailWithImageDto
                    {
                        EQMNAME = detail.EQMNAME,
                        Quantity = detail.Quantity,
                        Category = detail.Category,
                        ImageUrl = equipment?.EQMimage
                    };
                }).ToList();

                return new BorrowDto
                {
                    BorrowId = newBorrow.BorrowID,
                    UserId = newBorrow.UserID,
                    BorrowCode = newBorrow.BorrowCode,
                    BorrowDate = newBorrow.BorrowDate,
                    ExpectedReturnDate = newBorrow.ExpectedReturnDate,
                    Status = newBorrow.Status,
                    BorrowDetails = detailsWithImages // ใช้ผลลัพธ์ที่แปลงแล้ว
                };
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error adding borrow");
                throw;
            }
        }

        public async Task<BorrowDto> UpdateBorrowStatusAsync(int borrowId, string? status, string? returnStatus)
        {
            var updatedBorrow = await _WithdraweqmRepo.UpdateBorrowStatusAsync(borrowId, status, returnStatus);
            if (updatedBorrow == null)
            {
                return null;
            }

            return new BorrowDto
            {
                Status = updatedBorrow.Status,
                ReturnStatus = updatedBorrow.ReturnStatus
            };
        }

        public async Task<BorrowDto> UpdateBorrowReturnAsync(int borrowId, string? returnStatus, DateTime expectedReturnDate)
        {
            var updatedBorrow = await _WithdraweqmRepo.UpdateBorrowReturnStatusAsync(borrowId, returnStatus, expectedReturnDate);
            if (updatedBorrow == null)
            {
                return null;
            }

            return new BorrowDto
            {
                ReturnStatus = updatedBorrow.ReturnStatus,
                ExpectedReturnDate = DateTime.Now
            };
        }
    }

}
