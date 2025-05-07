namespace inventorybackend.DTOS
{
    public class EquipmentBorrowDto
    {
        public int ItemID { get; set; }        // รหัสอุปกรณ์ที่ยืม
        public int UserID { get; set; }        // ผู้ยืม
        public int Quantity { get; set; }      // จำนวนที่ยืม
        public DateOnly BorrowDate { get; set; }
        public DateOnly ReturnDate { get; set; }
        public int  ApprovedBy { get; set; }
        public string? reason { get; set; }
        public int Status { get; set; }
        public int BorrowStatus { get; set; }
        public int Itemtype { get; set; }
        public int StockID { get; set; }


    }

    public class EquipmentBorrowJoinDto
    {
        public int BorrowID { get; set; }
        public int ItemID { get; set; }        // รหัสอุปกรณ์ที่ยืม
        public int UserID { get; set; }        // ผู้ยืม
        public int Quantity { get; set; }      // จำนวนที่ยืม
        public DateOnly BorrowDate { get; set; }
        public DateOnly ReturnDate { get; set; }
        public string? reason { get; set; }
        public int Status { get; set; }
        public int WarehouseID { get; set; }
        public string ItemName { get; set; }
        public string? SerialNumber { get; set; } // ถ้ามี SerialNumber ต้องมีค่า
        public string? Image { get; set; }
        public int BorrowStatus { get; set; }
        public int Itemtype { get; set; }
        public int StockID { get; set; }
        public string? Firstname { get; set; }
        public string? Lastname { get; set; }

        public string? Returnimage { get; set; }


    }

    public class UpdateStatusDTO
    {
        public int ItemID { get; set; }
        public int Status { get; set; }
    }

    public class UpdateborrowStatusDTO
    {
        public int BorrowID { get; set; } // เปลี่ยนจาก ItemID เป็น BorrowID
        public int borrowStatus { get; set; }
        public string Returnimage { get; set; }
    }

    public class EquipmentBorrowUpdateDto
    {
        public int BorrowId { get; set; } // รหัสคำขอยืมที่ต้องการอนุมัติ
        public int Status { get; set; } // สถานะใหม่ (เช่น 1 = อนุมัติ)
        public int BorrowStatus { get; set; } // สถานะการยืม (เช่น 1 = ยืมแล้ว)
        
    }

    public class EquipmentBorrowReturnDto
    {
        public int BorrowId { get; set; }
        public int BorrowStatus { get; set; } // 2 = คืน
        public IFormFile? ReturnImage { get; set; } // เปลี่ยนชื่อเป็น ReturnImage
    }

}
