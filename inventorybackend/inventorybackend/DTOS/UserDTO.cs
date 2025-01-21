using System.ComponentModel.DataAnnotations.Schema;

namespace inventorybackend.DTOS
{
    public class UserDTO
    {

        public int UserID { get; set; }

        public string? Username { get; set; }

        public string? Password { get; set; }
        //join rold
        public int? RoleID { get; set; }

        public string? Email { get; set; }

        public string? Phonenumber { get; set; }

        public string? Firstname { get; set; }

        public string? Lastname { get; set; }

        public DateTime? Dateofbirth { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public string? Profilepicture { get; set; }

        public string? Address { get; set; }
    }


    public class UserwithroleDTO
    {

        public int UserID { get; set; }

        public string? Username { get; set; }

        public string? Password { get; set; }
        //join rold
        public int? RoleID { get; set; }

        public string? Email { get; set; }

        public string? Phonenumber { get; set; }

        public string? Firstname { get; set; }

        public string? Lastname { get; set; }

        public DateTime? Dateofbirth { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public string? Profilepicture { get; set; }

        public string? Address { get; set; }
        //join rold
        public string? RoleName { get; set; }
    }

    public class Userprofile
    {
        public int UserID { get; set; }

        public string? Firstname { get; set; }

        public string? Lastname { get; set; }

        public int? RoleID { get; set; }

        public string? RoleName { get; set; }

    }


    public class inputuser
    {
        public int UserID { get; set; }

        public string? Username { get; set; }

        public string? Password { get; set; }

        public DateTime? CreatedAt { get; set; }

        public int RoleID { get; set; }

    }

    public class LoginDto
    {
        public string? Username { set; get; }
        public string? Password { set; get; }
    }


    public class RegisterDto
    {
        public string? Username { set; get; }
        public string? Password { set; get; }
        public int RoleId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public string? Firstname { get; set; }
        public string? Lastname { get; set; }

    }

    public class UpdateUserProfliebyUser
    {
        public int UserID { get; set; }

        public string? Firstname { get; set; }

        public string? Lastname { get; set; }

        public string? Email { get; set; }

        public string? Phonenumber { get; set; }

        public DateTime? Dateofbirth { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public string? Address { get; set; }
    }

}
