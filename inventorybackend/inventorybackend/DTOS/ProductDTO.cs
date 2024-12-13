using System.ComponentModel.DataAnnotations.Schema;

namespace inventorybackend.DTOS
{
    public class ProductDTO
    {
        public int ProductsID { get; set; }
        public string? ProductsName { get; set; }
        public string? Description { get; set; }
        public int? Quantity { get; set; }
        public DateTime? Adddate { get; set; }
        public int CategoriesID { get; set; }
    }

    public class UpdateProductDTO
    {
        public int ProductsID { get; set; }
        public string? ProductsName { get; set; }
        public string? Description { get; set; }
        public int? Quantity { get; set; }
        public DateTime? Adddate { get; set; }
        //public int CategoriesID { get; set; }
    }

    public class InputProductDTO
    {
        public string? ProductsName { get; set; }
        public string? Description { get; set; }
        public int? Quantity { get; set; }
        public DateTime? Adddate { get; set; }
        public int CategoriesID { get; set; }
    }

    public class ProductCategoryDTO
    {
        public int ProductsID { get; set; }
        public string? ProductsName { get; set; }
        public string? Description { get; set; }
        public int? Quantity { get; set; }
        public DateTime? Adddate { get; set; }
        public int CategoriesID { get; set; }
        public string? CategoriesName { get; set; }
    }

    
}
