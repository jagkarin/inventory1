using inventorybackend.src.Core.Interface;
using inventorybackend.src.Entities;
using Microsoft.AspNetCore.Mvc;
using inventorybackend.DTOS;
using inventorybackend.src.Core.Service;

namespace inventorybackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WarehouseController : Controller
    {
        private readonly IWarehouseService _WarehouseService;
        private readonly ILogger<WarehouseController> _logger;

        public WarehouseController(IWarehouseService warehouseService, ILogger<WarehouseController> logger)
        {
            _WarehouseService = warehouseService;
            _logger = logger;
        }

        [HttpGet("GetAllWarehouse")]
        public async Task<IActionResult> GetAllWarehouseAsync()
        {
            var response = new BaseHttpResponse<List<WarehouseDTO>>();

            try
            {
                var data = await _WarehouseService.GetAllWarehouseAsync();
                response.SetSuccess(data, "Success", "200");
                return Ok(response);
            }
            catch (Exception ex)
            {
                var err = new ErrorData
                {
                    Code = "-2",
                    Message = ex.Message
                };
                _logger.LogError(ex, "Error getting all warehouses");
                return BadRequest(err);
            }
        }

        [HttpPost("AddWarehouse")]
        public async Task<IActionResult> AddWarehouseAsync([FromBody] InputWarehouseDTO InputWarehouseDTO)
        {
            var response = new BaseHttpResponse<WarehouseDbo>();

            try
            {
                var data = await _WarehouseService.AddWarehouseAsync(InputWarehouseDTO);
                response.SetSuccess(data, "เพิ่มโกดังสำเร็จ", "201");

                return Ok(response);
            }
            catch (Exception ex)
            {
                var err = new ErrorData
                {
                    Code = "-2",
                    Message = ex.Message
                };
                _logger.LogError(ex, "ไม่สามารถเพิ่มโกดังได้");
                response.SetError(err, ex.Message, "500");
                return BadRequest(response);
            }
        }
    }
}
