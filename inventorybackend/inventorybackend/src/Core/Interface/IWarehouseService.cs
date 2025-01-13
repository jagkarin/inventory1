using inventorybackend.DTOS;
using inventorybackend.src.Entities;

namespace inventorybackend.src.Core.Interface
{
    public interface IWarehouseService
    {
        Task<List<WarehouseDTO>> GetAllWarehouseAsync();
        Task<WarehouseDbo> AddWarehouseAsync(InputWarehouseDTO InputWarehouseDTO);
    }
}
