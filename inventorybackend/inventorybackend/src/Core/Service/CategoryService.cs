using inventorybackend.DTOS;
using inventorybackend.src.Entities;
using inventorybackend.src.Interface;
using inventorybackend.src.Repositories;

namespace inventorybackend.src.Core.Service
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepo _categoryrepo;
        private readonly DataContext _dataContext;
        private readonly ILogger<CategoryService> _logger;

        public CategoryService(ICategoryRepo categoryrepo, DataContext dataContext, ILogger<CategoryService> logger)
        {
            _categoryrepo = categoryrepo;
            _dataContext = dataContext;
            _logger = logger;
        }

        //แสดงข้อมูล Catagory
        public async Task<List<CategoryDTO>> GetALLCategoryAsync()
        {
            try
            {
                var CategoryuseData = await _categoryrepo.GetALLCategoryAsync();
                var CategoryuseReturn = CategoryuseData.Select(s => new CategoryDTO
                {
                    CategoriesID = s.CategoriesID,
                    CategoriesName = s.CategoriesName,

                }).ToList();

                return CategoryuseReturn;
            }
            catch (Exception ex)
            {

                throw new ApplicationException("An error occurred while getting the Category data.", ex);
            }
        }
    }
}
