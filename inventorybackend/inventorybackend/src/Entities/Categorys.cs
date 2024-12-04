using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System;

namespace inventorybackend.src.Entities
{
    [Table("Category")]
    public class CategoryDbo
    {
        [Key]
        [Required]
        [Column("Categories_ID", TypeName = "int")]
        public int CategoriesID { get; set; }

        [Column("Categories_Name", TypeName = "varchar(45)")]
        public string? CategoriesName { get; set; }
    }
}
