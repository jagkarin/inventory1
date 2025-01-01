using inventorybackend.DTOS;
using inventorybackend.src.Core.Interface;
using inventorybackend.src.Core.Service;
using inventorybackend.src.Entities;
using inventorybackend.src.Interface;
using Microsoft.AspNetCore.Mvc;

namespace inventorybackend.Controllers
{
    public class UserController : Controller
    {
        private readonly IUserService _UserService;
        private readonly ILogger<UserController> _logger;
        private readonly IUserRepo _userRepo;
        private readonly string _imagePath = @"E:\GIt\inven\inventoryfrontend\src\asset";

        public UserController(IUserService userService, ILogger<UserController> logger , IUserRepo userRepo)
        {
            _UserService = userService;
            _userRepo = userRepo;
            _logger = logger;
            if (!Directory.Exists(_imagePath))
            {
                Directory.CreateDirectory(_imagePath); // ตรวจสอบและสร้างโฟลเดอร์หากยังไม่มี
            }
        }

        [HttpGet("GetAllUserwithrole")]
        public async Task<IActionResult> GetALLUserwithroleAsync()
        {
            var response = new BaseHttpResponse<List<UserwithroleDTO>>();

            try
            {
                var data = await _UserService.GetALLUserwithroleAsync();
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
                _logger.LogError(ex, "Error getting all Userwithrole");
                return BadRequest(err);
            }
        }

        [HttpGet("GetALLUserAsync")]
        public async Task<IActionResult> GetALLUserAsync()
        {
            var response = new BaseHttpResponse<List<UserDTO>>();

            try
            {
                var data = await _UserService.GetALLUserAsync();
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
                _logger.LogError(ex, "Error getting all User");
                return BadRequest(err);
            }
        }

        [HttpGet("GetUserbyuserID")]
        public async Task<IActionResult> GetUserByuserIDAsync(int userid)
        {
            try
            {

                var userDto = await _UserService.GetUserByuserIDAsync(userid);
                return Ok(userDto); // ส่งผลลัพธ์กลับในรูปแบบ JSON
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

        [HttpPost("AddUser")]
        public async Task<IActionResult> AddUserAsync([FromBody] inputuser inputuser)
        {
            var response = new BaseHttpResponse<UserDbo>();

            try
            {
                var data = await _UserService.AddUserAsync(inputuser);
                response.SetSuccess(data, "Product added successfully", "201");

                return Ok(response);
            }
            catch (Exception ex)
            {
                var err = new ErrorData
                {
                    Code = "-2",
                    Message = ex.Message
                };
                _logger.LogError(ex, "Error adding User");
                response.SetError(err, ex.Message, "500");
                return BadRequest(response);
            }
        }

        [HttpPut("update-profile-image")]
        public async Task<IActionResult> UpdateProfileImage([FromForm] Userprofile userprofile, IFormFile userimage)
        {
            if (userimage == null || userimage.Length == 0)
                return BadRequest("Please upload a valid image.");

            // สร้างชื่อไฟล์ใหม่ด้วย GUID เพื่อป้องกันชื่อซ้ำกัน
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(userimage.FileName)}";
            var fullPath = Path.Combine(_imagePath, fileName);

            // บันทึกรูปภาพลง path
            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await userimage.CopyToAsync(stream);
            }

            // บันทึกข้อมูลสินค้า พร้อม path ของรูปในฐานข้อมูล
            productDto.Productimage = fullPath; // อัปเดต path ใน Dto

            var result = await _ProductService.AddProductAsync(productDto, fullPath);

            return Ok(result);
        }



    }
}
