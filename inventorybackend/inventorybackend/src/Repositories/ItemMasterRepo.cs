using inventorybackend.DTOS;
using inventorybackend.src.Entities;
using inventorybackend.src.Interface;
using Microsoft.EntityFrameworkCore;

namespace inventorybackend.src.Repositories
{
    public class ItemMasterRepo : IItemMasterRepo
    {
        private readonly DataContext _dbContext;
        private readonly ILogger<ItemMasterRepo> _logger;

        public ItemMasterRepo(DataContext dbContext, ILogger<ItemMasterRepo> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<List<ItemMasterDbo>> GetALLItemMasterAsync()
        {
            try
            {
                return await _dbContext.Item.ToListAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        public async Task<ItemMasterDbo> AddItemAsync(ItemMasterDbo item)
        {
            _dbContext.Item.Add(item);
            await _dbContext.SaveChangesAsync();
            return item;
        }

        public async Task UpdateItemMasterAsync(ItemMasterDbo item)
        {
            var itemmaster = await _dbContext.Item.FirstOrDefaultAsync(p => p.ItemID == item.ItemID);

            if (itemmaster != null)
            {
                itemmaster.Itemname = item.Itemname;
                itemmaster.Description = item.Description;
                itemmaster.Units = item.Units;
                itemmaster.ItemType = item.ItemType;
                itemmaster.CategoryID = item.CategoryID;
                itemmaster.Status = item.Status;
                itemmaster.Image = item.Image; // รับ path จาก Service

                _dbContext.Item.Update(itemmaster);
                await _dbContext.SaveChangesAsync();
            }
            else
            {
                throw new Exception($"ItemMaster with ID {item.ItemID} not found.");
            }
        }


    }
}
