using inventorybackend.DTOS;
using inventorybackend.src.Core.Interface;
using inventorybackend.src.Entities;
using inventorybackend.src.Interface;
using inventorybackend.src.Repositories;

namespace inventorybackend.src.Core.Service
{
    public class ItemMasterService : IItemMasterService
    {
        private readonly IItemMasterRepo _MasterRepo;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<ItemMasterService> _logger;
        private readonly DataContext _dataContext;

        public ItemMasterService(IItemMasterRepo repository, IWebHostEnvironment environment, ILogger<ItemMasterService> logger, DataContext dataContext)
        {
            _MasterRepo = repository;
            _environment = environment;
            _dataContext = dataContext;
            _logger = logger;
            // ตรวจสอบและสร้างโฟลเดอร์ asset ใน wwwroot
            if (!Directory.Exists(Path.Combine(_environment.WebRootPath, "itemmmaster")))
            {
                Directory.CreateDirectory(Path.Combine(_environment.WebRootPath, "itemmmaster"));
            }
        }

        public async Task<ItemMasterDbo> AddItemAsync(ItemMasterDto itemDto)
        {
            string? relativePath = null;

            // ✅ ตรวจสอบว่า itemDto.ImageFile มีค่าหรือไม่
            if (itemDto.Image != null)
            {
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(itemDto.Image.FileName)}";
                var fullPath = Path.Combine(_environment.WebRootPath, "itemmaster", fileName);
                relativePath = $"/itemmaster/{fileName}"; // ใช้ Relative Path

                // ✅ สร้างโฟลเดอร์ถ้ายังไม่มี
                Directory.CreateDirectory(Path.Combine(_environment.WebRootPath, "itemmaster"));

                // ✅ บันทึกไฟล์
                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await itemDto.Image.CopyToAsync(stream);
                }
            }

            var newItem = new ItemMasterDbo
            {
                Itemname = itemDto.ItemName,
                Description = itemDto.Description,
                Units = itemDto.Units,
                Status = itemDto.Status,
                ItemType = itemDto.ItemType,
                CategoryID = itemDto.CategoryID,
                CreatedAt = DateTime.Now,
                Image = relativePath

            };

            return await _MasterRepo.AddItemAsync(newItem);
        }
        public async Task<List<GetItemMasterDto>> GetALLItemMasterAsync()
        {
            try
            {
                var ItemmasterData = await _MasterRepo.GetALLItemMasterAsync();
                var ItemmasterReturn = ItemmasterData.Select(i => new GetItemMasterDto
                {
                    ItemID = i.ItemID,
                    ItemName = i.Itemname,
                    Description = i.Description,
                    Units = i.Units,
                    Status = i.Status,
                    ItemType = i.ItemType,
                    CategoryID = i.CategoryID,
                    CreatedAt = DateTime.Now,
                    Image = i.Image,
                    
                }).ToList();

                return ItemmasterReturn;
            }
            catch (Exception ex)
            {

                throw new ApplicationException("Cant Get ItemMaster data.", ex);
            }
        }

        public async Task UpdateItemMasterAsync(UpdateItemMasterDto Itemmaster)
        {
            var itemEntity = await _dataContext.Item.FindAsync(Itemmaster.ItemID);
            if (itemEntity == null)
                throw new Exception("Itemmaster not found.");

            // อัปเดตข้อมูลสินค้า
            itemEntity.Itemname = Itemmaster.ItemName;
            itemEntity.Description = Itemmaster.Description;
            itemEntity.Units = Itemmaster.Units;
            itemEntity.ItemType = Itemmaster.ItemType;
            itemEntity.CategoryID = Itemmaster.CategoryID;
            itemEntity.Status = Itemmaster.Status;

            // อัปเดตรูปภาพถ้ามีการส่งมา
            if (Itemmaster.Image != null)
            {
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(Itemmaster.Image.FileName)}";
                var fullPath = Path.Combine(_environment.WebRootPath, "itemmaster", fileName);
                var relativePath = $"/itemmaster/{fileName}";

                // สร้างโฟลเดอร์ถ้ายังไม่มี
                Directory.CreateDirectory(Path.Combine(_environment.WebRootPath, "itemmaster"));

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await Itemmaster.Image.CopyToAsync(stream);
                }

                itemEntity.Image = relativePath; // เก็บ path ของรูปภาพใน Entity
            }

            // บันทึกการเปลี่ยนแปลง
            await _MasterRepo.UpdateItemMasterAsync(itemEntity);
        }



    }
}
