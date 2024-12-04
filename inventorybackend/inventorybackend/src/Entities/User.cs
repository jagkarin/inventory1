using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System;

namespace inventorybackend.src.Entities
{
    [Table("User")]
    public class UserDbo
    {
        [Key]
        [Required]
        [Column("User_ID", TypeName = "int")]
        public int UserID { get; set; }

        [Column("User_name", TypeName = "varchar(50)")]
        public string? Username { get; set; }

        [Column("Password", TypeName = "varchar(50)")]
        public string? Password { get; set; }

        [Column("Role", TypeName = "varchar(50)")]
        public string? Role { get; set; }
    }
}
