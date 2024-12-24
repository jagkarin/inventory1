using inventorybackend.DTOS;
using inventorybackend.src.Core.Interface;
using inventorybackend.src.Entities;
using inventorybackend.src.Interface;
using inventorybackend.src.Repositories;

namespace inventorybackend.src.Core.Service
{
    public class UserService : IUserService
    {
        private readonly IUserRepo _userrepo;
        private readonly DataContext _dataContext;
        private readonly ILogger<UserService> _logger;

        public UserService(IUserRepo userrepo, DataContext dataContext, ILogger<UserService> logger)
        {
            _userrepo = userrepo;
            _dataContext = dataContext;
            _logger = logger;
        }

        public async Task<List<UserwithroleDTO>> GetALLUserwithroleAsync()  
        {
            try
            {
                var user = await _userrepo.GetALLUserwithroleAsync();
                return user;
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"An error occurred while retrieving the userwithrole : {ex.Message}", ex);
            }
        }

        public async Task<List<UserDTO>> GetALLUserAsync()
        {
            try
            {
                var useruseData = await _userrepo.GetALLUserAsync();
                var useruseReturn = useruseData.Select(u => new UserDTO
                {
                    UserID = u.UserID,
                    Username = u.Username,
                    Password = u.Password,
                    Phonenumber = u.Phonenumber,
                    Address = u.Address,
                    Email = u.Email,
                    Firstname = u.Firstname,
                    Lastname = u.Lastname,
                    Dateofbirth = u.Dateofbirth,
                    CreatedAt = u.CreatedAt,
                    UpdatedAt = u.UpdatedAt,
                    RoleID = u.RoleID,
                }).ToList();

                return useruseReturn;
            }
            catch (Exception ex)
            {

                throw new ApplicationException("An error occurred while getting the User data.", ex);
            }
        }


        public async Task<Userprofile> GetUserByuserIDAsync(int userid)
        {
            try
            {
                var user = await _userrepo.GetUserByuserIDAsync(userid);
                return user;
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"An error occurred while retrieving the User : {ex.Message}", ex);
            }
        }
    }
}
