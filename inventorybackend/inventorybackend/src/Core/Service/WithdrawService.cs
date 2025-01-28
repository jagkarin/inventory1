using inventorybackend.src.Core.Interface;
using inventorybackend.src.Entities;
using inventorybackend.src.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace inventorybackend.src.Core.Service
{
    public class WithdrawService : IWithdrawService
    {
        private readonly IWithdrawRepo _WithdrawRepo;
        private readonly DataContext _dataContext;
        private readonly ILogger<WithdrawService> _logger;

        public WithdrawService(IWithdrawRepo WithdrawRepo, DataContext dataContext, ILogger<WithdrawService> logger)
        {
            _WithdrawRepo = WithdrawRepo;
            _dataContext = dataContext;
            _logger = logger;
        }

        public async Task<WithdrawDbo> AddWithdrawAsync(int productId,int userId, string status, string amount)
        {
            try
            {
                // เพิ่มข้อมูลใน Repository
                await _WithdrawRepo.AddProductIDAsync(productId);
                await _WithdrawRepo.AddUserIDAsync(userId);

                // สร้างข้อมูล Withdraw
                var withdraw = new WithdrawDbo
                {
                    ProductID = productId,
                    UserID = userId,
                    Status = status,
                    Amount = amount,
                    CreatedAt = DateTime.Now
                };

                // เพิ่มข้อมูลลงใน DbContext
                await _WithdrawRepo.AddWithdrawAsync(withdraw);  // Assuming this method exists

                return withdraw;  // คืนค่าผลลัพธ์เป็น WithdrawDbo
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while adding withdraw data.", ex);
            }
        }
    }
}
