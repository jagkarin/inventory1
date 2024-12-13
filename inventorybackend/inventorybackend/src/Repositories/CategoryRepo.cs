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
    }
}
