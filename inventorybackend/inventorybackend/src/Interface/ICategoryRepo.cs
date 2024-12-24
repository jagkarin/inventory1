using inventorybackend.DTOS;
using inventorybackend.src.Entities;

namespace inventorybackend.src.Repositories
{
    public interface ICategoryRepo
    {
        //Product
        Task<List<CategoryDbo>> GetALLCategoryAsync();
        Task<CategoryDbo> GetCategoriesByIdAsync(int CategoriesID);

        //Equipment
        Task<List<CategoryEQMDbo>> GetALLCategoryEQMAsync();
        Task<CategoryEQMDbo> GetCategoryEQMByIdAsync(int Category_ID);
    }
}
