using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System;

namespace inventorybackend.src.Entities
{
    [Table("Users")]
    public class UserDbo
    {
        [Key]
        [Required]
        [Column("User_ID", TypeName = "int")]
        public int UserID { get; set; }

        [Column("Username", TypeName = "varchar(50)")]
        public string? Username { get; set; }

        [Column("Password", TypeName = "varchar(50)")]
        public string? Password { get; set; }

        [Column("Role_ID", TypeName = "int")]
        public int? RoleID { get; set; }

        [Column("Email", TypeName = "varchar(50)")]
        public string? Email { get; set; }

        [Column("Phone_number", TypeName = "varchar(50)")]
        public string? Phonenumber { get; set; }

        [Column("First_name", TypeName = "varchar(50)")]
        public string? Firstname { get; set; }

        [Column("Last_name", TypeName = "varchar(50)")]
        public string? Lastname { get; set; }

        [Column("Date_of_birth", TypeName = "datetime")]
        public DateTime? Dateofbirth { get; set; }

        [Column("Created_at", TypeName = "datetime")]
        public DateTime? CreatedAt { get; set; }

        [Column("Updated_at", TypeName = "datetime")]
        public DateTime? UpdatedAt { get; set; }

        [Column("Profile_picture", TypeName = "text")]
        public string? Profilepicture { get; set; }

        [Column("Address", TypeName = "varchar(255)")]
        public string? Address { get; set; }

    }
}
