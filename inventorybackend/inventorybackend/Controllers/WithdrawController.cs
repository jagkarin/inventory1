using inventorybackend.DTOS;
using inventorybackend.src.Core.Interface;
using inventorybackend.src.Core.Service;
using Microsoft.AspNetCore.Mvc;

namespace inventorybackend.Controllers
{
    public class WithdrawController : Controller
    {
        private readonly IWithdrawService _WithdrawService;
        private readonly ILogger<WithdrawController> _logger;

        public WithdrawController(IWithdrawService WithdrawService, ILogger<WithdrawController> logger)
        {
            _WithdrawService = WithdrawService;
            _logger = logger;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddWithdraw([FromBody] WithdrawRequest request)
        {
            try
            {
                // เรียกใช้ Service เพื่อเพิ่มข้อมูล
                var result = await _WithdrawService.AddWithdrawAsync(
                    request.ProductID,
                    request.UserID,
                    request.Status,
                    request.Amount
                );

                // คืนค่าผลลัพธ์ที่ได้รับจากการเพิ่มข้อมูล
                return Ok(new
                {
                    message = "Withdraw data added successfully.",
                    data = result // คืนค่าเป็นข้อมูลที่ถูกเพิ่ม
                });
            }
            catch (Exception ex)
            {
                // ถ้ามีข้อผิดพลาด คืนค่าผลลัพธ์เป็นข้อผิดพลาด
                return StatusCode(500, new { error = ex.Message });
            }
        }

    }
}
