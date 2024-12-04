using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System;

namespace inventorybackend.src.Entities
{
    [Table("Warehouse")]
    public class WarehouseDbo
    {
        [Key]
        [Required]
        [Column("Warehouse_id", TypeName = "int")]
        public int WarehouseID { get; set; }

        [Column("Warehouse_name", TypeName = "varchar(255)")]
        public string? WarehouseName { get; set; }

        [Column("Warehouse_address", TypeName = "varchar(255)")]
        public string? WarehouseAddress { get; set; }

    }
}
