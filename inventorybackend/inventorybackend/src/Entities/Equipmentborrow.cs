using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace inventorybackend.src.Entities
{
    [Table("equipmentborrow")]
    public class EquipmentborrowDbo
    {
        [Key]
        [Required]
        [Column("BorrowID", TypeName = "int")]
        public int BorrowID { get; set; }

        [Column("ItemID", TypeName = "int")]
        public int ItemID { get; set; }

        [Column("stockID", TypeName = "int")]
        public int StockID { get; set; }

        [Column("UserID", TypeName = "int")]
        public int UserID { get; set; }

        [Column("Quantity", TypeName = "int")]
        public int Quantity { get; set; }

        [Column("Itemtype", TypeName = "int")]
        public int Itemtype { get; set; }

        [Column("Status", TypeName = "int")]
        public int Status { get; set; }

        [Column("BorrowDate", TypeName = "date")]
        public DateOnly BorrowDate { get; set; }

        [Column("ReturnDate", TypeName = "date")]
        public DateOnly ReturnDate { get; set; }

        [Column("reason", TypeName = "text")]
        public string? Reason { get; set; }

        [Column("borrowStatus", TypeName = "int")]
        public int BorrowStatus { get; set; }

        [Column("Returnimage", TypeName = "varchar(255)")]
        public string? Returnimage { get; set; }
    }
}
