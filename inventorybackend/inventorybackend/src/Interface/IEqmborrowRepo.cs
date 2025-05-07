using inventorybackend.DTOS;
using inventorybackend.src.Entities;

namespace inventorybackend.src.Interface
{
    public interface IEqmborrowRepo
    {
        Task<EquipmentborrowDbo> CreatedEQMborrow(EquipmentborrowDbo Equipment);

        Task<List<EquipmentBorrowJoinDto>> GetALLEQMborrowAsync();

        Task UpdateStatusAsync(UpdateStatusDTO item);
        Task UpdateBorrowStatusAsync(UpdateborrowStatusDTO item);

        Task<List<EquipmentBorrowJoinDto>> GetPendingBorrowsAsync();

        Task<EquipmentborrowDbo> GetBorrowByIdAsync(int borrowId);
        Task<EquipmentborrowDbo> UpdateEQMborrow(EquipmentborrowDbo borrow);
        Task<EquipmentborrowDbo?> GetPendingBorrowByStockIdAsync(int stockId);

        Task<List<EquipmentBorrowJoinDto>> GetBorrowByUserAsync(int userId);
    }
}
