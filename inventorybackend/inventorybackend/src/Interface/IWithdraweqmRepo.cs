using inventorybackend.DTOS;
using inventorybackend.src.Entities;

namespace inventorybackend.src.Interface
{
    public interface IWithdraweqmRepo
    {
        Task<List<BorrowDto>> GetAllBorrowsAsync();
        Task<BorroweqmDbo> GetBorrowByIdAsync(int borrowId);
        Task<BorroweqmDbo> AddBorrowAsync(BorroweqmDbo borrow);
        Task<BorroweqmDbo> UpdateBorrowStatusAsync(int borrowId, string? status, string? ReturnStatus);


        Task<BorroweqmDbo> GetLastBorrowByPrefixAsync(string prefix);
        Task<bool> BorrowCodeExistsAsync(string borrowCode);
        Task<BorroweqmDbo> UpdateBorrowReturnStatusAsync(int borrowId, string? ReturnStatus, DateTime ExpectedReturnDate);


        Task<List<eqmDbo>> GetEquipmentByNamesAsync(List<string> eqmNames);

    }
}
