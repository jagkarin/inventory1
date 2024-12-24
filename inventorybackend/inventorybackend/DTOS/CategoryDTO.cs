using System.ComponentModel.DataAnnotations.Schema;

namespace inventorybackend.DTOS
{
    public class CategoryDTO
    {
        public int CategoriesID { get; set; }
        public string? CategoriesName { get; set; }

    }
}
