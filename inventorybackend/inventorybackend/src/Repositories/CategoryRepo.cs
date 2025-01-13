using inventorybackend.DTOS;
using inventorybackend.src.Entities;
using Microsoft.EntityFrameworkCore;

namespace inventorybackend.src.Repositories
{
    public class CategoryRepo : ICategoryRepo
    {
        public readonly DataContext _dbContext;
        private readonly ILogger<CategoryDbo> _logger;

        public CategoryRepo(DataContext dbContext, ILogger<CategoryDbo> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }
        //CategoryProduct
        public async Task<List<CategoryDbo>> GetALLCategoryAsync()
        {
            try
            {
                return await _dbContext.Category.ToListAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        //CategoryProduct
        public async Task<CategoryDbo> GetCategoriesByIdAsync(int CategoriesID)
        {
            return await _dbContext.Category.FirstOrDefaultAsync(w => w.CategoriesID == CategoriesID);
        }


        //CategoryEQM
        public async Task<List<CategoryEQMDbo>> GetALLCategoryEQMAsync()
        {
            try
            {
                return await _dbContext.CategoryEQM.ToListAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<CategoryEQMDbo> GetCategoryEQMByIdAsync(int Category_ID)
        {
            return await _dbContext.CategoryEQM.FirstOrDefaultAsync(w => w.Category_ID == Category_ID);
        }

    }
}
