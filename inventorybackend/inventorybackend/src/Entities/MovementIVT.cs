using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System;

namespace inventorybackend.src.Entities
{
    [Table("MovementIVT")]
    public class MovementIVTDbo
    {
        [Key]
        [Required]
        [Column("Movement_ID", TypeName = "int")]
        public int MovementID { get; set; }

        [Column("Product_ID", TypeName = "int")]
        public int ProductID { get; set; }

        [Column("Movementconfirm", TypeName = "bit")]
        public bool? Movementconfirm { get; set; }

        [Column("Quantity", TypeName = "int")]
        public int? Quantity { get; set; }

        [Column("Add_Date", TypeName = "datetime")]
        public DateTime? Adddate { get; set; }

        [Column("User_ID", TypeName = "int")]
        public int UserID { get; set; }
    }
}
