using inventorybackend.src.Entities;
using inventorybackend.src.Interface;

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


    }
}
