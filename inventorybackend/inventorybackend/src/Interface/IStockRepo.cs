using inventorybackend.DTOS;
using inventorybackend.src.Entities;

namespace inventorybackend.src.Interface
{
    public interface IStockRepo
    {
        Task<List<StockDbo>> GetAllStocksAsync();
        Task<StockDbo?> GetStockByIdAsync(int stockId);
        Task<StockDbo> AddStockAsync(StockDbo stock); // รับ Stock
        Task<StockDbo> UpdateStockAsync(StockDbo stock); // รับ Stock

        Task<StockDbo?> GetStockByItemIdAsync(int itemId);


        Task<List<StockJoinItemmaster>> GetAllStockImageAsync();
    }
}
