using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace inventorybackend.src.Entities
{
    [Table("Role")]
    public class RoldDbo
    {
            [Key]
            [Required]
            [Column("Role_ID", TypeName = "int")]
            public int RoleID { get; set; }

            [Column("Role_Name", TypeName = "varchar(50)")]
            public string? RoleName { get; set; }

    }
}
