using inventorybackend.DTOS;

namespace inventorybackend.src.Core.Interface
{
    public interface IWarehouseService
    {
        Task<List<WarehouseDTO>> GetAllWarehouseAsync();
    }
}
