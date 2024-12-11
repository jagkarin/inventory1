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

        public ProductService(IProductRepo productRepo, DataContext dataContext) 
        { 
            _productRepo = productRepo;
            _dataContext = dataContext;
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
    }
}

