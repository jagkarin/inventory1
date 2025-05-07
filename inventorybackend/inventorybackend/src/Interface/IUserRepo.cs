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
        Task<UserDbo> UpdateUserprofileAsync(UserDbo User);
        Task<UserDbo> GetById(int UserID);

        Task<bool> UpdateUserAsync(UserDbo user);
        Task<UserDbo> GetUserByIdAsync(int userId);

        Task UpdateUserwithimageAsync(UserDbo User);

        Task<bool> DeleteUserAsync(int UserID);



    }
}
