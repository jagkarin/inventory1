using inventorybackend.DTOS;
using inventorybackend.src.Core.Interface;
using inventorybackend.src.Core.Service;
using inventorybackend.src.Entities;
using Microsoft.AspNetCore.Mvc;

namespace inventorybackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EquipmentBorrowController : Controller
    {
        private readonly IEqmborrowService _borrowService;
        private readonly ILogger<EquipmentBorrowController> _logger;

        public EquipmentBorrowController(IEqmborrowService borrowService, ILogger<EquipmentBorrowController> logger)
        {
            _borrowService = borrowService;
            _logger = logger;
        }

        [HttpPost("RequestBorrow")]
        public async Task<IActionResult> RequestBorrow([FromBody] EquipmentBorrowDto borrowDto)
        {
            if (borrowDto == null)
            {
                return BadRequest("ข้อมูลไม่ถูกต้อง");
            }

            try
            {
                var result = await _borrowService.RequestBorrowAsync(borrowDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("pending")]
        public async Task<ActionResult<List<EquipmentBorrowJoinDto>>> GetPendingBorrows()
        {
            try
            {
                var pendingBorrows = await _borrowService.GetPendingBorrowsAsync();

                if (pendingBorrows == null || !pendingBorrows.Any())
                {
                    return NotFound("No pending borrow requests found");
                }

                return Ok(pendingBorrows);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<EquipmentBorrowJoinDto>>> GetBorrowByUserId(int userId)
        {
            try
            {
                var borrows = await _borrowService.GetBorrowByUserIDAsync(userId);

                if (borrows == null || !borrows.Any())
                {
                    return NotFound($"No borrowing records found for user ID {userId}");
                }

                return Ok(borrows);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("GetAllEQMData")]
        public async Task<IActionResult> GetALLEqmdataAsync()
        {
            var response = new BaseHttpResponse<List<EquipmentBorrowJoinDto>>();

            try
            {
                var data = await _borrowService.GetALLEQMjoinAsync();
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

        [HttpPut("approve/{id}")]
        public async Task<ActionResult<EquipmentborrowDbo>> ApproveBorrow(int id, [FromBody] EquipmentBorrowUpdateDto updateDto)
        {
            try
            {
                if (id != updateDto.BorrowId)
                {
                    return BadRequest("Borrow ID mismatch");
                }
                var updatedBorrow = await _borrowService.ApproveBorrowAsync(updateDto);
                return Ok(updatedBorrow);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"เกิดข้อผิดพลาด: {ex.Message}");
            }
        }

        [HttpPut("return/{id}")]
        public async Task<IActionResult> ReturnBorrow(int id, [FromForm] EquipmentBorrowReturnDto returnDto)
        {
            try
            {
                if (id != returnDto.BorrowId)
                {
                    return BadRequest(new { error = "Borrow ID ไม่ตรงกัน" });
                }

                returnDto.BorrowId = id; // กำหนด BorrowId จากพารามิเตอร์ URL
                var returnedBorrow = await _borrowService.ReturnBorrowAsync(returnDto);
                return Ok(new { message = "คืนอุปกรณ์สำเร็จ", data = returnedBorrow });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "เกิดข้อผิดพลาดขณะคืนอุปกรณ์ BorrowID: {BorrowId}", id);
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
