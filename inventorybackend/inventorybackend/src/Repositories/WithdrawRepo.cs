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

        public async Task AddProductIDAsync(int productId)
        {
            var withdraw = new WithdrawDbo
            {
                ProductID = productId
            };
            _dbContext.Withdraw.Add(withdraw);
            await _dbContext.SaveChangesAsync();
        }

        public async Task AddEqmIDAsync(int eqmId)
        {
            var withdraw = new WithdrawDbo
            {
                ProductID = eqmId
            };
            _dbContext.Withdraw.Add(withdraw);
            await _dbContext.SaveChangesAsync();
        }

        public async Task AddUserIDAsync(int userId)
        {
            var withdraw = new WithdrawDbo
            {
                UserID = userId
            };
            _dbContext.Withdraw.Add(withdraw);
            await _dbContext.SaveChangesAsync();
        }

        public async Task AddWithdrawAsync(WithdrawDbo withdraw)
        {
            await _dbContext.Withdraw.AddAsync(withdraw);
            await _dbContext.SaveChangesAsync();
        }
    }
}
