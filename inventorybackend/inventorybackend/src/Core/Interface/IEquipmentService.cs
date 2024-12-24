using inventorybackend.DTOS;
using inventorybackend.src.Entities;

namespace inventorybackend.src.Core.Interface
{
    public interface IEquipmentService
    {
        Task<List<EQMDTO>> GetALLEQMAsync();
        Task<EQMDTO> GetEquipmentByIdAsync(int EQMID);
        Task<List<EqmwithCategory>> GetAllEquipmentCategoryAsync();
        Task<eqmDbo> AddEquipmentAsync(InputEQMDTO InputEQMDTO);

    }
}
