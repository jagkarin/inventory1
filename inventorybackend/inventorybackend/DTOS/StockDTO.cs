namespace inventorybackend.DTOS
{
    public class StockCreateDto
    {
        public int ItemID { get; set; }
        public string? SerialNumber { get; set; }
        public string? ItemName { get; set; }
        public int Status { get; set; }
        public DateOnly Stockin { get; set; }
        public int Quantity { get; set; }

        public int WarehouseID { get; set; }
    }

    public class StockUpdateDto
    {
        public int StockID { get; set; }
        public int ItemID { get; set; }
        public string? ItemName { get; set; }
        public string? SerialNumber { get; set; }
        public int Status { get; set; }
        public DateOnly Stockin { get; set; }
        public int WarehouseID { get; set; }
        public int Quantity { get; set; }
    }

    public class StockJoinItemmaster
    {
        public int StockID { get; set; }
        public int ItemID { get; set; }
        public string? SerialNumber { get; set; }
        public string? WarehouseName { get; set; }
        public int Status { get; set; }
        public string? ItemName { get; set; }
        public string? Units { get; set; }
        public int ItemType { get; set; }
        public int CategoryID { get; set; }
        public int WarehouseID { get; set; }
        public string? Image { get; set; }
        public int Quantity { get; set; }

    }
    
}
