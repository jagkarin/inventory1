using inventorybackend.DTOS;
using inventorybackend.src.Entities;
using inventorybackend.src.Interface;
using Microsoft.EntityFrameworkCore;

namespace inventorybackend.src.Repositories
{
    public class StockRepo : IStockRepo
    {
        public readonly DataContext _dbContext;
        private readonly ILogger<StockDbo> _logger;

        public StockRepo(DataContext dbContext, ILogger<StockDbo> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<StockDbo?> GetStockByItemIdAsync(int itemId)
        {
            return await _dbContext.Stock.FirstOrDefaultAsync(s => s.ItemID == itemId);
        }

        public async Task<List<StockDbo>> GetAllStocksAsync()
        {
            return await _dbContext.Stock.ToListAsync();
        }

        public async Task<List<StockJoinItemmaster>> GetAllStockImageAsync()
        {
            try
            {
                var stock = await (from s in _dbContext.Stock
                                   join i in _dbContext.Item
                                   on s.ItemID equals i.ItemID
                                   join w in _dbContext.Warehouse
                                   on s.WarehouseID equals w.WarehouseID // Added correct join condition
                                   select new StockJoinItemmaster
                                   {
                                       StockID = s.StockID,
                                       ItemID = s.ItemID,
                                       SerialNumber = s.SerialNumber,
                                       Units = i.Units,
                                       Quantity = s.Quantity,
                                       Status = s.Status,
                                       ItemName = i.Itemname,
                                       ItemType = i.ItemType,
                                       CategoryID = i.CategoryID,
                                       Image = i.Image,
                                       WarehouseID = w.WarehouseID, // Include WarehouseID
                                       WarehouseName = w.WarehouseName // Assuming WarehouseName exists in Warehouse table
                                   }).ToListAsync();

                return stock;
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"An error occurred while retrieving the stock data: {ex.Message}", ex);
            }
        }

        public async Task<StockDbo?> GetStockByIdAsync(int stockId)
        {
            return await _dbContext.Stock.FindAsync(stockId);
        }

        public async Task<StockDbo> AddStockAsync(StockDbo stock)
        {
            _dbContext.Stock.Add(stock);
            await _dbContext.SaveChangesAsync();
            return stock;
        }

        public async Task<StockDbo> UpdateStockAsync(StockDbo stock)
        {
            _dbContext.Stock.Update(stock);
            await _dbContext.SaveChangesAsync();
            return stock;
        }
    }
}
