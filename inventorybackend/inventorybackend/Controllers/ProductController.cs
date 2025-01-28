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
        private readonly string _imagePath = @"C:\Kewalin\inventory1\inventoryfrontend\public\asset";

        public ProductController(IProductService productService, ILogger<ProductController> logger)
        {
            _ProductService = productService;
            _logger = logger;
            if (!Directory.Exists(_imagePath))
            {
                Directory.CreateDirectory(_imagePath); // ตรวจสอบและสร้างโฟลเดอร์หากยังไม่มี
            }
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

        [HttpGet("GetProductbyProductID")]
        public async Task<IActionResult> GetProductByIdAsync(int ProductsID)
        {
            try
            {
                
                var ProductDto = await _ProductService.GetProductByIdAsync(ProductsID);
                return Ok(ProductDto); // ส่งผลลัพธ์กลับในรูปแบบ JSON
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

        [HttpPost("addimage")]
        public async Task<IActionResult> AddProduct([FromForm] ProductwithimageDTO productDto, IFormFile? productImage)
        {
            string? fullPath = null;

            // ตรวจสอบว่ามีการอัปโหลดรูปภาพหรือไม่
            if (productImage != null && productImage.Length > 0)
            {
                // สร้างชื่อไฟล์ใหม่ด้วย GUID เพื่อป้องกันชื่อซ้ำกัน
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(productImage.FileName)}";
                fullPath = Path.Combine(_imagePath, fileName);

                // บันทึกรูปภาพลง path
                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await productImage.CopyToAsync(stream);
                }
            }

            // บันทึกข้อมูลสินค้า โดยส่ง path ของรูปภาพ (ถ้ามี) หรือ null ไปยัง Service
            productDto.Productimage = fullPath;

            var result = await _ProductService.AddProductAsync(productDto, fullPath);

            return Ok(result);
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


        [HttpPut("updateProduct/{productId}")]
        public async Task<IActionResult> UpdateProduct(int productId, [FromForm] ProductwithimageDTO productDto, IFormFile? productImage)
        {
            string? fullPath = null;

            if (productImage != null)
            {
                // สร้างชื่อไฟล์ใหม่ด้วย GUID เพื่อป้องกันชื่อซ้ำกัน
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(productImage.FileName)}";
                fullPath = Path.Combine(_imagePath, fileName);

                // บันทึกรูปภาพลง path
                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await productImage.CopyToAsync(stream);
                }
            }

            try
            {
                // อัปเดต ProductID เพื่อให้ตรงกับข้อมูลใน DTO
                productDto.ProductsID = productId;

                // เรียกใช้ Service เพื่ออัปเดตข้อมูลสินค้าและรูปภาพ
                // ตรวจสอบว่ามีไฟล์รูปภาพหรือไม่
                await _ProductService.UpdateProductwithimageAsync(productDto, fullPath);

                return Ok(new { message = "Product updated successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating product with ID: {ProductId}", productId);
                return StatusCode(500, new { error = ex.Message });
            }
        }


        [HttpDelete("{ProductsID}")]
        public async Task<IActionResult> DeleteProduct(int ProductsID)
        {
            var product = await _ProductService.GetProductByIdAsync(ProductsID);
            if (product == null)
            {
                return NotFound(new { Message = "ไม่พบข้อมูลผลิตภัณฑ์ที่ต้องการลบ" }); // สถานะ HTTP 404
            }
            else
            {
                var isDeleted = await _ProductService.DeleteProductAsync(ProductsID);
                if (isDeleted)
                {
                    return Ok(new { Message = "ลบข้อมูลสำเร็จ" }); // สถานะ HTTP 200
                }
                else
                {
                    return StatusCode(500, new { Message = "เกิดข้อผิดพลาดในการลบข้อมูล" }); // สถานะ HTTP 500
                }
            }
        }



       


    }
}
