
using System.ComponentModel.DataAnnotations;

namespace inventorybackend.DTOS
{
    public class BorrowDto
    {
        public int BorrowId { get; set; }
        public int UserId { get; set; }
        public DateTime BorrowDate { get; set; }
        public DateTime? ExpectedReturnDate { get; set; }
        public string Status { get; set; }
        public List<BorrowDetailWithImageDto> BorrowDetails { get; set; } // เปลี่ยนเป็นรายละเอียดที่มีภาพ
        public string? Firstname { get; set; }
        public string? Lastname { get; set; }
        public string? ReturnStatus { get; set; }
        public string? BorrowCode { get; set; }
    }

    public class BorrowNameDto
    {
        public int BorrowId { get; set; }
        public int UserID { get; set; }
        public DateTime BorrowDate { get; set; }
        public DateTime? ExpectedReturnDate { get; set; }
        public string Status { get; set; }
        public List<BorrowDetailWithImageDto> BorrowDetails { get; set; }
        public string? Firstname { get; set; }
        public string? Lastname { get; set; }
    }

    public class CreateBorrowDto
    {
        public int UserId { get; set; }
        public DateTime BorrowDate { get; set; }
        public DateTime? ExpectedReturnDate { get; set; }
        public List<BorrowDetailDto> BorrowDetails { get; set; }
        public string Status { get; set; }
        public string? BorrowCode { get; set; }
        public string? ReturnStatus { get; set; }
    }

    public class UpdateBorrowDto
    {
        public string Status { get; set; }
        public string? ReturnStatus { get; set; }
    }

    public class UpdateReturnStatus
    {
        public string? ReturnStatus { get; set; }
        public DateTime ExpectedReturnDate { get; set; }
    }

    public class BorrowDetailDto // ใช้สำหรับ input
    {
        public string EQMNAME { get; set; } // ต้องใช้ EQMNAME ตาม JSON
        public int Quantity { get; set; }
        public string Category { get; set; }
        //public int CategoryId { get; set; }
        public string ImageUrl { get; set; }
    }

    public class BorrowDetailWithImageDto // ใช้สำหรับ output
    {
        public string EQMNAME { get; set; }
        public int Quantity { get; set; }
        public string Category { get; set; }
        public string ImageUrl { get; set; } // เพิ่มจาก JOIN
        //public int CategoryId { get; set; }
    }
}

