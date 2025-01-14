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
        Task<bool> DeleteEQMAsync(int EQMID);
        Task<UpdateEquipmentDTO> UpdateEQMAsync(UpdateEquipmentDTO UpdateEquipment);
        Task<EquipmentwithimageDTO> AddEquipmentAsync(EquipmentwithimageDTO EQMDto, string imagePath);
        Task UpdateEQMwithimageAsync(EquipmentwithimageDTO EQMDto, string imagePath);

    }
}
