using inventorybackend.DTOS;
using inventorybackend.src.Entities;

namespace inventorybackend.src.Core.Interface
{
    public interface IWithdrawService
    {
        Task<bool> CreateWithdrawAsync(List<WithdrawDto> withdrawDtos);
        Task<List<WithdrawUsername>> GetWithdraws0Async();

        Task<List<WithdrawUsername>> GetWithdraws1Async();

        Task<List<WithdrawUsername>> GetWithdraws2Async();

        Task<bool> UpdateWithdrawStatusAsync(int withdrawID, int status);
    }
}
