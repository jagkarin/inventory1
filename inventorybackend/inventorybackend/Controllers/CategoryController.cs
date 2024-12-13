using inventorybackend.DTOS;
using inventorybackend.src.Core.Interface;
using inventorybackend.src.Core.Service;
using Microsoft.AspNetCore.Mvc;

namespace inventorybackend.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : Controller
    {
        private readonly ICategoryService _CategoryService;
        private readonly ILogger<CategoryController> _logger;

        public CategoryController(ICategoryService categoryService, ILogger<CategoryController> logger)
        {
            _CategoryService = categoryService;
            _logger = logger;
        }

        [HttpGet("GetALLCategory")]
        public async Task<IActionResult> GetALLCategoryAsync()
        {
            var response = new BaseHttpResponse<List<CategoryDTO>>();

            try
            {
                var data = await _CategoryService.GetALLCategoryAsync();
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
                _logger.LogError(ex, "Error getting all Category");
                return BadRequest(err);
            }
        }
    }
}
