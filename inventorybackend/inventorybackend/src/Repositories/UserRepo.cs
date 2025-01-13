using inventorybackend.DTOS;
using inventorybackend.src.Entities;
using inventorybackend.src.Interface;
using Microsoft.EntityFrameworkCore;


namespace inventorybackend.src.Repositories
{
    public class UserRepo : IUserRepo
    {
        public readonly DataContext _dbContext;
        private readonly ILogger<UserDbo> _logger;

        public UserRepo(DataContext dbContext, ILogger<UserDbo> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<List<UserDbo>> GetALLUserAsync()
        {
            try
            {
                return await _dbContext.User.ToListAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        public async Task<List<UserwithroleDTO>> GetALLUserwithroleAsync()
        {
            try
            {
                var user = await (from u in _dbContext.User
                                             join r in _dbContext.Role
                                             on u.RoleID equals r.RoleID
                                             select new UserwithroleDTO
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
                                                 RoleName = r.RoleName,

                                             }).ToListAsync();

                return user;
            }
            catch (Exception ex)
            {
                // เพิ่มข้อความแสดงข้อผิดพลาดจาก exception ที่แท้จริง
                throw new ApplicationException($"An error occurred while retrieving the productcategory data: {ex.Message}", ex);
            }

        }

        //auth
        public async Task<UserDbo> GetById(int UserID)
        {
            return await _dbContext.User.FirstOrDefaultAsync(u => u.UserID == UserID);
        }


        public async Task<Userprofile> GetUserByuserIDAsync(int userid)
        {
            try
            {
                var user = await (from u in _dbContext.User
                                  join r in _dbContext.Role
                                  on u.RoleID equals r.RoleID
                                  where u.UserID == userid // กรองตาม UserID
                                  select new Userprofile
                                  {
                                      UserID = u.UserID,
                                      Firstname = u.Firstname,
                                      Lastname = u.Lastname,
                                      RoleName = r.RoleName,
                                      RoleID = u.RoleID,
                                  }).FirstOrDefaultAsync(); // ดึงเฉพาะรายการเดียว

                return user;
            }
            catch (Exception ex)
            {
                throw new Exception($"เกิดข้อผิดพลาดขณะดึงข้อมูลผู้ใช้: {ex.Message}", ex);
            }
        }

        public async Task<UserDbo> AddUserAsync(UserDbo User)
        {
            try
            {
                _dbContext.User.Add(User);
                await _dbContext.SaveChangesAsync();
                return User;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //auth
        public async Task<UserDbo> GetByusername(string username)
        {
            return await _dbContext.User.FirstOrDefaultAsync(u => u.Username == username);
        }

        //auth
        public async Task<UserDbo> Update(UserDbo user)
        {
            var existingUser = await _dbContext.User.FirstOrDefaultAsync(u => u.UserID == user.UserID);
            if (existingUser == null)
            {
                throw new Exception("User not found.");
            }

            existingUser.Username = user.Username;
            existingUser.Email = user.Email;
            existingUser.Password = user.Password; 

            await _dbContext.SaveChangesAsync();
            return existingUser;
        }
        public async Task<UserDbo> UpdateUserprofileAsync(UserDbo User)
        {
            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                // Log before finding the user
                _logger.LogInformation("Attempting to update User with ID: {UserID}", User.UserID);

                var existingUser = await _dbContext.User.FindAsync(User.UserID);
                if (existingUser == null)
                {
                    _logger.LogError("Products with ID {UserID} not found", User.UserID);
                    throw new Exception($"User with ID {User.UserID} not found");
                }

                _logger.LogInformation("Found User with ID : {UserID}.", User.UserID);
                existingUser.Email = User.Email;
                existingUser.Phonenumber = User.Phonenumber;
                existingUser.Firstname = User.Firstname;
                existingUser.Lastname = User.Lastname;
                existingUser.Dateofbirth = User.Dateofbirth;
                existingUser.UpdatedAt = DateTime.Now;
                existingUser.Address = User.Address;
                existingUser.UserID = User.UserID;
              


                _dbContext.User.Update(existingUser);


                await _dbContext.SaveChangesAsync();

                await transaction.CommitAsync();
                _logger.LogInformation("Successfully updated User with ID: {UserID}", User.UserID);

                return existingUser;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error occurred while updating User with ID : {UserID}. Inner exception: {InnerException}", User.UserID, ex.InnerException?.Message);
                throw new Exception($"Error occurred while updating User with ID {User.UserID}", ex);
            }
        }

    }
}
