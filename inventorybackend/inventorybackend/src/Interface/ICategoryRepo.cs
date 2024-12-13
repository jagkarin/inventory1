using inventorybackend.src.Entities;

namespace inventorybackend.src.Repositories
{
    public interface ICategoryRepo
    {
        Task<List<CategoryDbo>> GetALLCategoryAsync();
    }
}
