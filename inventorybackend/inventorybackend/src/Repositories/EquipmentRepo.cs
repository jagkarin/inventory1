using inventorybackend.DTOS;
using inventorybackend.src.Entities;
using inventorybackend.src.Interface;
using Microsoft.EntityFrameworkCore;

namespace inventorybackend.src.Repositories
{
    public class EquipmentRepo : IEquipmentRepo
    {
        public readonly DataContext _dbContext;
        private readonly ILogger<eqmDbo> _logger;

        public EquipmentRepo(DataContext dbContext, ILogger<eqmDbo> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<List<eqmDbo>> GetALLEQMAsync()
        {
            try
            {
                return await _dbContext.EQM.ToListAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<eqmDbo> GetEquipmentByIdAsync(int EQMID)
        {
            return await _dbContext.EQM.FirstOrDefaultAsync(w => w.EQMID == EQMID);
        }

        public async Task<List<EqmwithCategory>> GetAllEquipmentCategoryAsync()
        {
            try
            {
                var eqmcategory = await (from e in _dbContext.EQM
                                             join c in _dbContext.CategoryEQM
                                             on e.Category_ID equals c.Category_ID
                                             select new EqmwithCategory
                                             {
                                                 EQMName = e.EQMName,
                                                 EQMID = e.EQMID,
                                                 EQMDescription = e.EQMDescription,
                                                 Adddate = e.Adddate,
                                                 Quantity = e.Quantity,
                                                 Category_ID = c.Category_ID,
                                                 Category_Name = c.Category_Name,

                                             }).ToListAsync();

                return eqmcategory;
            }
            catch (Exception ex)
            {
                // เพิ่มข้อความแสดงข้อผิดพลาดจาก exception ที่แท้จริง
                throw new ApplicationException($"An error occurred while retrieving the EquipmentCategory data: {ex.Message}", ex);
            }
        }

        public async Task<eqmDbo> AddEquipmentAsync(eqmDbo eqm)
        {
            try
            {
                _dbContext.EQM.Add(eqm);
                await _dbContext.SaveChangesAsync();
                return eqm;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
