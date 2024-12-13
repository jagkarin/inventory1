import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBoxes, faHandHoldingUsd, faWrench, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import Product from './Product';
import BorrowedItems from './BorrowedItems';
import Repair from './Repair';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function WarehouseDashboard() {
    const [users, setUsers] = useState([]);
    const [borrowedItems, setBorrowedItems] = useState([]); 
    const [products, setProducts] = useState([]);
    const [repairs, setRepairs] = useState([]); // State for repairs
    const [chartData, setChartData] = useState({});
    const [positionCounts, setPositionCounts] = useState({});
    const [showData, setShowData] = useState(false);
    const [showProducts, setShowProducts] = useState(false);
    const [showBorrowedItems, setShowBorrowedItems] = useState(false);
    const [showRepairData, setShowRepairData] = useState(false);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:2000/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchBorrowedItems = async () => {
        try {
            const response = await axios.get('http://localhost:2000/api/withdraw');
            setBorrowedItems(response.data);
        } catch (error) {
            console.error('Error fetching borrowed items:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:2000/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchRepairs = async () => {
        try {
            const response = await axios.get('http://localhost:2000/api/repair');
            setRepairs(response.data);
        } catch (error) {
            console.error('Error fetching repairs:', error);
        }
    };

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const prepareChartData = (users) => {
        const positionCounts = {};
        users.forEach(user => {
            positionCounts[user.Position] = (positionCounts[user.Position] || 0) + 1;
        });
        const labels = Object.keys(positionCounts);
        const dataValues = Object.values(positionCounts);
        const backgroundColors = labels.map(() => getRandomColor());

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: 'Number of Users by Position',
                    data: dataValues,
                    backgroundColor: backgroundColors,
                    borderColor: 'rgba(0, 0, 0, 1)',
                    borderWidth: 1,
                },
            ],
        });

        return positionCounts;
    };

    const exportToExcel = () => {
        const userSheet = XLSX.utils.json_to_sheet(users);
        const borrowedSheet = XLSX.utils.json_to_sheet(borrowedItems);
        const productSheet = XLSX.utils.json_to_sheet(products);
        const repairSheet = XLSX.utils.json_to_sheet(repairs); // เพิ่มหน้ารายการการซ่อม

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, userSheet, 'Users');
        XLSX.utils.book_append_sheet(wb, borrowedSheet, 'Borrowed Items');
        XLSX.utils.book_append_sheet(wb, productSheet, 'Products');
        XLSX.utils.book_append_sheet(wb, repairSheet, 'Repairs'); // เพิ่ม Repair Data

        XLSX.writeFile(wb, 'WarehouseData.xlsx');
    };

    useEffect(() => {
        fetchUsers();
        fetchBorrowedItems();
        fetchProducts();
        fetchRepairs(); // ดึงข้อมูลการซ่อมเมื่อ component mount
    }, []);

    useEffect(() => {
        const counts = prepareChartData(users);
        setPositionCounts(counts);
    }, [users]);

    const sortedUsers = [...users].sort((a, b) => a.Username.localeCompare(b.Username));

    const statusOrder = {
        'Active': 1,
        'Inactive': 2,
        'Pending': 3,
    };

    const sortedByStatus = [...sortedUsers].sort((a, b) => {
        return (statusOrder[a.Status] || Infinity) - (statusOrder[b.Status] || Infinity);
    });

    const toggleShow = (dataType) => {
        if (dataType === 'data') {
            setShowData(prev => !prev);
            setShowProducts(false);
            setShowBorrowedItems(false);
            setShowRepairData(false);
        } else if (dataType === 'products') {
            setShowData(false);
            setShowProducts(prev => !prev);
            setShowBorrowedItems(false);
            setShowRepairData(false);
        } else if (dataType === 'borrowedItems') {
            setShowData(false);
            setShowProducts(false);
            setShowBorrowedItems(prev => !prev);
            setShowRepairData(false);
        } else if (dataType === 'repairData') {
            setShowData(false);
            setShowProducts(false);
            setShowBorrowedItems(false);
            setShowRepairData(prev => !prev);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Warehouse Dashboard</h1>
            <div style={{ margin: '20px 0', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <button onClick={() => toggleShow('data')}>
                    <FontAwesomeIcon icon={faUsers} />
                    {showData ? 'ซ่อนข้อมูลผู้ใช้' : 'แสดงข้อมูลผู้ใช้'}
                </button>
                <button onClick={() => toggleShow('products')}>
                    <FontAwesomeIcon icon={faBoxes} />
                    {showProducts ? 'ซ่อนข้อมูลสินค้าและอุปกรณ์' : 'แสดงข้อมูลสินค้าและอุปกรณ์'}
                </button>
                <button onClick={() => toggleShow('borrowedItems')}>
                    <FontAwesomeIcon icon={faHandHoldingUsd} />
                    {showBorrowedItems ? 'ซ่อนข้อมูลการเบิกสินค้า' : 'แสดงข้อมูลการเบิกสินค้า'}
                </button>
                <button onClick={() => toggleShow('repairData')}>
                    <FontAwesomeIcon icon={faWrench} />
                    {showRepairData ? 'ซ่อนข้อมูลการซ่อม' : 'แสดงข้อมูลการซ่อม'}
                </button>
                <button onClick={exportToExcel}>
                    <FontAwesomeIcon icon={faFileExcel} />
                    ส่งออกเป็น Excel
                </button>
            </div>

            {showData && (
                <div style={{ width: '60%', margin: '20px auto' }}>
                    <h2>User List by Position</h2>
                    {chartData.labels && chartData.labels.length > 0 ? (
                        <Bar data={chartData} options={{ responsive: true }} />
                    ) : (
                        <p>Loading data...</p>
                    )}
                    <div style={{ marginTop: '20px' }}>
                        <h3>User Counts by Position</h3>
                        <ul>
                            {Object.entries(positionCounts).map(([position, count]) => (
                                <li key={position}>{position}: {count}</li>
                            ))}
                        </ul>
                    </div>
                    <h2>User List</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Position</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedByStatus.map(user => (
                                <tr key={user.id}>
                                    <td>{user.Username}</td>
                                    <td>{user.Position}</td>
                                    <td>{user.Status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showProducts && <Product />} {/* Show product data */}
            {showBorrowedItems && <BorrowedItems />} {/* Show borrowed items */}
            {showRepairData && <Repair />} {/* Call Repair component to show repair data */}
        </div>
    );
}

export default WarehouseDashboard;