using inventorybackend.DTOS;
using inventorybackend.src.Entities;
using inventorybackend.src.Interface;
using inventorybackend.src.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace inventorybackend.src.Repositories
{
    public class WithdraweqmRepo : IWithdraweqmRepo
    {
        private readonly DataContext _dbContext;
        private readonly ILogger<WithdraweqmRepo> _logger;

        public WithdraweqmRepo(DataContext dbContext, ILogger<WithdraweqmRepo> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<List<BorrowDto>> GetAllBorrowsAsync()
        {
            var borrows = await (from b in _dbContext.Borroweqm
                                 join u in _dbContext.User on b.UserID equals u.UserID
                                 select new
                                 {
                                     Borrow = b,
                                     User = u
                                 }).ToListAsync();

            var result = new List<BorrowDto>();
            foreach (var borrow in borrows)
            {
                var borrowDetails = JsonConvert.DeserializeObject<List<BorrowDetail>>(borrow.Borrow.BorrowDetails ?? "[]") ?? new List<BorrowDetail>();
                var eqmNames = borrowDetails.Select(d => d.EQMNAME).ToList();
                var equipments = await GetEquipmentByNamesAsync(eqmNames); // เรียกใช้เมธอดที่เพิ่ม

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

                result.Add(new BorrowDto
                {
                    BorrowId = borrow.Borrow.BorrowID,
                    UserId = borrow.Borrow.UserID,
                    BorrowDate = borrow.Borrow.BorrowDate,
                    ExpectedReturnDate = borrow.Borrow.ExpectedReturnDate,
                    Status = borrow.Borrow.Status ?? string.Empty,
                    BorrowDetails = detailsWithImages,
                    Firstname = borrow.User.Firstname,
                    Lastname = borrow.User.Lastname,
                    BorrowCode = borrow.Borrow.BorrowCode,
                    ReturnStatus = borrow.Borrow.ReturnStatus
                });
            }

            return result;
        }

        public async Task<BorroweqmDbo> GetBorrowByIdAsync(int borrowId)
        {
            return await _dbContext.Borroweqm.FindAsync(borrowId);
        }

        public async Task<BorroweqmDbo> GetBorrowByuserIdAsync(int UserID)
        {
            return await _dbContext.Borroweqm.FindAsync(UserID);
        }

        public async Task<BorroweqmDbo> GetLastBorrowByPrefixAsync(string prefix)
        {
            return await _dbContext.Borroweqm
                .Where(b => b.BorrowCode.StartsWith(prefix))
                .OrderByDescending(b => b.BorrowCode)
                .FirstOrDefaultAsync();
        }

        public async Task<bool> BorrowCodeExistsAsync(string borrowCode)
        {
            return await _dbContext.Borroweqm.AnyAsync(b => b.BorrowCode == borrowCode);
        }

        public async Task<BorroweqmDbo> AddBorrowAsync(BorroweqmDbo borrow)
        {
            Console.WriteLine("Adding borrow to context");
            _dbContext.Borroweqm.Add(borrow);
            Console.WriteLine($"Borrow details count: {borrow.GetBorrowDetails().Count}");

            int rowsAffected = await _dbContext.SaveChangesAsync();
            Console.WriteLine($"Rows affected: {rowsAffected}");

            return borrow;
        }

        public async Task<BorroweqmDbo> UpdateBorrowStatusAsync(int borrowId, string? status, string? returnStatus)
        {
            var borrow = await _dbContext.Borroweqm.FindAsync(borrowId);
            if (borrow == null)
            {
                return null;
            }

            borrow.Status = status;
            borrow.ReturnStatus = returnStatus;
            _dbContext.Entry(borrow).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();

            return borrow;
        }

        public async Task<BorroweqmDbo> UpdateBorrowReturnStatusAsync(int borrowId, string? returnStatus, DateTime expectedReturnDate)
        {
            var borrowreturn = await _dbContext.Borroweqm.FindAsync(borrowId);
            if (borrowreturn == null)
            {
                return null;
            }

            borrowreturn.ReturnStatus = returnStatus;
            borrowreturn.ExpectedReturnDate = DateTime.Now; // ใช้ค่าใหม่จาก parameter
            _dbContext.Entry(borrowreturn).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();

            return borrowreturn;
        }

        public async Task<List<eqmDbo>> GetEquipmentByNamesAsync(List<string> eqmNames)
        {
            return await _dbContext.EQM
                .Where(e => eqmNames.Contains(e.EQM_Name))
                .GroupBy(e => e.EQM_Name)
                .Select(g => g.First())
                .ToListAsync();
        }
    }
}

