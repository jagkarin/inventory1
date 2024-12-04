using inventorybackend.DTOS;
using inventorybackend.src.Core.Interface;
using inventorybackend.src.Core.Service;
using Microsoft.AspNetCore.Mvc;

namespace inventorybackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : Controller
    {
        private readonly IProductService _ProductService;
        private readonly ILogger<ProductController> _logger;

        public ProductController(IProductService productService, ILogger<ProductController> logger)
        {
            _ProductService = productService;
            _logger = logger;
        }

        [HttpGet("GetAllProduct")]
        public async Task<IActionResult> GetALLProductAsync()
        {
            var response = new BaseHttpResponse<List<ProductDTO>>();

            try
            {
                var data = await _ProductService.GetALLProductAsync();
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
    }
}
