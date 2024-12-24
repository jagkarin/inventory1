using inventorybackend.DTOS;
using inventorybackend.src.Core.Interface;
using inventorybackend.src.Entities;
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

        public async Task<EQMDTO> GetEquipmentByIdAsync(int EQMID)
        {
            try
            {
                var eqmusedto = await _equipmentRepo.GetEquipmentByIdAsync(EQMID);
                var eqmDto = new EQMDTO
                {
                    EQMID = eqmusedto.EQMID,
                    EQMName= eqmusedto.EQMName,
                    EQMDescription= eqmusedto.EQMDescription,
                    Adddate= eqmusedto.Adddate,
                    Quantity= eqmusedto.Quantity,
                    Category_ID= eqmusedto.Category_ID,
                };

                return eqmDto;
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"ไม่พบข้อมูล: {ex.Message}", ex);
            }
        }

        public async Task<List<EqmwithCategory>> GetAllEquipmentCategoryAsync()
        {
            try
            {
                var productcate = await _equipmentRepo.GetAllEquipmentCategoryAsync();
                return productcate;
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"An error occurred while retrieving the Equipment Category: {ex.Message}", ex);
            }
        }


        public async Task<eqmDbo> AddEquipmentAsync(InputEQMDTO InputEQMDTO)
        {
            try
            {
                var eqm = new Entities.eqmDbo
                {
                    EQMName = InputEQMDTO.EQMName,
                    EQMDescription  = InputEQMDTO.EQMDescription,
                    Adddate = DateTime.Now,
                    Quantity= InputEQMDTO.Quantity,
                    Category_ID = InputEQMDTO.Category_ID,


                };
                var addeqm = await _equipmentRepo.AddEquipmentAsync(eqm);
                return new eqmDbo
                {
                    EQMName= addeqm.EQMName,
                    EQMDescription= addeqm.EQMDescription,
                    Adddate= DateTime.Now,
                    Quantity= addeqm.Quantity,
                    Category_ID= addeqm.Category_ID,
                };
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while adding data.", ex);
            }
        }
    }
}
