using inventorybackend.DTOS;
using inventorybackend.src.Entities;

namespace inventorybackend.src.Core.Interface
{
    public interface IEqmborrowService
    {
        Task<EquipmentborrowDbo> RequestBorrowAsync(EquipmentBorrowDto borrowDto);
        Task<List<EquipmentBorrowJoinDto>> GetALLEQMjoinAsync();
        Task<EquipmentborrowDbo> ReturnBorrowAsync(EquipmentBorrowReturnDto returnDto);
        Task<EquipmentborrowDbo> ApproveBorrowAsync(EquipmentBorrowUpdateDto updateDto);
        Task<List<EquipmentBorrowJoinDto>> GetPendingBorrowsAsync();
        Task<List<EquipmentBorrowJoinDto>> GetBorrowByUserIDAsync(int userId);
    }
}
