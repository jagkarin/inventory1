using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace inventorybackend.src.Entities
{
    [Table("Withdraw")]
    public class WithdrawDbo
    {
        [Key]
        [Required]
        [Column("withdrawID" , TypeName = "int")]
        public int WithdrawID { get; set; }

        [Column("ProductID" , TypeName = "int")]
        public int ProductID { get; set; }

        [Column("CreatedAt", TypeName = "datetime")]
        public DateTime? CreatedAt { get; set; }

        [Column("UserID", TypeName = "int")]
        public int UserID { get; set; }

        [Column("Status", TypeName = "nvarchar(50)")]
        public string? Status { get; set; }

        [Column("Amount", TypeName = "nvarchar(100)")]
        public string? Amount { get; set; }

    }
}
