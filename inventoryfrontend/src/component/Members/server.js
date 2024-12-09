const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 2000;

// Set CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// MySQL connection configuration
const dbConfig = {
    host: 'localhost',
    user: 'root', // Adjust with your database user
    password: '1234', // Adjust with your database password
    database: 'Inventory', // Database name
};

// Helper function to connect to the database
async function connectDB() {
    return await mysql.createConnection(dbConfig);
}

// Function to fetch all withdraws with associated usernames
async function getAllWithdraws() {
    const connection = await connectDB();
    try {
        const [withdrawResults] = await connection.execute('SELECT * FROM withdraw');
        if (withdrawResults.length === 0) {
            return [];
        }
        
        const resultsWithUsernames = await Promise.all(withdrawResults.map(async (withdrawItem) => {
            const [userResults] = await connection.execute('SELECT Username FROM user WHERE `Employee ID` = ?', [withdrawItem['Employee ID']]);
            return {
                ...withdrawItem,
                Username: userResults.length > 0 ? userResults[0].Username : 'N/A',
            };
        }));

        return resultsWithUsernames;
    } finally {
        await connection.end();
    }
}

// API to fetch all withdraws with usernames
app.get('/api/withdraw', async (req, res) => {
    try {
        const combinedResults = await getAllWithdraws();
        res.json(combinedResults);
    } catch (error) {
        console.error('Error fetching withdrawal records:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// New API to fetch withdraws by Employee ID
app.get('/api/withdraw/:employeeId', async (req, res) => {
    const employeeId = req.params.employeeId;
    const connection = await connectDB();
    try {
        const [withdrawResults] = await connection.execute('SELECT * FROM withdraw WHERE `Employee ID` = ?', [employeeId]);
        res.json(withdrawResults);
    } catch (error) {
        console.error('Error fetching withdrawal records:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await connection.end();
    }
});

// API to fetch all users
app.get('/api/users', async (req, res) => {
    const connection = await connectDB();
    try {
        const [results] = await connection.query('SELECT * FROM user');
        res.json(results);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await connection.end();
    }
});

// API to fetch user by Employee ID
app.get('/api/users/:employeeId', async (req, res) => {
    const connection = await connectDB();
    const employeeId = req.params.employeeId;

    try {
        const [results] = await connection.query('SELECT * FROM user WHERE `Employee ID` = ?', [employeeId]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(results[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await connection.end();
    }
});

// API to add a user
app.post('/api/users', async (req, res) => {
    const connection = await connectDB();
    const { 'Employee ID': employeeId, Username, Password, Status, Position } = req.body;

    try {
        // Check if data is complete
        if (!employeeId || !Username || !Password || !Position) {
            return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน!' });
        }

        // Check for duplicate "Employee ID" or "Username"
        const [existingUser] = await connection.execute(
            'SELECT * FROM user WHERE `Employee ID` = ? OR Username = ?',
            [employeeId, Username]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Employee ID หรือ Username นี้มีอยู่แล้วในระบบ!' });
        }

        // Insert a new user
        const [result] = await connection.execute(
            'INSERT INTO user (`Employee ID`, Username, Password, Status, Position) VALUES (?, ?, ?, ?, ?)',
            [employeeId, Username, Password, Status, Position]
        );

        const newUser = {
            id: result.insertId,
            'Employee ID': employeeId,
            Username,
            Password,
            Status,
            Position,
        };

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await connection.end();
    }
});

// API to update a user
app.put('/api/users/:employeeId', async (req, res) => {
    const connection = await connectDB();
    const { Username, Password, Status, Position } = req.body;
    const employeeId = req.params.employeeId;

    try {
        if (!Username || !Password || !Position) {
            return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน!' });
        }

        const [result] = await connection.execute(
            'UPDATE user SET Username = ?, Password = ?, Status = ?, Position = ? WHERE `Employee ID` = ?',
            [Username, Password, Status, Position, employeeId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found or no changes made' });
        }

        res.json({
            'Employee ID': employeeId,
            Username,
            Password,
            Status,
            Position,
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await connection.end();
    }
});

// API to fetch products
app.get('/api/products', async (req, res) => {
    const connection = await connectDB();
    try {
        const [results] = await connection.query('SELECT Product_ID, Product_Name, total FROM product');
        res.json(results);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await connection.end();
    }
});

// API to fetch repair records
app.get('/api/repair', async (req, res) => {
    const connection = await connectDB();
    try {
        const [results] = await connection.query('SELECT Repair_ID, `Repair Name`, details, status FROM repair');
        res.json(results);
    } catch (error) {
        console.error('Error fetching repair records:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await connection.end();
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});