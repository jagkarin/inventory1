using inventorybackend.src.Entities;

namespace inventorybackend.src.Infrastructure.Interface
{
    public interface IWarehouseRepo
    {
        Task<List<WarehouseDbo>> GetAllWarehouseAsync();
        Task<WarehouseDbo> AddWarehouseAsync(WarehouseDbo Warehouse);
    }
}
