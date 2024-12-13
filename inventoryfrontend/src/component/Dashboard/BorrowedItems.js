import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BorrowedItems = () => {
    const [borrowedItems, setBorrowedItems] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'จำนวนที่เบิก',
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1,
            },
        ],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getRandomColor = () => {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        return `#${randomColor}`;
    };

    const fetchBorrowedItems = async (employeeId) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:2000/api/withdraw?employeeId=${employeeId}`);
            setBorrowedItems(response.data);
        } catch (error) {
            console.error('Error fetching borrowed items:', error);
            setError('Error fetching borrowed items');
        } finally {
            setLoading(false);
        }
    };

    const prepareChartData = () => {
        const chartData = borrowedItems.reduce((acc, item) => {
            const existingItem = acc.find(d => d.things === item.things);
            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                acc.push({
                    things: item.things,
                    quantity: item.quantity,
                });
            }
            return acc;
        }, []);

        if (chartData.length > 0) {
            const labels = chartData.map(item => item.things);
            const dataValues = chartData.map(item => item.quantity);
            const backgroundColors = chartData.map(() => getRandomColor());
            const borderColors = chartData.map(() => getRandomColor());

            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: 'จำนวนที่เบิก',
                        data: dataValues,
                        backgroundColor: backgroundColors,
                        borderColor: borderColors,
                        borderWidth: 1,
                    },
                ],
            });
        }
    };

    useEffect(() => {
        // Change employeeId as necessary
        const employeeId = 1; // Example employeeId
        fetchBorrowedItems(employeeId);
    }, []);

    useEffect(() => {
        if (borrowedItems.length > 0) {
            prepareChartData();
        }
    }, [borrowedItems]);

    if (loading) return <p>กำลังโหลดข้อมูลรายการเบิก...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={{ width: '60%', margin: '20px auto' }}>
            <h2>ข้อมูลการเบิกสินค้า</h2>
            <Bar data={chartData} options={{ responsive: true }} />
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr>

                        <th style={{ border: '1px solid #dddddd', padding: '8px' }}>Username</th>
                        <th style={{ border: '1px solid #dddddd', padding: '8px' }}>Things</th>
                        <th style={{ border: '1px solid #dddddd', padding: '8px' }}>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {borrowedItems.map((item, index) => (
                        <tr key={index}>

                            <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{item.Username || 'N/A'}</td>
                            <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{item.things || 'N/A'}</td>
                            <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{item.quantity || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BorrowedItems;