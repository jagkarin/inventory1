namespace inventorybackend.DTOS
{
    public class WithdrawDto
    {
        public int WithdrawID { get; set; }  // เปลี่ยนเป็น int
        public int UserID { get; set; }
        public int ProductID { get; set; }
        public decimal Amount { get; set; }  // ใช้ decimal แทน int (ถูกต้องแล้ว)
        public DateTime CreatedAt { get; set; }
        public int Status { get; set; }
        public string? ProductName { get; set; }
    }
    public class WithdrawStatusUpdate
    {
        public int Status { get; set; }
    }

    public class WithdrawUsername
    {
        public int WithdrawID { get; set; }  // เปลี่ยนเป็น int
        public int UserID { get; set; }
        public int ProductID { get; set; }
        public decimal Amount { get; set; }  // ใช้ decimal แทน int (ถูกต้องแล้ว)
        public DateTime CreatedAt { get; set; }
        public int Status { get; set; }
        public string? ProductName { get; set; }
        public string? Firstname { get; set; }
        public string? Lastname { get; set; }
        public string? Product_image { get; set; }

    }

}
