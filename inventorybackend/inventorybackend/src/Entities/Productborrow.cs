using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace inventorybackend.src.Entities
{
    [Table("productborrow")]
    public class ProductborrowDbo
    {
        [Key]
        [Required]
        [Column("BorrowID", TypeName = "int")]
        public int BorrowID { get; set; }

        [Column("ItemID", TypeName = "int")]
        public int ItemID { get; set; }

        [Column("UserID", TypeName = "int")]
        public int UserID { get; set; }

        [Column("Quantity", TypeName = "int")]
        public int Quantity { get; set; }

        [Column("Status", TypeName = "int")]
        public int Status { get; set; }

        [Column("BorrowDate", TypeName = "datetime")]
        public DateTime BorrowDate { get; set; }

        [Column("ApprovedBy", TypeName = "int")]
        public int ApprovedBy { get; set; }

        [Column("ApprovedDate", TypeName = "datetime")]
        public DateTime ApprovedDate { get; set; }

        [Column("reason", TypeName = "text")]
        public string? reason { get; set; }

    }
}
