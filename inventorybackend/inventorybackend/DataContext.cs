using inventorybackend.src.Entities;
using Microsoft.EntityFrameworkCore;

namespace inventorybackend
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        public DbSet<eqmDbo> EQM { get; set; }
        public DbSet<ProductDbo> Product { get; set; }
        public DbSet<CategoryDbo> Category { get; set; }
        public DbSet<CategoryEQMDbo> CategoryEQM { get; set; }
        public DbSet<MovementIVTDbo> MovementIVT { get; set; }
        public DbSet<UserDbo> User { get; set; }
        public DbSet<WarehouseDbo> Warehouse { get; set; }
        public DbSet<RoldDbo> Role { get; set; }

        // ใช้ OnModelCreating เพื่อกำหนดคอนฟิกต่าง ๆ
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ตัวอย่างการตั้งค่าให้ Role_ID ใน User ต้องไม่เป็น null
            modelBuilder.Entity<UserDbo>()
            .Property(u => u.RoleID)
            .HasDefaultValue(1); // สมมติว่า default คือ 1
        }
    }
}
