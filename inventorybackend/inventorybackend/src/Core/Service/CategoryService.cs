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

                throw new ApplicationException("ไม่พบข้อมูล", ex);
            }
        }

        public async Task<CategoryDTO> GetCategoriesByIdAsync(int CategoriesID)
        {
            try
            {
                var categoriesusedto = await _categoryrepo.GetCategoriesByIdAsync(CategoriesID);
                var categoriesuseReturn = new CategoryDTO
                {
                    CategoriesID = categoriesusedto.CategoriesID,
                    CategoriesName = categoriesusedto.CategoriesName,
                };

                return categoriesuseReturn;
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"ไม่พบข้อมูล: {ex.Message}", ex);
            }
        }

        public async Task<List<CategoryEQMDTO>> GetALLCategoryEQMAsync()
        {
            try
            {
                var CategoryEQMuseData = await _categoryrepo.GetALLCategoryEQMAsync();
                var CategoryEQMuseReturn = CategoryEQMuseData.Select(s => new CategoryEQMDTO
                {
                    Category_ID = s.Category_ID,
                    Category_Name = s.Category_Name,

                }).ToList();

                return CategoryEQMuseReturn;
            }
            catch (Exception ex)
            {

                throw new ApplicationException("ไม่พบข้อมูล", ex);
            }
        }

        public async Task<CategoryEQMDTO> GetCategoryEQMByIdAsync(int Category_ID)
        {
            try
            {
                var categoryeqmsusedto = await _categoryrepo.GetCategoryEQMByIdAsync(Category_ID);
                var categoryeqmuseReturn = new CategoryEQMDTO
                {
                    Category_Name = categoryeqmsusedto.Category_Name,
                    Category_ID = categoryeqmsusedto.Category_ID,
                };

                return categoryeqmuseReturn;
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"ไม่พบข้อมูล: {ex.Message}", ex);
            }
        }
    }
}
