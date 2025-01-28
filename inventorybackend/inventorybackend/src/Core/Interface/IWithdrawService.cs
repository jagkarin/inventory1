using inventorybackend.src.Entities;

namespace inventorybackend.src.Core.Interface
{
    public interface IWithdrawService
    {
        Task<WithdrawDbo> AddWithdrawAsync(int productId, int userId, string status, string amount);
    }
}
