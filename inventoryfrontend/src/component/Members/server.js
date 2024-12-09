const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 2000;

// ตั้งค่า CORS และ JSON body parsing
app.use(cors());
app.use(express.json());

// เชื่อมต่อกับ MySQL
const dbConfig = {
    host: 'localhost',
    user: 'root', // ปรับข้อมูลการเชื่อมต่อของคุณ
    password: '1234', // ปรับข้อมูลการเชื่อมต่อของคุณ
    database: 'Inventory', // ชื่อฐานข้อมูล
};

// ฟังก์ชันช่วยเชื่อมต่อกับฐานข้อมูล
async function connectDB() {
    return await mysql.createConnection(dbConfig);
}

// ฟังก์ชันเพื่อดึงข้อมูล withdraw ทั้งหมด พร้อมกับ Username
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

// API สำหรับดึงข้อมูล withdraw ทั้งหมด พร้อมกับ Username
app.get('/api/withdraw', async (req, res) => {
    try {
        const combinedResults = await getAllWithdraws();
        res.json(combinedResults);
    } catch (error) {
        console.error('Error fetching withdrawal records:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// API สำหรับดึงข้อมูลผู้ใช้ทั้งหมด
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

// API สำหรับดึงข้อมูลผู้ใช้ตาม Employee ID
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

// API สำหรับเพิ่มผู้ใช้
app.post('/api/users', async (req, res) => {
    const connection = await connectDB();
    const { 'Employee ID': employeeId, Username, Password, Status, Position } = req.body;

    try {
        if (!employeeId || !Username || !Password || !Position) {
            return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน!' });
        }

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

// API สำหรับแก้ไขข้อมูลผู้ใช้
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

// API สำหรับดึงข้อมูล product
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

// API สำหรับดึงข้อมูล repair
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

// เริ่มต้นเซิร์ฟเวอร์
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});