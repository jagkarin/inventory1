using inventorybackend.DTOS;
using inventorybackend.src.Core.Interface;
using inventorybackend.src.Entities;
using inventorybackend.src.Interface;
using inventorybackend.src.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace inventorybackend.src.Core.Service
{
    public class WithdrawService : IWithdrawService
    {
        private readonly IWithdrawRepo _WithdrawRepo;
        private readonly DataContext _dataContext;
        private readonly ILogger<WithdrawService> _logger;

        public WithdrawService(IWithdrawRepo WithdrawRepo, DataContext dataContext, ILogger<WithdrawService> logger)
        {
            _WithdrawRepo = WithdrawRepo;
            _dataContext = dataContext;
            _logger = logger;
        }

        public async Task<bool> CreateWithdrawAsync(List<WithdrawDto> withdrawDtos)
        {
            if (withdrawDtos == null || !withdrawDtos.Any())
            {
                return false;
            }

            var withdrawList = withdrawDtos.Select(dto => new WithdrawDbo
            {
                WithdrawID = dto.WithdrawID, // ให้ API สร้างค่าเอง
                UserID = dto.UserID,
                ProductID = dto.ProductID,
                ProductName = dto.ProductName,
                Amount = dto.Amount,  // ป้องกันค่าที่เป็น 0
                CreatedAt = DateTime.Now,
                Status = dto.Status
            }).ToList();

            Console.WriteLine($"Mapped Withdraw Data: {JsonSerializer.Serialize(withdrawList)}");

            return await _WithdrawRepo.AddWithdrawsAsync(withdrawList);
        }




        public async Task<List<WithdrawUsername>> GetWithdraws0Async()
        {
            var withdraws = await _WithdrawRepo.GetAllWithdraws0Async();
            return withdraws.Select(w => new WithdrawUsername
            {
                WithdrawID = w.WithdrawID,  
                UserID = w.UserID,
                ProductID = w.ProductID,
                ProductName= w.ProductName,
                Amount = w.Amount,          // ใช้ decimal
                CreatedAt = w.CreatedAt,
                Status = w.Status,
                Firstname = w.Firstname,
                Lastname = w.Lastname,
                Product_image = w.Product_image,
            }).ToList();
        }

        public async Task<List<WithdrawUsername>> GetWithdraws1Async()
        {
            var withdraws = await _WithdrawRepo.GetAllWithdraws1Async();
            return withdraws.Select(w => new WithdrawUsername
            {
                WithdrawID = w.WithdrawID, 
                UserID = w.UserID,
                ProductID = w.ProductID,
                ProductName = w.ProductName,
                Amount = w.Amount,          // ใช้ decimal
                CreatedAt = w.CreatedAt,
                Status = w.Status,
                Firstname= w.Firstname,
                Lastname= w.Lastname,
                Product_image= w.Product_image,
            }).ToList();
        }

        public async Task<List<WithdrawUsername>> GetWithdraws2Async()
        {
            var withdraws = await _WithdrawRepo.GetAllWithdraws2Async();
            return withdraws.Select(w => new WithdrawUsername
            {
                WithdrawID = w.WithdrawID,  
                UserID = w.UserID,
                ProductID = w.ProductID,
                ProductName = w.ProductName,
                Amount = w.Amount,          // ใช้ decimal
                CreatedAt = w.CreatedAt,
                Status = w.Status,
                Firstname = w.Firstname,
                Lastname= w.Lastname,
                Product_image = w.Product_image,
            }).ToList();
        }

        public async Task<bool> UpdateWithdrawStatusAsync(int withdrawID, int status)
        {
            return await _WithdrawRepo.UpdateWithdrawStatusAsync(withdrawID, status);
        }

    }
}
