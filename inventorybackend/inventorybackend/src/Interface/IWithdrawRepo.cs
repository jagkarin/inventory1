using inventorybackend.DTOS;
using inventorybackend.src.Entities;

namespace inventorybackend.src.Interface
{
    public interface IWithdrawRepo
    {
        Task<bool> AddWithdrawsAsync(List<WithdrawDbo> withdrawList);

        Task<List<WithdrawUsername>> GetAllWithdraws0Async();

        Task<List<WithdrawUsername>> GetAllWithdraws1Async();

        Task<List<WithdrawUsername>> GetAllWithdraws2Async();

        Task<bool> UpdateWithdrawStatusAsync(int withdrawID, int status);
    }
}
