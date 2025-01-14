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
                                                 EQMimage = e.EQMimage,

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

        public async Task<bool> DeleteEQMAsync(int EQMID)
        {
            var eqm = await _dbContext.EQM.FindAsync(EQMID);
            if (eqm != null)
            {
                _dbContext.EQM.Remove(eqm);
                await _dbContext.SaveChangesAsync();
                return true; // คืนค่า true ถ้าลบสำเร็จ
            }
            return false; // คืนค่า false ถ้าไม่เจอข้อมูล
        }

        public async Task<eqmDbo> UpdateEQMAsync(eqmDbo eqm)
        {
            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                // Log before finding the user
                _logger.LogInformation("Attempting to update Product with ID: {EQMID}", eqm.EQMID);

                var existingeqm = await _dbContext.EQM.FindAsync(eqm.EQMID);
                if (existingeqm == null)
                {
                    _logger.LogError("Equipment with ID {EQMID} not found", eqm.EQMID);
                    throw new Exception($"Equipment with ID {eqm.EQMID} not found");
                }

                _logger.LogInformation("Found Equipment with ID : {EQMID}.", eqm.EQMID);
                existingeqm.EQMID = eqm.EQMID;
                existingeqm.EQMimage = eqm.EQMimage;
                existingeqm.EQMName = eqm.EQMName;
                existingeqm.EQMDescription = eqm.EQMDescription;
                existingeqm.Quantity = eqm.Quantity;
                existingeqm.Category_ID = eqm.Category_ID;
                existingeqm.Adddate = DateTime.Now;


                _dbContext.EQM.Update(existingeqm);


                await _dbContext.SaveChangesAsync();

                await transaction.CommitAsync();
                _logger.LogInformation("Successfully updated Equipment with ID: {EQMID}", eqm.EQMName);

                return existingeqm;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error occurred while updating Equipment with ID : {EQMID}. Inner exception: {InnerException}", eqm.EQMID, ex.InnerException?.Message);
                throw new Exception($"Error occurred while updating Equipment with ID {eqm.EQMID}", ex);
            }
        }



        public async Task UpdateeqmwithimageAsync(eqmDbo eqm)
        {
            var existingeqm = await _dbContext.EQM.FirstOrDefaultAsync(p => p.EQMID == eqm.EQMID);

            if (existingeqm != null)
            {
                // อัปเดตเฉพาะฟิลด์ที่ต้องการ
                existingeqm.EQMName = eqm.EQMName;
                existingeqm.EQMDescription = eqm.EQMDescription;
                existingeqm.Quantity = eqm.Quantity;
                existingeqm.Category_ID = eqm.Category_ID;
                existingeqm.EQMimage = eqm.EQMimage;

                _dbContext.EQM.Update(existingeqm);
                await _dbContext.SaveChangesAsync();
            }
            else
            {
                throw new Exception($"Equipment with ID {eqm.EQMID} not found.");
            }
        }


    }

    
}
