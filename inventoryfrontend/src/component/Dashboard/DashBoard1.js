import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import * as XLSX from 'xlsx';
import "./css/DashBoard1.css";
import 'font-awesome/css/font-awesome.min.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [userCounts, setUserCounts] = useState({
    Admin: 0,
    Staff: 0,
  });

  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showUserList, setShowUserList] = useState(false);

  const [products, setProducts] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userResponse = await fetch('https://localhost:7294/api/User/GetAllUserwithrole');
        const userData = await userResponse.json();
        
        if (Array.isArray(userData.data)) {
          const counts = {
            Admin: 0,
            Staff: 0,
          };
          
          setUsers(userData.data);
          console.log("Users:", userData.data);

          userData.data.forEach((user) => {
            switch (user.roleID) {
              case 1: counts.Admin++; break;
              case 2: counts.Staff++; break;
              default: break;
            }
          });
          
          setUserCounts(counts);
        }
        
        const stockResponse = await fetch('https://localhost:7294/api/Stock/StockImage');
        const stockData = await stockResponse.json();
        
        const fetchedItems = Array.isArray(stockData) ? stockData : (stockData?.data || []);
        const productItems = fetchedItems.filter(item => item.itemType === 1);
        const equipmentItems = fetchedItems.filter(item => item.itemType === 2);

        setProducts(productItems);
        setEquipments(equipmentItems);
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const isLowStock = (quantity) => {
    return quantity < 1;
  };

  const getUsersByRole = (role) => {
    const roleID = {
      Admin: 1,
      Staff: 2,
    }[role];

    return users.filter(user => user.roleID === roleID);
  };

  const handleShowUserList = (role) => {
    setSelectedRole(role);
    setShowUserList(true);
  };

  const handleCloseUserList = () => {
    setShowUserList(false);
    setSelectedRole(null);
  };

  const sortedUserCounts = Object.entries(userCounts)
    .sort(([, a], [, b]) => b - a)
    .reduce((acc, [role, count]) => {
      acc.labels.push(role === 'Staff' ? 'พนักงาน' : role);
      acc.data.push(count);
      return acc;
    }, { labels: [], data: [] });

  const userChartData = {
    labels: sortedUserCounts.labels,
    datasets: [{
      data: sortedUserCounts.data,
      backgroundColor: [
        '#3498db', // Admin
        '#e74c3c', // พนักงาน
      ],
      borderColor: '#FFFFFF',
      borderWidth: 2,
    }],
  };

  const sortedProducts = [...products].sort((a, b) => b.quantity - a.quantity);
  const productNames = sortedProducts.map(product => product.itemName);
  const productQuantities = sortedProducts.map(product => product.quantity);

  const productChartData = {
    labels: productNames,
    datasets: [{
      data: productQuantities,
      backgroundColor: [
        '#3498db',
        '#e74c3c',
        '#f1c40f',
        '#2ecc71',
        '#9b59b6',
        '#00acc1',
        '#8e44ad',
      ],
      borderColor: '#FFFFFF',
      borderWidth: 2,
    }],
  };

  const sortedEquipments = [...equipments].sort((a, b) => b.quantity - a.quantity);
  const equipmentNames = sortedEquipments.map(equipment => equipment.itemName);
  const equipmentQuantities = sortedEquipments.map(equipment => equipment.quantity);

  const equipmentChartData = {
    labels: equipmentNames,
    datasets: [{
      data: equipmentQuantities,
      backgroundColor: [
        '#3498db',
        '#e74c3c',
        '#f1c40f',
        '#2ecc71',
        '#9b59b6',
        '#00acc1',
        '#8e44ad',
      ],
      borderColor: '#FFFFFF',
      borderWidth: 2,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 25,
          boxWidth: 14,
          font: {
            size: 14,
            family: 'Poppins',
            weight: '500',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(44, 62, 80, 0.9)',
        titleFont: { size: 14, family: 'Poppins' },
        bodyFont: { size: 12, family: 'Poppins' },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${formatNumber(value)} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '65%',
  };

  const exportToExcel = (data, fileName) => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ข้อมูล');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const handleExportUsers = () => {
    const userData = Object.entries(userCounts).map(([role, count]) => ({
      ประเภท: role === 'Staff' ? 'พนักงาน' : role,
      จำนวน: count
    }));
    exportToExcel(userData, 'ผู้ใช้งาน');
  };

  const handleExportProducts = () => {
    const productData = sortedProducts.map(product => ({
      ชื่อ: product.itemName,
      จำนวน: product.quantity,
      สินค้าคงคลังต่ำ: product.quantity < 1 ? 'ใช่' : 'ไม่'
    }));
    exportToExcel(productData, 'สินค้า');
  };

  const handleExportEquipments = () => {
    const equipmentData = sortedEquipments.map(equipment => ({
      ชื่อ: equipment.itemName,
      จำนวน: equipment.quantity,
      สินค้าคงคลังต่ำ: equipment.quantity < 1 ? 'ใช่' : 'ไม่'
    }));
    exportToExcel(equipmentData, 'อุปกรณ์');
  };

  const renderTotalCount = (items, label) => {
    let total = 0;
    if (Array.isArray(items)) {
      total = items.reduce((sum, item) => sum + item, 0);
    } else if (typeof items === 'object') {
      total = Object.values(items).reduce((sum, value) => sum + value, 0);
    }
    return (
      <div className="db1-total-count">
        <span className="db1-count-value">{formatNumber(total)}</span>
        <span className="db1-count-label">{label}</span>
      </div>
    );
  };

  const renderLowStockAlert = (items) => {
    if (!Array.isArray(items)) return null;
    
    const lowStockCount = items.filter(item => item < 1).length;
    if (lowStockCount === 0) return null;
    
    return (
      <div className="db1-low-stock-alert">
        <i className="fas fa-exclamation-triangle me-2"></i>
        <span>{lowStockCount} รายการมีจำนวนน้อยกว่า 1 ชิ้น</span>
      </div>
    );
  };

  if (loading) {
    return (
      <Container className="db1-dashboard-container">
        <div className="db1-loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">กำลังโหลด...</span>
          </div>
          <p>กำลังโหลดข้อมูล...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="db1-dashboard-container">
      <div className="db1-dashboard-header">
        <h1>แดชบอร์ด</h1>
      </div>
      
      <Row className="db1-summary-cards">
        <Col md={4} className="mb-4">
          <Card className="db1-summary-card">
            <Card.Body>
              <div className="db1-summary-icon db1-user-icon">
                <i className="fas fa-users"></i>
              </div>
              {renderTotalCount(userCounts, "คน")}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="db1-summary-card">
            <Card.Body>
              <div className="db1-summary-icon db1-product-icon">
                <i className="fas fa-box"></i>
              </div>
              {renderTotalCount(productQuantities, "ชิ้น")}
              {renderLowStockAlert(productQuantities)}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="db1-summary-card">
            <Card.Body>
              <div className="db1-summary-icon db1-equipment-icon">
                <i className="fas fa-tools"></i>
              </div>
              {renderTotalCount(equipmentQuantities, "ชิ้น")}
              {renderLowStockAlert(equipmentQuantities)}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="db1-chart-row">
        <Col lg={4} md={6} className="db1-chart-col">
          <Card className="db1-chart-card">
            <Card.Header>
              <h5>จำนวนผู้ใช้งานในระบบ</h5>
              <Button onClick={handleExportUsers}>
                <i className="fas fa-file-excel me-1"></i> ส่งออก
              </Button>
            </Card.Header>
            <Card.Body>
              <div className="db1-chart-container">
                <Doughnut data={userChartData} options={chartOptions} />
              </div>
              <div className="db1-chart-details">
                {sortedUserCounts.labels.map((role, index) => (
                  <div
                    key={role}
                    className="db1-detail-item"
                    onClick={() => handleShowUserList(role === 'พนักงาน' ? 'Staff' : role)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="db1-detail-label">{role}</span>
                    <span className="db1-detail-value">{formatNumber(sortedUserCounts.data[index])}</span>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4} md={6} className="db1-chart-col">
          <Card className="db1-chart-card">
            <Card.Header>
              <h5>จำนวนสินค้าทั้งหมด</h5>
              <Button onClick={handleExportProducts}>
                <i className="fas fa-file-excel me-1"></i> ส่งออก
              </Button>
            </Card.Header>
            <Card.Body>
              <div className="db1-chart-container">
                <Doughnut data={productChartData} options={chartOptions} />
              </div>
              <div className="db1-chart-details db1-chart-details-scrollable">
                {productNames.map((name, index) => (
                  <div key={`${name}-${index}`} className="db1-detail-item">
                    <span className="db1-detail-label">{name}</span>
                    <span className={`db1-detail-value ${isLowStock(productQuantities[index]) ? 'db1-low-stock' : ''}`}>
                      {formatNumber(productQuantities[index])}
                      {isLowStock(productQuantities[index]) && 
                        <i className="fas fa-exclamation-circle ms-2 db1-low-stock-icon"></i>
                      }
                    </span>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4} md={6} className="db1-chart-col">
          <Card className="db1-chart-card">
            <Card.Header>
              <h5>จำนวนอุปกรณ์ทั้งหมด</h5>
              <Button onClick={handleExportEquipments}>
                <i className="fas fa-file-excel me-1"></i> ส่งออก
              </Button>
            </Card.Header>
            <Card.Body>
              <div className="db1-chart-container">
                <Doughnut data={equipmentChartData} options={chartOptions} />
              </div>
              <div className="db1-chart-details db1-chart-details-scrollable">
                {equipmentNames.map((name, index) => (
                  <div key={`${name}-${index}`} className="db1-detail-item">
                    <span className="db1-detail-label">{name}</span>
                    <span className={`db1-detail-value ${isLowStock(equipmentQuantities[index]) ? 'db1-low-stock' : ''}`}>
                      {formatNumber(equipmentQuantities[index])}
                      {isLowStock(equipmentQuantities[index]) && 
                        <i className="fas fa-exclamation-circle ms-2 db1-low-stock-icon"></i>
                      }
                    </span>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showUserList} onHide={handleCloseUserList}>
        <Modal.Header closeButton>
          <Modal.Title>รายชื่อผู้ใช้ในบทบาท {selectedRole === 'Staff' ? 'พนักงาน' : selectedRole}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRole && getUsersByRole(selectedRole).length > 0 ? (
            <div>
              {getUsersByRole(selectedRole).map((user, index) => (
                <div key={index} style={{ marginBottom: '8px' }}>
                  {user.firstname} {user.lastname}
                </div>
              ))}
            </div>
          ) : (
            <p>ไม่มีผู้ใช้ในบทบาทนี้</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUserList}>
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Dashboard;