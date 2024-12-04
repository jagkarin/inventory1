using inventorybackend.src.Entities;

namespace inventorybackend.src.Infrastructure.Interface
{
    public interface IWarehouseRepo
    {
        Task<List<WarehouseDbo>> GetAllWarehouseAsync();
    }
}
