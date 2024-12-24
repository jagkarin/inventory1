using inventorybackend.DTOS;
using inventorybackend.src.Core.Interface;
using inventorybackend.src.Core.Service;
using Microsoft.AspNetCore.Mvc;

namespace inventorybackend.Controllers
{
    public class UserController : Controller
    {
        private readonly IUserService _UserService;
        private readonly ILogger<UserController> _logger;

        public UserController(IUserService userService, ILogger<UserController> logger)
        {
            _UserService = userService;
            _logger = logger;
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
    }
}
