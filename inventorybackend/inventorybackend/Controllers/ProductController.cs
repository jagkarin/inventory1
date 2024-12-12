using inventorybackend.DTOS;
using inventorybackend.src.Core.Interface;
using inventorybackend.src.Core.Service;
using inventorybackend.src.Entities;
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

        [HttpPut("UpdateProduct")]
        public async Task<IActionResult> UpdateProductAsync(int ProductsID, [FromBody] UpdateProductDTO UpdateProductDTO)
        {
            var response = new BaseHttpResponse<UpdateProductDTO>();

            try
            {
                UpdateProductDTO.ProductsID = ProductsID;

                _logger.LogInformation("Updating Product with ID: {ProductsID}", ProductsID);

                var data = await _ProductService.UpdateProductAsync(UpdateProductDTO);
                response.SetSuccess(data, "Product updated successfully", "200");
                return Ok(response);
            }
            catch (Exception ex)
            {
                var err = new ErrorData
                {
                    Code = "-2",
                    Message = ex.Message
                };
                _logger.LogError(ex, "Error updating Product with ID: {ProductsID}. Inner exception: {InnerException}", ProductsID, ex.InnerException?.Message);
                response.SetError(err, ex.Message, "500");
                return BadRequest(response);
            }
        }

        [HttpPost("AddProduct")]
        public async Task<IActionResult> AddProductAsync([FromBody] InputProductDTO InputProductDTO)
        {
            var response = new BaseHttpResponse<ProductDbo>();

            try
            {
                var data = await _ProductService.AddProductAsync(InputProductDTO);
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
                _logger.LogError(ex, "Error adding Product");
                response.SetError(err, ex.Message, "500");
                return BadRequest(response);
            }
        }

        [HttpGet("GetAllProductCategory")]
        public async Task<IActionResult> GetAllProductCategoryAsync()
        {
            var response = new BaseHttpResponse<List<ProductCategoryDTO>>();

            try
            {
                var data = await _ProductService.GetAllProductCategoryAsync();
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
                _logger.LogError(ex, "Error getting all productcategory");
                return BadRequest(err);
            }
        }

    }
}
