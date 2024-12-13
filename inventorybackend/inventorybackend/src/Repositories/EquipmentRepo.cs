using inventorybackend.src.Entities;
using inventorybackend.src.Interface;
using Microsoft.EntityFrameworkCore;

namespace inventorybackend.src.Repositories
{
    public class EquipmentRepo : IEquipmentRepo
    {
        public readonly DataContext _dbContext;
        private readonly ILogger<eqmDbo> _logger;

        public EquipmentRepo(DataContext dbContext, ILogger<eqmDbo> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<List<eqmDbo>> GetALLEQMAsync()
        {
            try
            {
                return await _dbContext.EQM.ToListAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
