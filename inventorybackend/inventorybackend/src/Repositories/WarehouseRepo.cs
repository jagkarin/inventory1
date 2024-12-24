using inventorybackend.src.Entities;
using inventorybackend.src.Infrastructure.Interface;
using Microsoft.EntityFrameworkCore;

namespace inventorybackend.src.Infrastructure.Repositories
{
    public class WarehouseRepo : IWarehouseRepo
    {
        public readonly DataContext _dbContext;

        public WarehouseRepo(DataContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<WarehouseDbo>> GetAllWarehouseAsync()
        {
            try
            {
                return await _dbContext.Warehouse.ToListAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<WarehouseDbo> AddWarehouseAsync(WarehouseDbo Warehouse)
        {
            try
            {
                _dbContext.Warehouse.Add(Warehouse);
                await _dbContext.SaveChangesAsync();
                return Warehouse;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}
