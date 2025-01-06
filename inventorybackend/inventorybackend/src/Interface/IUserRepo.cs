using inventorybackend.DTOS;
using inventorybackend.src.Entities;

namespace inventorybackend.src.Interface
{
    public interface IUserRepo
    {
        Task<List<UserDbo>> GetALLUserAsync();
        Task<List<UserwithroleDTO>> GetALLUserwithroleAsync();
        Task<Userprofile> GetUserByuserIDAsync(int userid);
        Task<UserDbo> AddUserAsync(UserDbo User);
        Task<UserDbo> GetByusername(string username);
        Task<UserDbo> Update(UserDbo user);

        Task<UserDbo> GetById(int UserID);
    }
}
