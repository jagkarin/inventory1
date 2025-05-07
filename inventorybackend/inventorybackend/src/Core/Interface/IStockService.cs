using inventorybackend.DTOS;
using inventorybackend.src.Entities;

namespace inventorybackend.src.Core.Interface
{
    public interface IStockService
    {
        Task<List<StockDbo>> GetAllStocksAsync();
        Task<StockDbo?> GetStockByIdAsync(int stockId);
        Task<StockDbo> CreateStockAsync(StockCreateDto stockDto); // เปลี่ยนเป็น DTO
        Task<StockDbo> UpdateStockAsync(int stockId, StockUpdateDto stockDto);

        Task<List<StockJoinItemmaster>> GetALLStockImageAsync();
    }
}
