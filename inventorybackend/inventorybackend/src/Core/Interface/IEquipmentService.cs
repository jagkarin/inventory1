using inventorybackend.DTOS;

namespace inventorybackend.src.Core.Interface
{
    public interface IEquipmentService
    {
        Task<List<EQMDTO>> GetALLEQMAsync();
    }
}
