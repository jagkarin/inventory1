using inventorybackend.src.Entities;
using inventorybackend.src.Interface;
using Microsoft.EntityFrameworkCore;

namespace inventorybackend.src.Repositories
{
    public class ProductRepo : IProductRepo
    {
        public readonly DataContext _dbContext;
        private readonly ILogger<UserDbo> _logger;

        public ProductRepo(DataContext dbContext, ILogger<UserDbo> logger)
        {
            _dbContext = dbContext;
            _logger = logger;   
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

        public async Task<ProductDbo> UpdateProductAsync(ProductDbo Product)
        {
            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                // Log before finding the user
                _logger.LogInformation("Attempting to update Product with ID: {ProductsID}", Product.ProductsID);

                var existingProduct = await _dbContext.Product.FindAsync(Product.ProductsID);
                if (existingProduct == null)
                {
                    _logger.LogError("Products with ID {ProductsID} not found", Product.ProductsID);
                    throw new Exception($"Products with ID {Product.ProductsID} not found");
                }

                _logger.LogInformation("Found Product with ID : {ProductsID}.", Product.ProductsID);
                existingProduct.ProductsName = Product.ProductsName;
                existingProduct.Quantity = Product.Quantity;
                existingProduct.Description = Product.Description;
                existingProduct.ProductsID = Product.ProductsID;
                existingProduct.Adddate = DateTime.Now;
                existingProduct.CategoriesID = Product.CategoriesID;

                _dbContext.Product.Update(existingProduct);


                await _dbContext.SaveChangesAsync();

                await transaction.CommitAsync();
                _logger.LogInformation("Successfully updated Products with ID: {ProductsID}", Product.ProductsName);

                return existingProduct;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error occurred while updating Product with ID : {ProductsID}. Inner exception: {InnerException}", Product.ProductsName, ex.InnerException?.Message);
                throw new Exception($"Error occurred while updating Product with ID {Product.ProductsName}", ex);
            }
        }

        public async Task<ProductDbo> AddProductAsync(ProductDbo Product)
        {
            try
            {
                _dbContext.Product.Add(Product);
                await _dbContext.SaveChangesAsync();
                return Product;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
