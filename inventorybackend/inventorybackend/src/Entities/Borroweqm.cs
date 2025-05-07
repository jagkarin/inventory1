using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using inventorybackend.src.Models;

namespace inventorybackend.src.Entities
{
    public class BorroweqmDbo
    {
        [Key]
        [Required]
        [Column("Borrow_Id", TypeName = "int")]
        public int BorrowID { get; set; }

        [Column("borrow_details", TypeName = "json")]
        public string? BorrowDetails { get; set; } // ✅ แก้ชื่อให้ตรงกัน

        [Column("User_Id", TypeName = "int")]
        public int UserID { get; set; }

        [Column("Borrow_Date", TypeName = "datetime")]
        public DateTime BorrowDate { get; set; }

        [Column("Expected_Return_Date", TypeName = "datetime")]
        public DateTime? ExpectedReturnDate { get; set; }

        [Column("Status", TypeName = "varchar(20)")]
        public string? Status { get; set; }

        [Column("Return_status", TypeName = "varchar(45)")]
        public string? ReturnStatus { get; set; }

        [Column("borrow_code", TypeName = "varchar(50)")]
        public string? BorrowCode { get; set; }


        public List<BorrowDetail> GetBorrowDetails()
            => string.IsNullOrEmpty(BorrowDetails) ? new List<BorrowDetail>() : JsonConvert.DeserializeObject<List<BorrowDetail>>(BorrowDetails);

        public void SetBorrowDetails(List<BorrowDetail> details)
            => BorrowDetails = details != null ? JsonConvert.SerializeObject(details) : null;





    }


}