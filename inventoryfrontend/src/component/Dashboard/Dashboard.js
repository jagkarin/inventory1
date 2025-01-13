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
import * as XLSX from 'xlsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBoxes, faHandHoldingUsd, faWrench, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import Product from './Product';
import BorrowedItems from './BorrowedItems';
import Repair from './Repair';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_URL = 'http://localhost:2000/api';

function WarehouseDashboard() {
  const [users, setUsers] = useState([]); // ตั้งค่าเริ่มต้นเป็น array ว่าง
  const [borrowedItems, setBorrowedItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [positionCounts, setPositionCounts] = useState({});
  const [activeTab, setActiveTab] = useState('users');

  const fetchData = async (endpoint, setter) => {
    try {
      const response = await fetch(`${API_URL}/${endpoint}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setter(data);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
    }
  };

  useEffect(() => {
    fetchData('users', setUsers);
    fetchData('withdraw', setBorrowedItems);
    fetchData('products', setProducts);
    fetchData('repair', setRepairs);
  }, []);

  useEffect(() => {
    const counts = {};
    users.forEach((user) => {
      counts[user.Position] = (counts[user.Position] || 0) + 1;
    });
    setPositionCounts(counts);
    setChartData({
      labels: Object.keys(counts),
      datasets: [
        {
          label: 'Users by Position',
          data: Object.values(counts),
          backgroundColor: ['#007bff', '#28a745', '#dc3545', '#ffc107'],
        },
      ],
    });
  }, [users]);

  const exportToExcel = () => {
    const userSheet = XLSX.utils.json_to_sheet(users);
    const borrowedSheet = XLSX.utils.json_to_sheet(borrowedItems);
    const productSheet = XLSX.utils.json_to_sheet(products);
    const repairSheet = XLSX.utils.json_to_sheet(repairs);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, userSheet, 'Users');
    XLSX.utils.book_append_sheet(wb, borrowedSheet, 'Borrowed Items');
    XLSX.utils.book_append_sheet(wb, productSheet, 'Products');
    XLSX.utils.book_append_sheet(wb, repairSheet, 'Repairs');
    XLSX.writeFile(wb, 'WarehouseData.xlsx');
  };

  return (
    <div className="content-wrapper p-3">
      <div className="container-fluid">
        <h1 className="mb-4">Warehouse Dashboard</h1>
        <div className="btn-group mb-4">
          <button className={`btn btn-primary ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            <FontAwesomeIcon icon={faUsers} className="me-2" />
            Users
          </button>
          <button className={`btn btn-primary ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
            <FontAwesomeIcon icon={faBoxes} className="me-2" />
            Products
          </button>
          <button className={`btn btn-primary ${activeTab === 'borrowedItems' ? 'active' : ''}`} onClick={() => setActiveTab('borrowedItems')}>
            <FontAwesomeIcon icon={faHandHoldingUsd} className="me-2" />
            Borrowed Items
          </button>
          <button className={`btn btn-primary ${activeTab === 'repair' ? 'active' : ''}`} onClick={() => setActiveTab('repair')}>
            <FontAwesomeIcon icon={faWrench} className="me-2" />
            Repairs
          </button>
          <button className="btn btn-success" onClick={exportToExcel}>
            <FontAwesomeIcon icon={faFileExcel} className="me-2" />
            Export to Excel
          </button>
        </div>

        {activeTab === 'users' && (
          <div className="card">
            <div className="card-body">
              <Bar data={chartData} options={{ responsive: true }} />
            </div>
          </div>
        )}
        {activeTab === 'products' && <Product />}
        {activeTab === 'borrowedItems' && <BorrowedItems />}
        {activeTab === 'repair' && <Repair />}
      </div>
    </div>
  );
}

export default WarehouseDashboard;
