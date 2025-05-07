namespace inventorybackend.DTOS
{
    public class ItemMasterDto
    {
        public int ItemID { get; set; }
        public string? ItemName { get; set; } 
        public string? Description { get; set; }
        public string? Units { get; set; }
        public int Status { get; set; }
        public int ItemType { get; set; }
        public int CategoryID { get; set; }
        
        
        public IFormFile? Image { get; set; } // รับไฟล์ภาพจาก API
        public DateTime CreatedAt { get; set; }
    }

    public class GetItemMasterDto
    {
        public int ItemID { get; set; }
        public string? ItemName { get; set; }
        public string? Description { get; set; }
        public string? Units { get; set; }
        public int Status { get; set; }
        public int ItemType { get; set; }
        public int CategoryID { get; set; }
        
        
        public string? Image { get; set; } 
        public DateTime CreatedAt { get; set; }
    }

    public class UpdateItemMasterDto
    {
        public int ItemID { get; set; }
        public string? ItemName { get; set; }
        public string? Description { get; set; }
        public string? Units { get; set; }
        public int Status { get; set; }
        public int ItemType { get; set; }
        public int CategoryID { get; set; }
        
        
        public IFormFile? Image { get; set; }
    }
}
