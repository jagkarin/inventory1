using inventorybackend.DTOS;
using inventorybackend.src.Entities;

namespace inventorybackend.src.Core.Interface
{
    public interface IProductService
    {
        Task<List<ProductDTO>> GetALLProductAsync();
        Task<UpdateProductDTO> UpdateProductAsync(UpdateProductDTO UpdateProductDTO);
        Task<List<ProductCategoryDTO>> GetAllProductCategoryAsync();
        Task<ProductDTO> GetProductByIdAsync(int ProductsID);
        Task<bool> DeleteProductAsync(int ProductsID);
        Task<ProductwithimageDTO> AddProductAsync(ProductwithimageDTO productDto, string imagePath);

        Task UpdateProductwithimageAsync(ProductwithimageDTO productDto, string imagePath);
    }
}
