using inventorybackend.DTOS;

namespace inventorybackend.src.Core.Interface
{
    public interface IUserService
    {
        Task<List<UserDTO>> GetALLUserAsync();
        Task<List<UserwithroleDTO>> GetALLUserwithroleAsync();
        Task<Userprofile> GetUserByuserIDAsync(int userid);
    }
}
