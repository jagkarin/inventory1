namespace inventorybackend.DTOS
{
    public class WarehouseDTO
    {
            public int Warehouseid { get; set; }
            public string? Warehouseaddress { get; set; }
            public string? Warehousename { get; set; }

    }


    public class InputWarehouseDTO
    {
        public int Warehouseid { get; set; }
        public string? Warehouseaddress { get; set; }
        public string? Warehousename { get; set; }
    }
}
