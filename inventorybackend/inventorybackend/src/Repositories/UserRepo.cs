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

        public async Task<UserDbo> UpdateProfileImage(int userId, string imagePath)
        {
            // ค้นหาผู้ใช้จากฐานข้อมูลโดยใช้ UserID
            var existingUser = await _dbContext.User.FirstOrDefaultAsync(u => u.UserID == userId);
            if (existingUser == null)
            {
                throw new Exception("User not found.");
            }

            // อัปเดตรูปโปรไฟล์ของผู้ใช้
            existingUser.Profilepicture = imagePath;

            // บันทึกการเปลี่ยนแปลงในฐานข้อมูล
            await _dbContext.SaveChangesAsync();

            // คืนค่าผู้ใช้ที่อัปเดตรูปโปรไฟล์แล้ว
            return existingUser;
        }

    }
}
