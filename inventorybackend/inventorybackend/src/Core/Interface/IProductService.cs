using inventorybackend.DTOS;
using inventorybackend.src.Entities;

namespace inventorybackend.src.Core.Interface
{
    public interface IProductService
    {
        Task<List<ProductDTO>> GetALLProductAsync();
        Task<UpdateProductDTO> UpdateProductAsync(UpdateProductDTO UpdateProductDTO);
        Task<ProductDbo> AddProductAsync(InputProductDTO InputProductDTO);
        Task<List<ProductCategoryDTO>> GetAllProductCategoryAsync();
        Task<ProductDTO> GetProductByIdAsync(int ProductsID);
    }
}
