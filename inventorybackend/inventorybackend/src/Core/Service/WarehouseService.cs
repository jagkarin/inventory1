using inventorybackend.src.Core.Interface;
using inventorybackend.src.Infrastructure.Interface;
using inventorybackend.DTOS;
using inventorybackend.src.Entities;

namespace inventorybackend.src.Core.Service
{
    public class WarehouseService : IWarehouseService
    {
        private readonly IWarehouseRepo _WarehouseRepo;
        private readonly DataContext _dataContext;

        public WarehouseService(IWarehouseRepo warehouseRepo, DataContext dataContext)
        {
            _WarehouseRepo = warehouseRepo;
            _dataContext = dataContext;
        }

        public async Task<List<WarehouseDTO>> GetAllWarehouseAsync()
        {
            try
            {
                var WarehouseData = await _WarehouseRepo.GetAllWarehouseAsync();
                var WarehouseReturn = WarehouseData.Select(s => new WarehouseDTO
                {
                    Warehouseaddress = s.WarehouseAddress,
                    Warehousename = s.WarehouseName,
                    Warehouseid = s.WarehouseID,

                }).ToList();

                return WarehouseReturn;
            }
            catch (Exception ex)
            {

                throw new ApplicationException("An error occurred while getting the Warehouse data.", ex);
            }
        }

        public async Task<WarehouseDbo> AddWarehouseAsync(InputWarehouseDTO InputWarehouseDTO)
        {
            try
            {
                var warehouse = new Entities.WarehouseDbo
                {
                    WarehouseID = InputWarehouseDTO.Warehouseid,
                    WarehouseName = InputWarehouseDTO.Warehousename,
                    WarehouseAddress = InputWarehouseDTO.Warehouseaddress,


                };
                var addwarehouse = await _WarehouseRepo.AddWarehouseAsync(warehouse);
                return new WarehouseDbo
                {
                    WarehouseID = addwarehouse.WarehouseID,
                    WarehouseName = addwarehouse.WarehouseName,
                    WarehouseAddress = addwarehouse.WarehouseAddress,
                };
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while adding data.", ex);
            }
        }
    }
}
