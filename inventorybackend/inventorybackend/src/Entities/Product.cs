using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System;

namespace inventorybackend.src.Entities
{
    [Table("Product")]
    public class ProductDbo
    {
        [Key]
        [Required]
        [Column("ProductsID", TypeName = "int")]
        public int ProductsID { get; set; }

        [Column("ProductsName", TypeName = "varchar(100)")]
        public string? ProductsName { get; set; }

        [Column("Description", TypeName = "text")]
        public string? Description { get; set; }

        [Column("Quantity", TypeName = "int")]
        public int? Quantity { get; set; }

        [Column("AddDate", TypeName = "datetime")]
        public DateTime? Adddate { get; set; }

        [Column("CategorysID", TypeName = "int")]
        public int CategoriesID { get; set; }
    }
}
