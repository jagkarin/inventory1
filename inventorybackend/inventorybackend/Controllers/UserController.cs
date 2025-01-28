using inventorybackend.DTOS;
using inventorybackend.src.Core.Interface;
using inventorybackend.src.Core.Service;
using inventorybackend.src.Entities;
using inventorybackend.src.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace inventorybackend.Controllers
{
    public class UserController : Controller
    {
        private readonly IUserService _UserService;
        private readonly ILogger<UserController> _logger;
        private readonly IUserRepo _userRepo;
<<<<<<< HEAD
        private readonly string _imagePath = @"C:\Kewalin\inventory1\inventoryfrontend\public\asset";
=======
        private readonly string _imagePath = @"E:\GIt\inven\inventoryfrontend\public\asset";
>>>>>>> refs/remotes/origin/ploy
        public readonly DataContext _dbContext;

        public UserController(IUserService userService, ILogger<UserController> logger , IUserRepo userRepo, DataContext _dataContext)
        {
            _UserService = userService;
            _dbContext = _dataContext;
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


        [HttpPut("UpdateUserProfilebyUser")]
        public async Task<IActionResult> UpdateUserprofileAsync(int UserID, [FromBody] UpdateUserProfliebyUser UserProflie)
        {
            var response = new BaseHttpResponse<UpdateUserProfliebyUser>();

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


        [HttpPatch("{userId}/status")]
        public IActionResult UpdateUserStatus(int userId, [FromBody] UpdateStatusDto request)
        {
            if (request == null || !ModelState.IsValid)
            {
                return BadRequest("Invalid request data.");
            }

            var user = _dbContext.User.FirstOrDefault(u => u.UserID == userId);
            if (user == null)
            {
                return NotFound($"User with ID {userId} not found.");
            }

            user.IsActive = request.IsActive;

            try
            {
                _dbContext.SaveChanges();
                return Ok(new { message = "User status updated successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }




    }
}
