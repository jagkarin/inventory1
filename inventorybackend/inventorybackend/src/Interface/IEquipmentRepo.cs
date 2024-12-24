using inventorybackend.src.Entities;

namespace inventorybackend.src.Interface
{
    public interface IEquipmentRepo
    {
        Task<List<eqmDbo>> GetALLEQMAsync();
    }
}
