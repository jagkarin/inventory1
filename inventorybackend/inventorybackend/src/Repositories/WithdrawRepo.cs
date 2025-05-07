using inventorybackend.DTOS;
using inventorybackend.src.Entities;
using inventorybackend.src.Interface;
using Microsoft.EntityFrameworkCore;


namespace inventorybackend.src.Repositories
{
    public class WithdrawRepo : IWithdrawRepo
    {
        private readonly DataContext _dbContext;
        private readonly ILogger<WithdrawRepo> _logger;

        public WithdrawRepo(DataContext dbContext, ILogger<WithdrawRepo> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<bool> AddWithdrawsAsync(List<WithdrawDbo> withdrawList)
        {
            await _dbContext.Withdraw.AddRangeAsync(withdrawList);
            return await _dbContext.SaveChangesAsync() > 0;
        }


        public async Task<List<WithdrawUsername>> GetAllWithdraws0Async()
        {
            var withdraw0 = await (from w in _dbContext.Withdraw
                                   join u in _dbContext.User on w.UserID equals u.UserID
                                   join p in _dbContext.Product on w.ProductID equals p.ProductsID
                                   where w.Status == 0
                                   select new WithdrawUsername
                                   {
                                       WithdrawID = w.WithdrawID,
                                       ProductID = w.ProductID,
                                       ProductName = p.ProductsName,
                                       Product_image = p.Productimage,  // เพิ่มการดึงข้อมูลรูปภาพ
                                       Status = w.Status,
                                       Amount = w.Amount,
                                       CreatedAt = w.CreatedAt,
                                       UserID = w.UserID,
                                       Firstname = u.Firstname,
                                       Lastname = u.Lastname,
                                   }).ToListAsync();

            return withdraw0;
        }


        public async Task<List<WithdrawUsername>> GetAllWithdraws1Async()
        {
            var withdraw1 = await (from w in _dbContext.Withdraw
                                   join u in _dbContext.User on w.UserID equals u.UserID
                                   join p in _dbContext.Product on w.ProductID equals p.ProductsID
                                   where w.Status == 1
                                   select new WithdrawUsername
                                   {
                                       WithdrawID = w.WithdrawID,
                                       ProductID = w.ProductID,
                                       ProductName = p.ProductsName,
                                       Product_image = p.Productimage,  // เพิ่มการดึงข้อมูลรูปภาพ
                                       Status = w.Status,
                                       Amount = w.Amount,
                                       CreatedAt = w.CreatedAt,
                                       UserID = w.UserID,
                                       Firstname = u.Firstname,
                                       Lastname = u.Lastname,
                                   }).ToListAsync();

            return withdraw1;
        }

        public async Task<List<WithdrawUsername>> GetAllWithdraws2Async()
        {
            var withdraw2 = await (from w in _dbContext.Withdraw
                                   join u in _dbContext.User on w.UserID equals u.UserID
                                   join p in _dbContext.Product on w.ProductID equals p.ProductsID
                                   where w.Status == 2
                                   select new WithdrawUsername
                                   {
                                       WithdrawID = w.WithdrawID,
                                       ProductID = w.ProductID,
                                       ProductName = p.ProductsName,
                                       Product_image = p.Productimage,  // เพิ่มการดึงข้อมูลรูปภาพ
                                       Status = w.Status,
                                       Amount = w.Amount,
                                       CreatedAt = w.CreatedAt,
                                       UserID = w.UserID,
                                       Firstname = u.Firstname,
                                       Lastname = u.Lastname,
                                   }).ToListAsync();

            return withdraw2;
        }

        public async Task<bool> UpdateWithdrawStatusAsync(int withdrawID, int status)
        {
            var withdraw = await _dbContext.Withdraw.FirstOrDefaultAsync(w => w.WithdrawID == withdrawID);
            if (withdraw == null)
            {
                _logger.LogWarning($"Withdraw ID {withdrawID} not found.");
                return false;
            }

            withdraw.Status = status;
            return await _dbContext.SaveChangesAsync() > 0;
        }


    }
}
