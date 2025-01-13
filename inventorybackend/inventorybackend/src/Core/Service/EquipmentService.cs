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
                    EQMimage = s.EQMimage,

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

                if (eqmusedto == null)
                {
                    throw new ApplicationException($"ไม่พบข้อมูลอุปกรณ์ที่มีรหัส {EQMID}");
                }

                var eqmDto = new EQMDTO
                {
                    EQMID = eqmusedto.EQMID,
                    EQMName = eqmusedto.EQMName,
                    EQMDescription = eqmusedto.EQMDescription,
                    Adddate = eqmusedto.Adddate,
                    Quantity = eqmusedto.Quantity,
                    Category_ID = eqmusedto.Category_ID,
                    EQMimage= eqmusedto.EQMimage,
                };

                return eqmDto;
            }
            catch (ApplicationException ex)
            {
                // ส่งต่อข้อผิดพลาดแบบ custom
                throw;
            }
            catch (Exception ex)
            {
                // จับข้อผิดพลาดทั่วไปที่ไม่คาดคิด
                throw new ApplicationException($"เกิดข้อผิดพลาด: {ex.Message}", ex);
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
                    EQMimage = InputEQMDTO.EQMimage,


                };
                var addeqm = await _equipmentRepo.AddEquipmentAsync(eqm);
                return new eqmDbo
                {
                    EQMID = addeqm.EQMID,
                    EQMName= addeqm.EQMName,
                    EQMDescription= addeqm.EQMDescription,
                    Adddate= DateTime.Now,
                    Quantity= addeqm.Quantity,
                    Category_ID= addeqm.Category_ID,
                    EQMimage= addeqm.EQMimage,
                };
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while adding data.", ex);
            }
        }

        public async Task<bool> DeleteEQMAsync(int EQMID)
        {
            var product = await _equipmentRepo.GetEquipmentByIdAsync(EQMID); // ตรวจสอบว่ามีข้อมูลหรือไม่
            if (product == null)
            {
                return false; // คืนค่า false ถ้าไม่พบข้อมูล
            }

            await _equipmentRepo.DeleteEQMAsync(EQMID); // ลบข้อมูล
            return true; // คืนค่า true ถ้าลบสำเร็จ
        }

        public async Task<UpdateEquipmentDTO> UpdateEQMAsync(UpdateEquipmentDTO UpdateEquipment)
        {
            try
            {
                // ?????????????????????????
                _logger.LogInformation("Received request to update Equipment with ID: {EQMID} ", UpdateEquipment.EQMID);

                var eqm = new Entities.eqmDbo
                {
                    EQMID= UpdateEquipment.EQMID,
                    EQMName = UpdateEquipment.EQMName,
                    EQMDescription = UpdateEquipment.EQMDescription,
                    EQMimage = UpdateEquipment.EQMimage,
                    Category_ID = UpdateEquipment.Category_ID,
                    Quantity = UpdateEquipment.Quantity,
                    Adddate = DateTime.Now,

                };


                var updatedeqm = await _equipmentRepo.UpdateEQMAsync(eqm);

                _logger.LogInformation("Successfully updated Equipment with ID: {EQMID}", UpdateEquipment.EQMID);

                return new UpdateEquipmentDTO
                {
                    EQMID = UpdateEquipment.EQMID,
                    EQMimage= UpdateEquipment.EQMimage,
                    EQMDescription = UpdateEquipment.EQMDescription,
                    EQMName = UpdateEquipment.EQMName,
                    Category_ID= UpdateEquipment.Category_ID,
                    Quantity = UpdateEquipment.Quantity,
                    Adddate = DateTime.Now,
                    
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating Equipment with ID: {EQMID}. Inner exception: {InnerException}", UpdateEquipment.EQMID, ex.InnerException?.Message);
                throw new Exception("Error occurred while updating Equipment", ex);
            }
        }
    }
}
