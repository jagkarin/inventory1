using inventorybackend.DTOS;
using inventorybackend.src.Core.Interface;
using inventorybackend.src.Entities;
using inventorybackend.src.Interface;

namespace inventorybackend.src.Core.Service
{
    public class ProductService : IProductService
    {
        private readonly IProductRepo _productRepo;
        private readonly DataContext _dataContext;
        private readonly ILogger<ProductService> _logger;

        public ProductService(IProductRepo productRepo, DataContext dataContext, ILogger<ProductService> logger) 
        { 
            _productRepo = productRepo;
            _dataContext = dataContext;
            _logger = logger;
        }


        //แสดงข้อมูลสินค้าทั้งหมด
        public async Task<List<ProductDTO>> GetALLProductAsync()
        {
            try
            {
                var ProductuseData = await _productRepo.GetALLProductAsync();
                var ProductuseReturn = ProductuseData.Select(s => new ProductDTO
                {
                    ProductsID = s.ProductsID,
                    ProductsName = s.ProductsName,
                    Adddate = s.Adddate,
                    CategoriesID = s.CategoriesID,
                    Quantity = s.Quantity,
                    Description = s.Description,

                }).ToList();

                return ProductuseReturn;
            }
            catch (Exception ex)
            {

                throw new ApplicationException("An error occurred while getting the Product data.", ex);
            }
        }

        public async Task<ProductDTO> GetProductByIdAsync(int ProductsID)
        {
            try
            {
                var productusedto = await _productRepo.GetProductByIdAsync(ProductsID);
                var productDto = new ProductDTO
                {
                    ProductsID = productusedto.ProductsID,
                    ProductsName = productusedto.ProductsName,
                    Adddate = productusedto.Adddate,
                    CategoriesID = productusedto.CategoriesID,
                    Quantity = productusedto.Quantity,
                    Description = productusedto.Description,
                };

                return productDto;
            }
            catch (Exception ex) 
            {
                throw new ApplicationException($"ไม่พบข้อมูล: {ex.Message}", ex);
            }
        }


        //อัพเดต/แก้ไขข้อมูลสินค้า
        public async Task<UpdateProductDTO> UpdateProductAsync(UpdateProductDTO UpdateProductDTO)
        {
            try
            {
                // ?????????????????????????
                _logger.LogInformation("Received request to update Product with ID: {ProductsID} ", UpdateProductDTO.ProductsID);

                var Product = new Entities.ProductDbo
                {
                    ProductsID = UpdateProductDTO.ProductsID,
                    ProductsName= UpdateProductDTO.ProductsName,
                    Adddate = DateTime.Now,
                    Quantity = UpdateProductDTO.Quantity,
                    Description = UpdateProductDTO.Description,
                    //CategoriesID = UpdateProductDTO.CategoriesID,

                };


                var updatedProduct = await _productRepo.UpdateProductAsync(Product);

                _logger.LogInformation("Successfully updated Product with ID: {ProductsID}", UpdateProductDTO.ProductsID);

                return new UpdateProductDTO
                {
                    ProductsID = UpdateProductDTO.ProductsID,
                    ProductsName = UpdateProductDTO.ProductsName,
                    Adddate = DateTime.Now,
                    Quantity = UpdateProductDTO.Quantity,
                    Description = UpdateProductDTO.Description,
                    //CategoriesID= UpdateProductDTO.CategoriesID,
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating Prodcut with ID: {ProductsID}. Inner exception: {InnerException}", UpdateProductDTO.ProductsID, ex.InnerException?.Message);
                throw new Exception("Error occurred while updating Product", ex);
            }
        }

        public async Task<ProductDbo> AddProductAsync(InputProductDTO InputProductDTO)
        {
            try
            {
                var Product = new Entities.ProductDbo
                {
                    ProductsName = InputProductDTO.ProductsName,
                    Quantity=InputProductDTO.Quantity,
                    Description = InputProductDTO.Description,
                    Adddate= DateTime.Now,
                    //CategoriesID = InputProductDTO.CategoriesID


                };
                var addProduct = await _productRepo.AddProductAsync(Product);
                return new ProductDbo
                {
                    ProductsName = addProduct.ProductsName,
                    Quantity = addProduct.Quantity,
                    Description = addProduct.Description,
                    Adddate = DateTime.Now,
                    //CategoriesID = addProduct.CategoriesID
                    
                };
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while adding data.", ex);
            }
        }

        public async Task<List<ProductCategoryDTO>> GetAllProductCategoryAsync()
        {
            try
            {
                var productcate = await _productRepo.GetAllProductCategoryAsync();
                return productcate;
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"An error occurred while retrieving the productcategory : {ex.Message}", ex);
            }
        }
    }
}

