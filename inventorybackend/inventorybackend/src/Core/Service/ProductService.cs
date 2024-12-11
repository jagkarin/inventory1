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
                    //CategoriesID = s.CategoriesID,
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
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating Prodcut with ID: {ProductsID}. Inner exception: {InnerException}", UpdateProductDTO.ProductsID, ex.InnerException?.Message);
                throw new Exception("Error occurred while updating Product", ex);
            }
        }
    }
}

