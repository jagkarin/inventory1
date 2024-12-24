using inventorybackend.DTOS;
using inventorybackend.src.Core.Interface;
using inventorybackend.src.Core.Service;
using inventorybackend.src.Entities;
using Microsoft.AspNetCore.Mvc;

namespace inventorybackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EquipmentController : Controller
    {
        private readonly IEquipmentService _EquipmentService;
        private readonly ILogger<EquipmentController> _logger;

        public EquipmentController(IEquipmentService equipmentService, ILogger<EquipmentController> logger)
        {
            _EquipmentService = equipmentService;
            _logger = logger;
        }

        [HttpGet("GetAllEquipment")]
        public async Task<IActionResult> GetALLEQMAsync()
        {
            var response = new BaseHttpResponse<List<EQMDTO>>();

            try
            {
                var data = await _EquipmentService.GetALLEQMAsync();
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
                _logger.LogError(ex, "Error getting all Equipment");
                return BadRequest(err);
            }
        }

        [HttpGet("GetProductbyProductID")]
        public async Task<IActionResult> GetEquipmentByIdAsync(int EQMID)
        {
            try
            {
               
                var EquipmentDto = await _EquipmentService.GetEquipmentByIdAsync(EQMID);
                return Ok(EquipmentDto); // ส่งผลลัพธ์กลับในรูปแบบ JSON
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message }); // ส่ง HTTP 404 ถ้าไม่พบข้อมูล
            }
            catch (ApplicationException ex)
            {
                return StatusCode(500, new { message = ex.Message }); // ส่ง HTTP 500 เมื่อเกิดข้อผิดพลาดภายใน
            }
        }

        [HttpGet("GetAllEquipmentCategory")]
        public async Task<IActionResult> GetAllEquipmentCategoryAsync()
        {
            var response = new BaseHttpResponse<List<EqmwithCategory>>();

            try
            {
                var data = await _EquipmentService.GetAllEquipmentCategoryAsync();
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
                _logger.LogError(ex, "Error getting all EquipmentCategory");
                return BadRequest(err);
            }
        }

        [HttpPost("AddEquipment")]
        public async Task<IActionResult> AddEquipmentAsync([FromBody] InputEQMDTO InputEQMDTO)
        {
            var response = new BaseHttpResponse<eqmDbo>();

            try
            {
                var data = await _EquipmentService.AddEquipmentAsync(InputEQMDTO);
                response.SetSuccess(data, "Equipment added successfully", "201");

                return Ok(response);
            }
            catch (Exception ex)
            {
                var err = new ErrorData
                {
                    Code = "-2",
                    Message = ex.Message
                };
                _logger.LogError(ex, "Error adding Equipment");
                response.SetError(err, ex.Message, "500");
                return BadRequest(response);
            }
        }
    }
}
