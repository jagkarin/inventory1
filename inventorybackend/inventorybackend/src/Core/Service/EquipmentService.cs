using inventorybackend.DTOS;
using inventorybackend.src.Core.Interface;
using inventorybackend.src.Interface;
using inventorybackend.src.Repositories;

namespace inventorybackend.src.Core.Service
{
    public class EquipmentService : IEquipmentService
    {
        private readonly IEquipmentRepo _equipmentRepo;
        private readonly DataContext _dataContext;
        private readonly ILogger<EquipmentService> _logger;

        public EquipmentService(IEquipmentRepo equipmentRepo, DataContext dataContext, ILogger<EquipmentService> logger)
        {
            _equipmentRepo = equipmentRepo;
            _dataContext = dataContext;
            _logger = logger;
        }

        public async Task<List<EQMDTO>> GetALLEQMAsync()
        {
            try
            {
                var EqmtuseData = await _equipmentRepo.GetALLEQMAsync();
                var EqmuseReturn = EqmtuseData.Select(s => new EQMDTO
                {
                    EQMID = s.EQMID,
                    EQMName = s.EQMName,
                    EQMDescription = s.EQMDescription,
                    Adddate = s.Adddate,
                    Category_ID = s.Category_ID,
                    Quantity = s.Quantity,

                }).ToList();

                return EqmuseReturn;
            }
            catch (Exception ex)
            {

                throw new ApplicationException("An error occurred while getting the Equipment data.", ex);
            }
        }
    }
}
