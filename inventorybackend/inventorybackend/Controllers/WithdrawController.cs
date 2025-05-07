using inventorybackend.DTOS;
using inventorybackend.src.Core.Interface;
using inventorybackend.src.Core.Service;
using inventorybackend.src.Entities;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace inventorybackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WithdrawController : Controller
    {
        private readonly IWithdrawService _WithdrawService;
        private readonly IWithdraweqmService _WithdraweqmService;
        private readonly ILogger<WithdrawController> _logger;
      

        public WithdrawController(IWithdrawService WithdrawService, ILogger<WithdrawController> logger, IWithdraweqmService WithdraweqmService)
        {
            _WithdrawService = WithdrawService;
            _WithdraweqmService = WithdraweqmService;
            _logger = logger;
        }

        // POST: api/Withdraw
        [HttpPost("AddWithdraw")]
        public async Task<IActionResult> AddWithdraw([FromBody] List<WithdrawDto> withdrawDtos)
        {
            if (withdrawDtos == null || !withdrawDtos.Any())
            {
                return BadRequest(new { message = "Withdraw data is required." });
            }

            Console.WriteLine($"Received in API: {JsonConvert.SerializeObject(withdrawDtos)}");

            var result = await _WithdrawService.CreateWithdrawAsync(withdrawDtos);

            if (result)
            {
                return Ok(new { message = "Success" }); // ✅ เปลี่ยนเป็น JSON { "message": "Success" }
            }

            return BadRequest(new { message = "Failed to add withdraw." });
        }




        
        [HttpGet("GetWithdraws(Status=0)")]
        public async Task<ActionResult<List<WithdrawUsername>>> GetWithdraws()
        {
            var withdraws = await _WithdrawService.GetWithdraws0Async();
            return Ok(withdraws);
        }

        [HttpGet("GetWithdraws(Status=1)")]
        public async Task<ActionResult<List<WithdrawDto>>> GetWithdraws1()
        {
            var withdraws = await _WithdrawService.GetWithdraws1Async();
            return Ok(withdraws);
        }

        [HttpGet("GetWithdraws(Status=2)")]
        public async Task<ActionResult<List<WithdrawDto>>> GetWithdraws2()
        {
            var withdraws = await _WithdrawService.GetWithdraws2Async();
            return Ok(withdraws);
        }



        [HttpPatch("UpdateStatus/{withdrawID}")]
        public async Task<IActionResult> UpdateStatus(int withdrawID, [FromBody] WithdrawStatusUpdate model)
        {
            var success = await _WithdrawService.UpdateWithdrawStatusAsync(withdrawID, model.Status);
            if (success)
            {
                return Ok(new { success = true, message = "อัปเดตสถานะสำเร็จ" });
            }
            return NotFound(new { success = false, message = "ไม่พบคำขอเบิก" });
        }


        [HttpGet("GetWithdrawEQM")]
        public async Task<ActionResult<List<BorrowDto>>> GetAllBorrows()
        {
            var borrows = await _WithdraweqmService.GetAllBorrowsAsync();
            return Ok(borrows);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BorrowDto>> GetBorrowById(int id)
        {
            var borrow = await _WithdraweqmService.GetBorrowByIdAsync(id);
            if (borrow == null)
            {
                return NotFound();
            }
            return Ok(borrow);
        }

        [HttpPost]
        public async Task<ActionResult<BorrowDto>> AddBorrow(CreateBorrowDto createBorrowDto)
        {
            if (createBorrowDto.UserId == 0)
            {
                return BadRequest("UserId is required.");
            }

            var borrow = await _WithdraweqmService.AddBorrowAsync(createBorrowDto);
            return CreatedAtAction(nameof(GetBorrowById), new { id = borrow.BorrowId }, borrow);
        }

        [HttpPut("status/{id}")]
        public async Task<IActionResult> UpdateBorrowStatus(int id, [FromBody] UpdateBorrowDto updateBorrowDto)
        {
            var borrow = await _WithdraweqmService.UpdateBorrowStatusAsync(id, updateBorrowDto.Status, updateBorrowDto.ReturnStatus);
            if (borrow == null)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpPut("returnstatus/{id}")]
        public async Task<IActionResult> UpdateBorrowReturnStatus(int id, [FromBody] UpdateReturnStatus updateReturnStatus)
        {
            var borrowreturn = await _WithdraweqmService.UpdateBorrowReturnAsync(id, updateReturnStatus.ReturnStatus, updateReturnStatus.ExpectedReturnDate);
            if (borrowreturn == null)
            {
                return NotFound();
            }
            return NoContent();
        }

    }
}
