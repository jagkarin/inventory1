using inventorybackend.DTOS;
using inventorybackend.src.Core.Interface;
using inventorybackend.src.Core.Service;
using inventorybackend.src.Entities;
using inventorybackend.src.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

namespace inventorybackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly IUserService _UserService;
        private readonly ILogger<UserController> _logger;
        private readonly IUserRepo _userRepo;
        public readonly DataContext _dbContext;
        private readonly IWebHostEnvironment _env;

        public UserController(IUserService userService, ILogger<UserController> logger , IUserRepo userRepo, DataContext _dataContext, IWebHostEnvironment env)
        {
            _UserService = userService;
            _dbContext = _dataContext;
            _userRepo = userRepo;
            _logger = logger;
            _env = env;
            // ตรวจสอบและสร้างโฟลเดอร์ asset ใน wwwroot
            if (!Directory.Exists(Path.Combine(_env.WebRootPath, "profile")))
            {
                Directory.CreateDirectory(Path.Combine(_env.WebRootPath, "profile"));
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


        [HttpPut("UpdateUserProfilebyAdmin")]
        public async Task<IActionResult> UpdateUserprofileAsync(int UserID, [FromBody] UpdateUserProfliebyadmin UserProflie)
        {
            var response = new BaseHttpResponse<UpdateUserProfliebyadmin>();

            try
            {
                UserProflie.UserID = UserID;

                _logger.LogInformation("Updating User with ID: {UserID}", UserID);

                var data = await _UserService.UpdateUserprofileAsync(UserProflie);
                response.SetSuccess(data, "User updated successfully", "200");
                return Ok(response);
            }
            catch (Exception ex)
            {
                var err = new ErrorData
                {
                    Code = "-2",
                    Message = ex.Message
                };
                _logger.LogError(ex, "Error updating User with ID: {UserID}. Inner exception: {InnerException}", UserID, ex.InnerException?.Message);
                response.SetError(err, ex.Message, "500");
                return BadRequest(response);
            }
        }


        [HttpPut("/status{userId}")]
        public async Task<IActionResult> UpdateUserStatus(int userId, [FromBody] UpdateStatusDto request)
        {
            if (request == null || !ModelState.IsValid)
            {
                return BadRequest("Invalid request data.");
            }

            // ตรวจสอบว่า IsActive เป็น 0 หรือ 1 เท่านั้น
            if (request.IsActive != 0 && request.IsActive != 1)
            {
                return BadRequest("IsActive must be 0 or 1.");
            }

            var result = await _UserService.UpdateUserStatusAsync(userId, request.IsActive);
            if (!result)
            {
                return NotFound($"User with ID {userId} not found.");
            }

            try
            {
                return Ok(new { message = "User status updated successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("/User{UserID}")]
        public async Task<IActionResult> DeleteProduct(int UserID)
        {
            var User = await _UserService.GetUserByuserIDAsync(UserID);
            if (User == null)
            {
                return NotFound(new { Message = "ไม่พบข้อมูลผู้ใช้ที่ต้องการลบ" }); // สถานะ HTTP 404
            }
            else
            {
                var isDeleted = await _UserService.DeleteUserAsync(UserID);
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


        [HttpPut("updateuser/{UserID}")]
        public async Task<IActionResult> UpdateUser(int UserID, [FromForm] ImageUserDto userDto, IFormFile? ProfilePicture)
        {
            string? relativePath = null;

            if (ProfilePicture != null)
            {
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(ProfilePicture.FileName)}";
                var fullPath = Path.Combine(_env.WebRootPath, "profile", fileName);
                relativePath = $"/profile/{fileName}"; // ใช้ Relative Path

                // สร้างโฟลเดอร์ถ้ายังไม่มี
                Directory.CreateDirectory(Path.Combine(_env.WebRootPath, "profile"));

                // บันทึกไฟล์
                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await ProfilePicture.CopyToAsync(stream);
                }
            }

            try
            {
                // อัปเดต UserID ใน DTO
                userDto.UserID = UserID;

                // เรียกใช้ Service เพื่ออัปเดตข้อมูลและรูปภาพ
                await _UserService.UpdateuserwithimageAsync(userDto, relativePath);

                return Ok(new { message = "User updated successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating User with ID: {UserID}", UserID);
                return StatusCode(500, new { error = ex.Message });
            }
        }





    }
}
