using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;
using MySqlConnector;

namespace inventorybackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]


    public class ServerController : ControllerBase
    {
        private readonly ILogger<ServerController> _logger;
        private readonly string _connectionString = "Server=localhost;Database=Inventory;User ID=root;Password=1234;";

        public ServerController(ILogger<ServerController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllWithdraws()
        {
            try
            {
                using var connection = new MySqlConnection(_connectionString);
                await connection.OpenAsync();
                var query = "SELECT * FROM withdraw";
                using var command = new MySqlCommand(query, connection);
                using var reader = await command.ExecuteReaderAsync();
                List<WithdrawItem> results = new List<WithdrawItem>();
                while (await reader.ReadAsync())
                {
                    results.Add(new WithdrawItem
                    {
                        Withdraw_ID = reader.GetInt32("Withdraw_ID"),
                        Employee_ID = reader.GetInt32("Employee_ID"),
                        Withdraw_Date = reader.GetString("Withdraw_Date")
                    });
                }
                if (results.Count == 0)
                {
                    return NotFound();
                }

                var resultsWithUsernames = await Task.WhenAll(results.Select(async withdrawItem =>
                {
                    var queryUser = "SELECT Username FROM user WHERE `Employee ID` = @EmployeeID";
                    using var commandUser = new MySqlCommand(queryUser, connection);
                    commandUser.Parameters.AddWithValue("@EmployeeID", withdrawItem.Employee_ID);
                    using var readerUser = await commandUser.ExecuteReaderAsync();
                    if (await readerUser.ReadAsync())
                    {
                        return new { withdrawItem, Username = readerUser.GetString("Username") };
                    }
                    else
                    {
                        return new { withdrawItem, Username = "N/A" };
                    }
                }));

                return Ok(resultsWithUsernames);
            }
            catch (Exception error)
            {
                _logger.LogError("Error fetching withdrawal records: ", error);
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpGet("{employeeId}")]
        public async Task<IActionResult> GetWithdrawsByEmployeeId([FromRoute] int employeeId)
        {
            try
            {
                using var connection = new MySqlConnection(_connectionString);
                await connection.OpenAsync();
                var query = "SELECT * FROM withdraw WHERE `Employee ID` = @EmployeeID";
                using var command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@EmployeeID", employeeId);
                using var reader = await command.ExecuteReaderAsync();
                List<WithdrawItem> results = new List<WithdrawItem>();
                while (await reader.ReadAsync())
                {
                    results.Add(new WithdrawItem
                    {
                        Withdraw_ID = reader.GetInt32("Withdraw_ID"),
                        Employee_ID = reader.GetInt32("Employee_ID"),
                        Withdraw_Date = reader.GetString("Withdraw_Date")
                    });
                }
                return Ok(results);
            }
            catch (Exception error)
            {
                _logger.LogError("Error fetching withdrawal records: ", error);
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                using var connection = new MySqlConnection(_connectionString);
                await connection.OpenAsync();
                var query = "SELECT * FROM user";
                using var command = new MySqlCommand(query, connection);
                using var reader = await command.ExecuteReaderAsync();
                List<User> results = new List<User>();
                while (await reader.ReadAsync())
                {
                    results.Add(new User
                    {
                        EmployeeID = reader.GetInt32("Employee ID"),
                        Username = reader.GetString("Username"),
                        Password = reader.GetString("Password"),
                        Status = reader.GetString("Status"),
                        Position = reader.GetString("Position")
                    });
                }
                return Ok(results);
            }
            catch (Exception error)
            {
                _logger.LogError("Error fetching users: ", error);
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpGet("users/{employeeId}")]
        public async Task<IActionResult> GetUserByEmployeeId([FromRoute] int employeeId)
        {
            try
            {
                using var connection = new MySqlConnection(_connectionString);
                await connection.OpenAsync();
                var query = "SELECT * FROM user WHERE `Employee ID` = @EmployeeID";
                using var command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@EmployeeID", employeeId);
                using var reader = await command.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    return Ok(new User
                    {
                        EmployeeID = reader.GetInt32("Employee ID"),
                        Username = reader.GetString("Username"),
                        Password = reader.GetString("Password"),
                        Status = reader.GetString("Status"),
                        Position = reader.GetString("Position")
                    });
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception error)
            {
                _logger.LogError("Error fetching user: ", error);
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("users")]
        public async Task<IActionResult> AddUser([FromBody] User user)
        {
            try
            {
                using var connection = new MySqlConnection(_connectionString);
                await connection.OpenAsync();
                var query = "INSERT INTO user (`Employee ID`, Username, Password, Status, Position) VALUES (@EmployeeID, @Username, @Password, @Status, @Position)";
                using var command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@EmployeeID", user.EmployeeID);
                command.Parameters.AddWithValue("@Username", user.Username);
                command.Parameters.AddWithValue("@Password", user.Password);
                command.Parameters.AddWithValue("@Status", user.Status);
                command.Parameters.AddWithValue("@Position", user.Position);
                await command.ExecuteNonQueryAsync();

                return CreatedAtAction(nameof(GetUserByEmployeeId), new { employeeId = user.EmployeeID }, user);
            }
            catch (Exception error)
            {
                _logger.LogError("Error adding user: ", error);
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPut("users/{employeeId}")]
        public async Task<IActionResult> UpdateUser([FromRoute] int employeeId, [FromBody] User user)
        {
            try
            {
                using var connection = new MySqlConnection(_connectionString);
                await connection.OpenAsync();
                var queryUpdateUser = "UPDATE user SET Username=@Username, Password=@Password, Status=@Status, Position=@Position WHERE `Employee ID`=@EmployeeID";
                using var commandUpdateUser = new MySqlCommand(queryUpdateUser, connection);
                commandUpdateUser.Parameters.AddWithValue("@EmployeeID", employeeId);
                commandUpdateUser.Parameters.AddWithValue("@Username", user.Username);
                commandUpdateUser.Parameters.AddWithValue("@Password", user.Password);
                commandUpdateUser.Parameters.AddWithValue("@Status", user.Status);
                commandUpdateUser.Parameters.AddWithValue("@Position", user.Position);

                await commandUpdateUser.ExecuteNonQueryAsync();

                return Ok(user);

            }
            catch (Exception error)
            {
                _logger.LogError("Error updating user: ", error);
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpGet("products")]
        public async Task<IActionResult> GetAllProducts()
        {
            try
            {
                using var connection = new MySqlConnection(_connectionString);
                await connection.OpenAsync();
                var query = "SELECT Product_ID, Product_Name, total FROM product";
                using var command = new MySqlCommand(query, connection);

                using var reader = await command.ExecuteReaderAsync();
                List<Product> results = new List<Product>();
                while (await reader.ReadAsync())
                {
                    results.Add(new Product
                    {
                        Product_ID = reader.GetInt32("Product_ID"),
                        Product_Name = reader.GetString("Product_Name"),
                        total = reader.GetDecimal("total")
                    });
                }
                return Ok(results);

            }
            catch (Exception error)
            {
                _logger.LogError("Error fetching products: ", error);
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpGet("repair")]
        public async Task<IActionResult> GetAllRepairRecords()
        {
            try
            {
                using var connection = new MySqlConnection(_connectionString);
                await connection.OpenAsync();
                var query = "SELECT Repair_ID, `Repair Name`, details, status FROM repair";
                using var command = new MySqlCommand(query, connection);

                using var reader = await command.ExecuteReaderAsync();
                List<Repair> results = new List<Repair>();
                while (await reader.ReadAsync())
                {
                    results.Add(new Repair
                    {
                        Repair_ID = reader.GetInt32("Repair_ID"),
                        Repair_Name = reader.GetString("Repair Name"),
                        details = reader.GetString("details"),
                        status = reader.GetString("status")
                    });
                }
                return Ok(results);

            }
            catch (Exception error)
            {
                _logger.LogError("Error fetching repair records: ", error);
                return StatusCode(500, "Internal Server Error");
            }
        }
    }

    public class WithdrawItem
    {
        public int Withdraw_ID { get; set; }
        public int? Employee_ID { get; set; }
        public string Withdraw_Date { get; set; }
    }

    public class User
    {
        public int EmployeeID { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Status { get; set; }
        public string Position { get; set; }
    }

    public class Product
    {
        public int Product_ID { get; set; }
        public string Product_Name { get; set; }
        public decimal total { get; set; }
    }

    public class Repair
    {
        public int Repair_ID { get; set; }
        public string Repair_Name { get; set; }
        public string details { get; set; }
        public string status { get; set; }
    }
}