using inventorybackend.DTOS;
using inventorybackend.src.Core.Interface;
using inventorybackend.src.Entities;
using inventorybackend.src.Interface;
using inventorybackend.src.Repositories;
using Microsoft.EntityFrameworkCore;

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

        public async Task<UserDbo> AddUserAsync(inputuser inputuser)
        {
            try
            {
                var user = new Entities.UserDbo
                {
                    UserID  = inputuser.UserID,
                    Username=inputuser.Username,
                    Password = inputuser.Password,
                    CreatedAt= DateTime.Now,
                    RoleID = inputuser.RoleID,


                };
                var adduser = await _userrepo.AddUserAsync(user);
                return new UserDbo
                {
                    UserID= adduser.UserID,
                    Username=adduser.Username,
                    Password=adduser.Password,
                    CreatedAt = adduser.CreatedAt,
                    RoleID=adduser.RoleID,

                };
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while adding data.", ex);
            }
        }

        public async Task<UpdateUserProfliebyUser> UpdateUserprofileAsync(UpdateUserProfliebyUser UserProflie)
        {
            try
            {
                // ?????????????????????????
                _logger.LogInformation("Received request to update User with ID: {ProductsID} ", UserProflie.UserID);

                var user = new Entities.UserDbo
                {
                    UserID = UserProflie.UserID,
                    Firstname = UserProflie.Firstname,
                    Lastname = UserProflie.Lastname,
                    Address = UserProflie.Address,
                    UpdatedAt = DateTime.Now,
                    Phonenumber = UserProflie.Phonenumber,
                    Dateofbirth = UserProflie.Dateofbirth,
                    Email = UserProflie.Email,
                    

                };


                var updatedProduct = await _userrepo.UpdateUserprofileAsync(user);

                _logger.LogInformation("Successfully updated User with ID: {UserID}", UserProflie.UserID);

                return new UpdateUserProfliebyUser
                {
                    UserID = UserProflie.UserID,
                    Firstname = UserProflie.Firstname,
                    Lastname = UserProflie.Lastname,
                    Address = UserProflie.Address,
                    UpdatedAt = DateTime.Now,
                    Phonenumber = UserProflie.Phonenumber,
                    Dateofbirth = UserProflie.Dateofbirth,
                    Email= UserProflie.Email,

                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating User with ID: {UserID}. Inner exception: {InnerException}", UserProflie.UserID, ex.InnerException?.Message);
                throw new Exception("Error occurred while updating User", ex);
            }
        }

    }
}
