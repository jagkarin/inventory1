using inventorybackend.src.Entities;

namespace inventorybackend.src.Interface
{
    public interface IWithdrawRepo
    {
        Task AddProductIDAsync(int productId);
        Task AddEqmIDAsync(int eqmId);
        Task AddUserIDAsync(int userId);
        Task AddWithdrawAsync(WithdrawDbo withdraw);
    }
}
