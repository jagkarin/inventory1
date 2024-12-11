using inventorybackend.DTOS;

namespace inventorybackend.src.Core.Interface
{
    public interface IProductService
    {
        Task<List<ProductDTO>> GetALLProductAsync();
    }
}
