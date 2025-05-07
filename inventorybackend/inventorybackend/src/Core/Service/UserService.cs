using inventorybackend.DTOS;
using inventorybackend.src.Core.Interface;
using inventorybackend.src.Entities;
using inventorybackend.src.Interface;
using inventorybackend.src.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System;

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



        public async Task<UpdateUserProfliebyadmin> UpdateUserprofileAsync(UpdateUserProfliebyadmin UserProflie)
        {
            try
            {
                // ?????????????????????????
                _logger.LogInformation("Received request to update User with ID: {UserID} ", UserProflie.UserID);

                var user = new Entities.UserDbo
                {
                    UserID = UserProflie.UserID,
                    Firstname = UserProflie.Firstname,
                    Lastname = UserProflie.Lastname,
                    UpdatedAt = DateTime.Now,
                    Phonenumber = UserProflie.Phonenumber,
                    Email = UserProflie.Email,
                    RoleID = UserProflie.RoleID,
                    

                };


                var updatedProduct = await _userrepo.UpdateUserprofileAsync(user);

                _logger.LogInformation("Successfully updated User with ID: {UserID}", UserProflie.UserID);

                return new UpdateUserProfliebyadmin
                {
                    UserID = UserProflie.UserID,
                    Firstname = UserProflie.Firstname,
                    Lastname = UserProflie.Lastname,
                    UpdatedAt = DateTime.Now,
                    Phonenumber = UserProflie.Phonenumber,
                    Email= UserProflie.Email,
                    RoleID= UserProflie.RoleID,

                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating User with ID: {UserID}. Inner exception: {InnerException}", UserProflie.UserID, ex.InnerException?.Message);
                throw new Exception("Error occurred while updating User", ex);
            }
        }

        public async Task<bool> UpdateUserStatusAsync(int userId, int isActive)
        {
            var user = await _userrepo.GetUserByIdAsync(userId);
            if (user == null)
            {
                return false;
            }

            user.IsActive = isActive; // รับค่า int (0 หรือ 1)
            return await _userrepo.UpdateUserAsync(user);
        }


        public async Task<bool> DeleteUserAsync(int UserID)
        {
            var product = await _userrepo.GetUserByuserIDAsync(UserID); // ตรวจสอบว่ามีข้อมูลหรือไม่
            if (product == null)
            {
                return false; // คืนค่า false ถ้าไม่พบข้อมูล
            }

            await _userrepo.DeleteUserAsync(UserID); // ลบข้อมูล
            return true; // คืนค่า true ถ้าลบสำเร็จ
        }


        public async Task UpdateuserwithimageAsync(ImageUserDto userdto, string? imagePath)
        {
            var existingUser = await _dataContext.User.FindAsync(userdto.UserID);

            if (existingUser == null)
                throw new Exception("User not found.");

            // อัปเดตข้อมูลจาก DTO
            existingUser.UserID = userdto.UserID;
            existingUser.Firstname = userdto.Firstname;
            existingUser.Lastname = userdto.Lastname;
            existingUser.UpdatedAt = DateTime.Now;
            existingUser.Dateofbirth = DateTime.Parse(userdto.Dateofbirth); // แปลง string เป็น DateTime
            existingUser.Address = userdto.Address;
            existingUser.Email = userdto.Email;
            existingUser.Phonenumber = userdto.Phonenumber;

            // อัปเดต ProfilePicture ถ้ามี
            if (!string.IsNullOrEmpty(imagePath))
            {
                existingUser.ProfilePicture = imagePath; // ใช้ Relative Path โดยตรง
            }

            await _userrepo.UpdateUserwithimageAsync(existingUser);
        }



    }
}
