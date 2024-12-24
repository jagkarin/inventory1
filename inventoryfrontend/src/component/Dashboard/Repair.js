import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const API_URL = 'http://localhost:2000/api/repair'; // Define the API URL

const Repair = () => {
    const [repairs, setRepairs] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            label: 'จำนวนการซ่อมตามสถานะ',
            data: [],
            backgroundColor: [],
        }],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getRandomColor = () => {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        return `#${randomColor}`;
    };

    const fetchRepairs = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setRepairs(data);
        } catch (error) {
            console.error('Error fetching repair records:', error);
            setError('Error fetching repair records');
        } finally {
            setLoading(false);
        }
    };

    const prepareChartData = () => {
        const statusCounts = repairs.reduce((acc, item) => {
            const status = item.status;
            acc[status] = (acc[status] || 0) + 1; // Count repairs by status
            return acc;
        }, {});

        if (Object.keys(statusCounts).length > 0) {
            const labels = Object.keys(statusCounts);
            const dataValues = Object.values(statusCounts);
            const backgroundColors = labels.map(() => getRandomColor());

            setChartData({
                labels,
                datasets: [{
                    label: 'จำนวนการซ่อมตามสถานะ',
                    data: dataValues,
                    backgroundColor: backgroundColors,
                }],
            });
        }
    };

    useEffect(() => {
        fetchRepairs();
    }, []);

    useEffect(() => {
        if (repairs.length > 0) {
            prepareChartData();
        }
    }, [repairs]);

    if (loading) return <p>กำลังโหลดข้อมูลการซ่อม...</p>;
    if (error) return <p>{error}</p>;

    const groupedRepairs = repairs.reduce((acc, item) => {
        const status = item.status;
        if (!acc[status]) {
            acc[status] = [];
        }
        acc[status].push(item);
        return acc;
    }, {});

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop: '20px' }}>
            <h2>ข้อมูลการซ่อมสินค้า</h2>
            <div style={{ position: 'relative', width: '60%', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Pie data={chartData} options={{ responsive: true }} />
            </div>
            {Object.keys(groupedRepairs).map((status) => (
                <RepairGroup key={status} status={status} repairs={groupedRepairs[status]} />
            ))}
        </div>
    );
};

const RepairGroup = ({ status, repairs }) => (
    <div style={{ marginTop: '20px', width: '80%' }}>
        <h3>สถานะ: {status}</h3>
        <RepairTable repairs={repairs} />
    </div>
);

const RepairTable = ({ repairs }) => (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', textAlign: 'left' }}>
        <thead>
            <tr>
                <th style={{ border: '1px solid #dddddd', padding: '8px' }}>Repair ID</th>
                <th style={{ border: '1px solid #dddddd', padding: '8px' }}>Repair Name</th>
                <th style={{ border: '1px solid #dddddd', padding: '8px' }}>Details</th>
            </tr>
        </thead>
        <tbody>
            {repairs.length > 0 ? (
                repairs.map((item, index) => (
                    <RepairRow key={index} item={item} />
                ))
            ) : (
                <tr>
                    <td colSpan="3" style={{ textAlign: 'center', border: '1px solid #dddddd', padding: '8px' }}>
                        ไม่มีข้อมูล
                    </td>
                </tr>
            )}
        </tbody>
    </table>
);

const RepairRow = ({ item }) => (
    <tr>
        <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{item.Repair_ID || 'N/A'}</td>
        <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{item['Repair Name'] || 'N/A'}</td>
        <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{item.details || 'N/A'}</td>
    </tr>
);

export default Repair;