using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace inventorybackend.DTOS
{
    public class EQMDTO
    {
        public int EQMID { get; set; }

        public string? EQMName { get; set; }

        public string? EQMDescription { get; set; }

        public int? Quantity { get; set; }

        public DateTime? Adddate { get; set; }

        public int Category_ID { get; set; }
    }

    public class InputEQMDTO
    {

        public string? EQMName { get; set; }

        public string? EQMDescription { get; set; }

        public int? Quantity { get; set; }

        public DateTime? Adddate { get; set; }

        public int Category_ID { get; set; }
    }


    public class EqmwithCategory
    {
        public int EQMID { get; set; }

        public string? EQMName { get; set; }

        public string? EQMDescription { get; set; }

        public int? Quantity { get; set; }

        public DateTime? Adddate { get; set; }

        public int Category_ID { get; set; }

        public string? Category_Name { get; set; }
    }
}

