using inventorybackend.src.Core.Interface;
using inventorybackend.src.Entities;
using Microsoft.AspNetCore.Mvc;
using inventorybackend.DTOS;

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
    }
}
