using inventorybackend.DTOS;
using inventorybackend.src.Core.Interface;
using inventorybackend.src.Core.Service;
using Microsoft.AspNetCore.Mvc;

namespace inventorybackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemMasterController : Controller
    {
        private readonly IItemMasterService _service;
        private readonly ILogger<ItemMasterController> _logger;

        public ItemMasterController(IItemMasterService service, ILogger<ItemMasterController> logger)
        {
            _service = service;
            _logger = logger;
        }
  
        // Controller Action
        [HttpPost("additemmaster")]
        public async Task<IActionResult> AddItem([FromForm] ItemMasterDto itemDto)
        {
            var result = await _service.AddItemAsync(itemDto);
            return CreatedAtAction(nameof(AddItem), new { id = result.ItemID }, result);
        }

        [HttpGet("GetAllItemMaster")]
        public async Task<IActionResult> GetALLProductAsync()
        {
            var response = new BaseHttpResponse<List<GetItemMasterDto>>();

            try
            {
                var data = await _service.GetALLItemMasterAsync();
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
                _logger.LogError(ex, "Error getting all Product");
                return BadRequest(err);
            }
        }

        [HttpPut("UpdateItemMaster/{ItemID}")]
        public async Task<IActionResult> UpdateItemMaster(int ItemID, [FromForm] UpdateItemMasterDto itemmasterdto)
        {
            try
            {
                itemmasterdto.ItemID = ItemID;
                await _service.UpdateItemMasterAsync(itemmasterdto); // ส่งแค่ DTO
                return Ok(new { message = "ItemMaster updated successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating ItemMaster with ID: {ItemID}", ItemID);
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
