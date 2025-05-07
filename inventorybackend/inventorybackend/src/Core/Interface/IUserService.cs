using inventorybackend.DTOS;
using inventorybackend.src.Entities;

namespace inventorybackend.src.Core.Interface
{
    public interface IUserService
    {
        Task<List<UserDTO>> GetALLUserAsync();
        Task<List<UserwithroleDTO>> GetALLUserwithroleAsync();
        Task<Userprofile> GetUserByuserIDAsync(int userid);
        Task<UpdateUserProfliebyadmin> UpdateUserprofileAsync(UpdateUserProfliebyadmin UserProflie);

        Task<UserDbo> AddUserAsync(inputuser inputuser);
        Task<bool> DeleteUserAsync(int UserID);

        Task UpdateuserwithimageAsync(ImageUserDto userdto, string? imagePath);
        Task<bool> UpdateUserStatusAsync(int userId, int isActive);






    }
}
