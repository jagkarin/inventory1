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

        public string? ProfilePicture { get; set; }

        public string? Address { get; set; }

        public int IsActive { get; set; } 

    }

    public class UpdateStatusDto
    {
        //public int UserID { get; set; }
        public int IsActive { get; set; } // เปลี่ยนจาก bool เป็น int (0 = ปิด, 1 = เปิด)
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

        public string? ProfilePicture { get; set; }

        public string? Address { get; set; }
        //join rold
        public string? RoleName { get; set; }

        public int IsActive { get; set; } 
    }

    public class Userprofile
    {
        public int UserID { get; set; }

        public string? Firstname { get; set; }

        public string? Lastname { get; set; }

        public int? RoleID { get; set; }

        public string? RoleName { get; set; }

        public string? Password { get; set; }

        public string? Username { get; set; }

        public string? ProfilePicture { get; set; }
        public string? Email { get; set; }
        public string? Phonenumber { get; set; }
        public DateTime? Dateofbirth { get; set; }
        public string? Address { get; set; }
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

    public class UpdateUserProfliebyadmin
    {
        public int UserID { get; set; }

        public string? Firstname { get; set; }

        public string? Lastname { get; set; }

        public string? Email { get; set; }

        public string? Phonenumber { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public int RoleID { get; set; }
    }

    public class ImageUserDto
    {
        public int UserID { get; set; }
        public string? Email { get; set; }

        public string? Phonenumber { get; set; }

        public string? Firstname { get; set; }

        public string? Lastname { get; set; }

        public string? Dateofbirth { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public string? Address { get; set; }
    }

}
