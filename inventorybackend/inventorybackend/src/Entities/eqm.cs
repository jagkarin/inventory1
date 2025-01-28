using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System;

namespace inventorybackend.src.Entities
{
    [Table("eqm")]
    public class eqmDbo
    {
        [Key]
        [Required]
        [Column("EQM_ID", TypeName = "int")]
        public int EQMID { get; set; }

<<<<<<< HEAD
        [Column("EQM_Name", TypeName = "varchar(45)")]
=======
        [Column("EQM_Name", TypeName = "varchar(100)")]
>>>>>>> refs/remotes/origin/ploy
        public string? EQM_Name { get; set; }

        [Column("Description", TypeName = "text")]
        public string? EQMDescription { get; set; }

        [Column("Quantity", TypeName = "int")]
        public int? Quantity { get; set; }

        [Column("AddDate", TypeName = "datetime")]
        public DateTime? Adddate { get; set;}

        [Column("Category_ID", TypeName ="int")]
        public int Category_ID { get; set; }

        [Column("EQM_image", TypeName = "varchar(255)")]
        public string? EQMimage { get; set; }
    }
}
