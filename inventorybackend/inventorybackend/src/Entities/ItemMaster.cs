using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace inventorybackend.src.Entities
{
    [Table("itemmaster")]
    public class ItemMasterDbo
    {
        [Key]
        [Required]
        [Column("ItemID", TypeName = "int")]
        public int ItemID { get; set; }

        [Column("ItemName", TypeName = "varchar(255)")]
        public string? Itemname { get; set; }

        [Column("Description", TypeName = "text")]
        public string? Description { get; set; }

        [Column("Units", TypeName = "varchar(55)")]
        public string? Units { get; set; }

        [Column("Status", TypeName = "int")]
        public int Status { get; set; }

        [Column("ItemType", TypeName = "int")]
        public int ItemType { get; set; }

        [Column("CategoryID", TypeName = "int")]
        public int CategoryID { get; set; }

        [Column("Image", TypeName = "varchar(255)")]
        public string? Image { get; set; }

        [Column("CreatedAt", TypeName = "Datetime")]
        public DateTime CreatedAt { get; set; }



    }
}
