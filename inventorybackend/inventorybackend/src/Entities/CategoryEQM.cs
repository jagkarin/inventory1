using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System;

namespace inventorybackend.src.Entities
{
    [Table("categoryeqm")]
    public class CategoryEQMDbo
    {
        [Key]
        [Required]
        [Column("Category_ID", TypeName = "int")]
        public int Category_ID { get; set; }

        [Column("Category_Name", TypeName = "varchar(45)")]
        public string? Category_Name { get; set; }
    }
}
