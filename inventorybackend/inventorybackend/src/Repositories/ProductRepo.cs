using inventorybackend.src.Entities;
using inventorybackend.src.Interface;
using Microsoft.EntityFrameworkCore;

namespace inventorybackend.src.Repositories
{
    public class ProductRepo : IProductRepo
    {
        public readonly DataContext _dbContext;

        public ProductRepo(DataContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<ProductDbo>> GetALLProductAsync()
        {
            try
            {
                return await _dbContext.Product.ToListAsync();
            }
            catch (Exception ex) 
            { 
                throw ex;
            }

        }
    }
}
