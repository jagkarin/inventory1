namespace inventorybackend.DTOS
{
    public class WithdrawRequest
    {
        public int ProductID { get; set; }
        public DateTime CreatedAt { get; set; }
        public int UserID { get; set; }
        public string? Status { get; set; }
        public string? Amount { get; set; }
    }
}
