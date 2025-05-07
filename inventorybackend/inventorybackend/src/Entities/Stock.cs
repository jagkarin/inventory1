using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace inventorybackend.src.Entities
{
    [Table("stock")]
    public class StockDbo
    {
        [Key]
        [Required]
        [Column("stockID", TypeName = "int")]
        public int StockID { get; set; }

        [Column("ItemID", TypeName = "int")]
        public int ItemID { get; set; }

        [Column("ItemName", TypeName = "varchar(45)")]
        public string? ItemName { get; set; }

        [Column("SerialNumber", TypeName = "varchar(45)")]
        public string? SerialNumber { get; set; }

        [Column("Status", TypeName = "int")]
        public int Status { get; set; }

        [Column("stockin", TypeName = "date")]
        public DateOnly Stockin { get; set; }

        [Column("Quantity", TypeName = "int")]
        public int Quantity { get; set; }

        [Column("WarehouseID", TypeName = "int")]
        public int WarehouseID { get; set; }

    }
}
