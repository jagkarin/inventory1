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
        private readonly string _imagePath = @"E:\GIt\inven\inventoryfrontend\src\asset";

        public EquipmentController(IEquipmentService equipmentService, ILogger<EquipmentController> logger)
        {
            _EquipmentService = equipmentService;
            _logger = logger;
            if (!Directory.Exists(_imagePath))
            {
                Directory.CreateDirectory(_imagePath); // ตรวจสอบและสร้างโฟลเดอร์หากยังไม่มี
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


        [HttpPut("UpdateEquipment")]
        public async Task<IActionResult> UpdateEQMAsync(int EQMID ,[FromBody] UpdateEquipmentDTO UpdateEquipment)
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

        [HttpPost("addimage")]
        public async Task<IActionResult> AddEquipment([FromForm] EquipmentwithimageDTO EQMDto, IFormFile? productImage)
        {
            string? fullPath = null;

            // ตรวจสอบว่ามีการอัปโหลดรูปภาพหรือไม่
            if (productImage != null && productImage.Length > 0)
            {
                // สร้างชื่อไฟล์ใหม่ด้วย GUID เพื่อป้องกันชื่อซ้ำกัน
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(productImage.FileName)}";
                fullPath = Path.Combine(_imagePath, fileName);

                // บันทึกรูปภาพลง path
                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await productImage.CopyToAsync(stream);
                }
            }

            // บันทึกข้อมูลอุปกรณ์ พร้อม path ของรูปในฐานข้อมูล (ถ้ามี)
            EQMDto.EQMimage = fullPath;

            // เรียกใช้งาน Service เพื่อเพิ่มข้อมูล
            var result = await _EquipmentService.AddEquipmentAsync(EQMDto, fullPath);

            return Ok(result);
        }

    }
}
