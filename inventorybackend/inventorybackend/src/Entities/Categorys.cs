using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System;

namespace inventorybackend.src.Entities
{
    [Table("categorys")]
    public class CategoryDbo
    {
        [Key]
        [Required]
        [Column("CategoriesID", TypeName = "int")]
        public int CategoriesID { get; set; }

        [Column("CategoriesName", TypeName = "varchar(45)")]
        public string? CategoriesName { get; set; }
    }
}
