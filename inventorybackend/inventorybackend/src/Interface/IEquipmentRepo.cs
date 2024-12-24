using inventorybackend.DTOS;
using inventorybackend.src.Entities;

namespace inventorybackend.src.Interface
{
    public interface IEquipmentRepo
    {
        Task<List<eqmDbo>> GetALLEQMAsync();
        Task<eqmDbo> GetEquipmentByIdAsync(int EQMID);
        Task<List<EqmwithCategory>> GetAllEquipmentCategoryAsync();
        Task<eqmDbo> AddEquipmentAsync(eqmDbo eqm);
    }
}
