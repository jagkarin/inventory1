using inventorybackend.DTOS;
using inventorybackend.src.Entities;

namespace inventorybackend.src.Interface
{
    public interface IItemMasterRepo
    {
        Task<ItemMasterDbo> AddItemAsync(ItemMasterDbo item);
        Task<List<ItemMasterDbo>> GetALLItemMasterAsync();
        Task UpdateItemMasterAsync(ItemMasterDbo item);
    }
}
