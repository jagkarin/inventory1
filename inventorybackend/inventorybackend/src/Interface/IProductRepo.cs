using inventorybackend.src.Entities;

namespace inventorybackend.src.Interface
{
    public interface IProductRepo
    {
        Task<List<ProductDbo>> GetALLProductAsync();
        Task<ProductDbo> UpdateProductAsync(ProductDbo Product);
    }
}
