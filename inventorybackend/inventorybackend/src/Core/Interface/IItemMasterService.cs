using inventorybackend.DTOS;
using inventorybackend.src.Entities;

namespace inventorybackend.src.Core.Interface
{
    public interface IItemMasterService
    {
        Task<ItemMasterDbo> AddItemAsync(ItemMasterDto itemDto);
        Task<List<GetItemMasterDto>> GetALLItemMasterAsync();

        Task UpdateItemMasterAsync(UpdateItemMasterDto Itemmaster);
    }
}
