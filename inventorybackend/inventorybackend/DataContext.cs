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

        public DbSet<MovementIVTDbo> MovementIVT { get; }

        public DbSet<UserDbo> User { get; set; }

        public DbSet<WarehouseDbo> Warehouse { get; set; }

        public DbSet<RoldDbo> Role { get; set; }

    }
}