using inventorybackend.DTOS;
using inventorybackend.src.Entities;

namespace inventorybackend.src.Core.Service
{
    public interface ICategoryService
    {
        Task<List<CategoryDTO>> GetALLCategoryAsync();
    }
}
