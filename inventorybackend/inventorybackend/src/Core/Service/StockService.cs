using inventorybackend.DTOS;
using inventorybackend.src.Core.Interface;
using inventorybackend.src.Entities;
using inventorybackend.src.Interface;
using inventorybackend.src.Repositories;

namespace inventorybackend.src.Core.Service
{
    public class StockService : IStockService
    {
        private readonly IStockRepo _stockRepo;
        private readonly DataContext _dataContext;
        private readonly ILogger<StockService> _logger;

        public StockService(IStockRepo stockRepo, DataContext dataContext, ILogger<StockService> logger)
        {
            _stockRepo = stockRepo;
            _dataContext = dataContext;
            _logger = logger;

        }

        public async Task<List<StockDbo>> GetAllStocksAsync()
        {
            return await _stockRepo.GetAllStocksAsync();
        }

        public async Task<List<StockJoinItemmaster>> GetALLStockImageAsync()
        {
            try
            {
                var stock = await _stockRepo.GetAllStockImageAsync();
                return stock;
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"ไม่สามารถแสดงข้อมูลได้ : {ex.Message}", ex);
            }
        }

        public async Task<StockDbo?> GetStockByIdAsync(int stockId)
        {
            return await _stockRepo.GetStockByIdAsync(stockId);
        }

        public async Task<StockDbo> CreateStockAsync(StockCreateDto stockDto)
        {
            var stock = new StockDbo
            {
                ItemID = stockDto.ItemID,
                SerialNumber = stockDto.SerialNumber,
                ItemName = stockDto.ItemName,
                Status = stockDto.Status,
                WarehouseID = stockDto.WarehouseID,
                Stockin = stockDto.Stockin,
                Quantity = stockDto.Quantity
            };
            return await _stockRepo.AddStockAsync(stock);
        }

        public async Task<StockDbo> UpdateStockAsync(int stockId, StockUpdateDto stockDto)
        {
            var existingStock = await _stockRepo.GetStockByIdAsync(stockId);
            if (existingStock == null)
            {
                throw new Exception("Stock not found");
            }

            // อัปเดตเฉพาะฟิลด์ที่รับมาจาก DTO
            existingStock.ItemID = stockDto.ItemID;
            existingStock.SerialNumber = stockDto.SerialNumber;
            existingStock.ItemName = stockDto.ItemName;
            existingStock.Status = stockDto.Status;
            existingStock.WarehouseID = stockDto.WarehouseID;
            existingStock.Stockin = stockDto.Stockin;
            existingStock.Quantity = stockDto.Quantity; 

            return await _stockRepo.UpdateStockAsync(existingStock);
        }
    }
}
