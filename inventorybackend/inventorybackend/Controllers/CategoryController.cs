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

        [HttpGet("GetALLCategoryProduct")]
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

        [HttpGet("GetCategoriesProductByID")]
        public async Task<IActionResult> GetCategoriesByIdAsync(int CategoriesID)
        {
            var response = new BaseHttpResponse<CategoryDTO>();

            try
            {
                var data = await _CategoryService.GetCategoriesByIdAsync(CategoriesID);
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
                _logger.LogError(ex, "Error getting all CategoriesID");
                return BadRequest(err);
            }
        }

        [HttpGet("GetALLCategoryEQM")]
        public async Task<IActionResult> GetALLCategoryEQMAsync()
        {
            var response = new BaseHttpResponse<List<CategoryEQMDTO>>();

            try
            {
                var data = await _CategoryService.GetALLCategoryEQMAsync();
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
                _logger.LogError(ex, "Error getting all CategoryEQM");
                return BadRequest(err);
            }
        }

        [HttpGet("GetCategoryEQMById")]
        public async Task<IActionResult> GetCategoryEQMByIdAsync(int Category_ID)
        {
            var response = new BaseHttpResponse<CategoryEQMDTO>();

            try
            {
                var data = await _CategoryService.GetCategoryEQMByIdAsync(Category_ID);
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
                _logger.LogError(ex, "Error getting all CategoryEQMID");
                return BadRequest(err);
            }
        }
    }
}
