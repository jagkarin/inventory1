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

    }
}
