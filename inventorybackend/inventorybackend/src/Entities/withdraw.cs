using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace inventorybackend.src.Entities
{
    [Table("Withdraw")]
    public class WithdrawDbo
    {
        [Key]
        [Required]
        [Column("WithdrawID", TypeName = "int")]
        public int WithdrawID { get; set; }  // ใช้ Guid แทน int

        [Column("ProductID", TypeName = "int")]
        public int ProductID { get; set; }

        [Column("CreatedAt", TypeName = "datetime")]
        public DateTime CreatedAt { get; set; }  // ถ้าไม่ต้องการให้เป็น nullable ก็ใช้ DateTime

        [Column("UserID", TypeName = "int")]
        public int UserID { get; set; }

        [Column("Status", TypeName = "int")]
        public int Status { get; set; }  // ใช้ int สำหรับสถานะ

        [Column("Amount", TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }  // ใช้ decimal แทน string สำหรับจำนวนที่ต้องการคำนวณ

        [Column("ProductName", TypeName ="varchar(100)")]
        public string? ProductName { get; set; }
    }
}
