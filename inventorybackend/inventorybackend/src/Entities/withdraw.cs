using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace inventorybackend.src.Entities
{
    [Table("withdraw")]
    public class withdrawDbo
    {
        [Key]
        [Required]
        [Column("withdrawID" , TypeName = "int")]
        public int withdrawID { get; set; }

        [Column("ProductsID" , TypeName = "int")]
        public int ProductsID { get; set; }

        [Column("EQM_ID", TypeName = "int")]
        public int EQMID { get; set; }

        [Column("UserID", TypeName = "int")]
        public int UserID { get; set; }

        [Column("Status", TypeName = " varchar(50)")]
        public string? Status { get; set; }

        [Column("amount", TypeName = " varchar(100)")]
        public string? Amount { get; set; }
    }
}
