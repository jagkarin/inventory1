using inventorybackend.DTOS;
using inventorybackend.src.Entities;

namespace inventorybackend.src.Interface
{
    public interface IProductRepo
    {
        Task<List<ProductDbo>> GetALLProductAsync();
        Task<ProductDbo> UpdateProductAsync(ProductDbo Product);
        Task<ProductDbo> AddProductAsync(ProductDbo Product);
        Task<List<ProductCategoryDTO>> GetAllProductCategoryAsync();
        Task<ProductDbo> GetProductByIdAsync(int ProductsID);

    }
}
