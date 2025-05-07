using Microsoft.EntityFrameworkCore;
using inventorybackend.src.Core.Interface;
using inventorybackend.src.Core.Service;
using inventorybackend.src.Infrastructure.Interface;
using inventorybackend.src.Infrastructure.Repositories;
using inventorybackend.src.Interface;
using inventorybackend.src.Repositories;
using inventorybackend;
using auth.Helpers;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// WareHouse
builder.Services.AddScoped<IWarehouseRepo, WarehouseRepo>();
builder.Services.AddScoped<IWarehouseService, WarehouseService>();
// Product
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IProductRepo, ProductRepo>();
// Category
builder.Services.AddScoped<ICategoryRepo, CategoryRepo>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
// Equipment
builder.Services.AddScoped<IEquipmentService, EquipmentService>();
builder.Services.AddScoped<IEquipmentRepo, EquipmentRepo>();
// User
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepo, UserRepo>();

builder.Services.AddScoped<IWithdrawRepo, WithdrawRepo>();
builder.Services.AddScoped<IWithdrawService, WithdrawService>();

builder.Services.AddScoped<IWithdraweqmService, WithdraweqmService>();
builder.Services.AddScoped<IWithdraweqmRepo, WithdraweqmRepo>();

//ItemMaster
builder.Services.AddScoped<IItemMasterService, ItemMasterService>();
builder.Services.AddScoped<IItemMasterRepo, ItemMasterRepo>();

//Stock
builder.Services.AddScoped<IStockService, StockService>();
builder.Services.AddScoped<IStockRepo, StockRepo>();

//EqmBorrow
builder.Services.AddScoped<IEqmborrowRepo, EqmborrowRepo>();
builder.Services.AddScoped<IEqmborrowService, EqmborrowService>();

// JWT
builder.Services.AddScoped<JwtService>();

builder.Services.AddDbContext<DataContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
    ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000") // เปลี่ยนเป็น Origin ของ Frontend
                  .AllowCredentials()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "asset")),
    RequestPath = "/asset", // ชัดเจนว่าเสิร์ฟจาก /asset
    OnPrepareResponse = ctx =>
    {
        Console.WriteLine($"Serving file: {ctx.File.PhysicalPath}"); // Debug
    }
});

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "product")),
    RequestPath = "/product", // เสิร์ฟไฟล์จาก /product/ ซึ่งชี้ไปที่ wwwroot/product/
    OnPrepareResponse = ctx =>
    {
        Console.WriteLine($"Serving product file: {ctx.File.PhysicalPath}"); // Debug สำหรับสินค้า
    }
});

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "profile")),
    RequestPath = "/profile", // เสิร์ฟไฟล์จาก /product/ ซึ่งชี้ไปที่ wwwroot/product/
    OnPrepareResponse = ctx =>
    {
        Console.WriteLine($"Serving profile file: {ctx.File.PhysicalPath}"); // Debug สำหรับสินค้า
    }
});

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "itemmaster")),
    RequestPath = "/itemmaster", // เสิร์ฟไฟล์จาก /product/ ซึ่งชี้ไปที่ wwwroot/product/
    OnPrepareResponse = ctx =>
    {
        Console.WriteLine($"Serving itemmaster file: {ctx.File.PhysicalPath}"); // Debug สำหรับสินค้า
    }
});

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "return")),
    RequestPath = "/return", // เสิร์ฟไฟล์จาก /product/ ซึ่งชี้ไปที่ wwwroot/product/
    OnPrepareResponse = ctx =>
    {
        Console.WriteLine($"Serving return file: {ctx.File.PhysicalPath}"); // Debug สำหรับสินค้า
    }
});

app.UseCors("AllowAll");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();