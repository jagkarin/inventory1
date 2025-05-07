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
        private readonly IWebHostEnvironment _env;

        public EquipmentController(IEquipmentService equipmentService, ILogger<EquipmentController> logger, IWebHostEnvironment env)
        {
            _EquipmentService = equipmentService;
            _logger = logger;
            _env = env;
            // ตรวจสอบและสร้างโฟลเดอร์ asset ใน wwwroot
            if (!Directory.Exists(Path.Combine(_env.WebRootPath, "asset")))
            {
                Directory.CreateDirectory(Path.Combine(_env.WebRootPath, "asset"));
            }
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

        [HttpPost("addimage")]
        public async Task<IActionResult> AddEquipment([FromForm] EquipmentwithimageDTO EQMDto, IFormFile? EQMImage)
        {
            string? relativePath = null;

            if (EQMImage != null && EQMImage.Length > 0)
            {
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(EQMImage.FileName)}";
                var fullPath = Path.Combine(_env.WebRootPath, "asset", fileName);
                relativePath = $"/asset/{fileName}"; // ต้องมี / หน้า path

                Directory.CreateDirectory(Path.Combine(_env.WebRootPath, "asset"));

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await EQMImage.CopyToAsync(stream);
                }
            }

            EQMDto.EQMimage = relativePath;
            var result = await _EquipmentService.AddEquipmentAsync(EQMDto, relativePath);

            return Ok(result);
        }

        [HttpPut("UpdateEquipment")]
        public async Task<IActionResult> UpdateEQMAsync(int EQMID, [FromBody] UpdateEquipmentDTO UpdateEquipment)
        {
            var response = new BaseHttpResponse<UpdateEquipmentDTO>();

            try
            {
                UpdateEquipment.EQMID = EQMID;

                _logger.LogInformation("Updating Equipment with ID: {EQMID}", EQMID);

                var data = await _EquipmentService.UpdateEQMAsync(UpdateEquipment);
                response.SetSuccess(data, "Product updated successfully", "200");
                return Ok(response);
            }
            catch (Exception ex)
            {
                var err = new ErrorData
                {
                    Code = "-2",
                    Message = ex.Message
                };
                _logger.LogError(ex, "Error updating Equipment with ID: {EQMID}. Inner exception: {InnerException}", EQMID, ex.InnerException?.Message);
                response.SetError(err, ex.Message, "500");
                return BadRequest(response);
            }
        }




        [HttpPut("updateEquipment/{EQMID}")]
        public async Task<IActionResult> UpdateEQM(int EQMID, [FromForm] EquipmentwithimageDTO EQMDto, IFormFile? EQMImage)
        {
            string? relativePath = null;

            if (EQMImage != null)
            {
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(EQMImage.FileName)}";
                var fullPath = Path.Combine(_env.WebRootPath, "asset", fileName);
                relativePath = $"/asset/{fileName}"; // ต้องมี / หน้า path

                Directory.CreateDirectory(Path.Combine(_env.WebRootPath, "asset"));

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await EQMImage.CopyToAsync(stream);
                }
            }

            try
            {
                // อัปเดต EQMID ใน DTO เพื่อให้ตรงกับ parameter
                EQMDto.EQMID = EQMID;

                // เรียกใช้ Service เพื่ออัปเดตข้อมูลสินค้าและรูปภาพ
                await _EquipmentService.UpdateEQMwithimageAsync(EQMDto, relativePath);

                return Ok(new { message = "Equipment updated successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating Equipment with ID: {EQMID}", EQMID);
                return StatusCode(500, new { error = ex.Message });
            }
        }


        [HttpDelete("{EQMID}")]
        public async Task<IActionResult> DeleteEQM(int EQMID)
        {
            var product = await _EquipmentService.GetEquipmentByIdAsync(EQMID);
            if (product == null)
            {
                return NotFound(new { Message = "ไม่พบข้อมูลผลิตภัณฑ์ที่ต้องการลบ" }); // สถานะ HTTP 404
            }
            else
            {
                var isDeleted = await _EquipmentService.DeleteEQMAsync(EQMID);
                if (isDeleted)
                {
                    return Ok(new { Message = "ลบข้อมูลสำเร็จ" }); // สถานะ HTTP 200
                }
                else
                {
                    return StatusCode(500, new { Message = "เกิดข้อผิดพลาดในการลบข้อมูล" }); // สถานะ HTTP 500
                }
            }
        }


    }
}
