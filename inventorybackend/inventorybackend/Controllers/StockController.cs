using inventorybackend.DTOS;
using inventorybackend.src.Core.Interface;
using inventorybackend.src.Core.Service;
using inventorybackend.src.Entities;
using Microsoft.AspNetCore.Mvc;

namespace inventorybackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StockController : Controller
    {
        private readonly IStockService _stock;
        private readonly ILogger<StockController> _logger;

        public StockController(IStockService stock, ILogger<StockController> logger)
        {
            _stock = stock;
            _logger = logger;
        }

        [HttpGet("StockImage")]
        public async Task<IActionResult> GetALLStockImageAsync()
        {
            var response = new BaseHttpResponse<List<StockJoinItemmaster>>();

            try
            {
                var data = await _stock.GetALLStockImageAsync();
                response.SetSuccess(data, "Success", "200");
                return Ok(response);
            }
            catch (Exception ex)
            {
                var err = new ErrorData
                {
                    Code = "-2",
                    Message = ex.Message
                };
                _logger.LogError(ex, "Error getting all Stock");
                return BadRequest(err);
            }
        }

        // GET: api/stock
        [HttpGet]
        public async Task<ActionResult<List<StockDbo>>> GetAllStocks()
        {
            var stocks = await _stock.GetAllStocksAsync();
            return Ok(stocks);
        }

        // GET: api/stock/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<StockDbo>> GetStockById(int id)
        {
            var stock = await _stock.GetStockByIdAsync(id);
            if (stock == null)
            {
                return NotFound();
            }
            return Ok(stock);
        }

        // POST: api/stock
        [HttpPost]
        public async Task<ActionResult<StockDbo>> CreateStock([FromBody] StockCreateDto stockDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdStock = await _stock.CreateStockAsync(stockDto);
            return CreatedAtAction(nameof(GetStockById), new { id = createdStock.StockID }, createdStock);
        }

        // PUT: api/stock/{id}
        [HttpPut]
        public async Task<ActionResult<StockDbo>> UpdateStock(int stockId, [FromBody] StockUpdateDto stockDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updatedStock = await _stock.UpdateStockAsync(stockId, stockDto);
                return Ok(updatedStock);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
