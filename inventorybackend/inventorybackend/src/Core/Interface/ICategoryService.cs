using inventorybackend.DTOS;
using inventorybackend.src.Entities;

namespace inventorybackend.src.Core.Service
{
    public interface ICategoryService
    {
        //Product
        Task<List<CategoryDTO>> GetALLCategoryAsync();
        Task<CategoryDTO> GetCategoriesByIdAsync(int CategoriesID);

        //Equipment
        Task<List<CategoryEQMDTO>> GetALLCategoryEQMAsync();
        Task<CategoryEQMDTO> GetCategoryEQMByIdAsync(int Category_ID);
    }
}
