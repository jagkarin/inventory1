using inventorybackend.DTOS;
using inventorybackend.src.Entities;

namespace inventorybackend.src.Core.Interface
{
    public interface IWithdraweqmService
    {
        Task<List<BorrowDto>> GetAllBorrowsAsync();
        Task<BorrowDto> GetBorrowByIdAsync(int borrowId);
        Task<BorrowDto> UpdateBorrowStatusAsync(int borrowId, string? status, string? ReturnStatus);
        Task<BorrowDto> AddBorrowAsync(CreateBorrowDto createBorrowDto);

        Task<BorrowDto> UpdateBorrowReturnAsync(int borrowId, string? ReturnStatus, DateTime ExpectedReturnDate);
    }
}
