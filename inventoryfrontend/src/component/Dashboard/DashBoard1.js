import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement, // เพิ่ม DoughnutElement
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// ลงทะเบียนส่วนประกอบของ Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [userCounts, setUserCounts] = useState({
    Admin: 0,
    Manager: 0,
    Supervisor: 0,
    Staff: 0,
    Guest: 0,
  });

  const [products, setProducts] = useState([]);
  const [equipments, setEquipments] = useState([]); // New state for equipment data

  // ดึงข้อมูลจำนวนผู้ใช้
  useEffect(() => {
    fetch('https://localhost:7294/GetAllUserwithrole')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          const counts = {
            Admin: 0,
            Manager: 0,
            Supervisor: 0,
            Staff: 0,
            Guest: 0,
          };

          data.data.forEach((user) => {
            switch (user.roleID) {
              case 1:
                counts.Admin++;
                break;
              case 2:
                counts.Manager++;
                break;
              case 3:
                counts.Supervisor++;
                break;
              case 4:
                counts.Staff++;
                break;
              case 5:
                counts.Guest++;
                break;
              default:
                break;
            }
          });

          setUserCounts(counts);
        } else {
          console.error('Invalid data format: Expected data to be an array', data);
        }
      })
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  // ดึงข้อมูลผลิตภัณฑ์
  useEffect(() => {
    fetch('https://localhost:7294/api/Product/GetAllProductCategory')
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data && Array.isArray(data.data)) {
          setProducts(data.data); // ดึงข้อมูลจาก data.data
        } else {
          console.error('Invalid data format:', data);
        }
      })
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  // ดึงข้อมูลอุปกรณ์
  useEffect(() => {
    fetch('https://localhost:7294/api/Equipment/GetAllEquipmentCategory')
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data && Array.isArray(data.data)) {
          setEquipments(data.data); // ดึงข้อมูลจาก data.data ของอุปกรณ์
        } else {
          console.error('Invalid data format:', data);
        }
      })
      .catch((error) => console.error('Error fetching equipments:', error));
  }, []);

  // สร้างข้อมูลสำหรับกราฟผลิตภัณฑ์
  const categories = [...new Set(products.map((product) => product.categoriesName))]; // ดึงชื่อหมวดหมู่ที่ไม่ซ้ำ
  const quantities = categories.map((category) => {
    return products
      .filter((product) => product.categoriesName === category)
      .reduce((total, product) => total + product.quantity, 0);
  });

  // ข้อมูลสำหรับกราฟผลิตภัณฑ์
  const productData = {
    labels: categories,
    datasets: [
      {
        label: 'Quantity of Products',
        data: quantities,
        backgroundColor: [
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // สร้างข้อมูลสำหรับกราฟอุปกรณ์
  const equipmentCategories = [...new Set(equipments.map((equipment) => equipment.category_Name))]; // ดึงชื่อหมวดหมู่อุปกรณ์ที่ไม่ซ้ำ
  const equipmentQuantities = equipmentCategories.map((category) => {
    return equipments
      .filter((equipment) => equipment.category_Name === category)
      .reduce((total, equipment) => total + equipment.quantity, 0);
  });

  // ข้อมูลสำหรับกราฟอุปกรณ์
  const equipmentData = {
    labels: equipmentCategories,
    datasets: [
      {
        label: 'Quantity of Equipments',
        data: equipmentQuantities,
        backgroundColor: [
          'rgb(87, 16, 253)',
          'rgba(255, 159, 64, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 99, 132, 0.5)',
        ],
        borderColor: [
          'rgb(87, 16, 253)',
          'rgba(255, 159, 64, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // ปิดการล็อคอัตราส่วน
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'ตำแหน่ง',
        font: {
          size: 24,
          weight: 'bold',
        },
      },
    },
  };

  return (
    <Container className="dashboard-container">
    <h1 className="my-4">Expert Dashboard</h1>
    <Row className="d-flex justify-content-center">
        {/* กราฟจำนวนผู้ใช้ */}
        <Col md={12} lg={6} className="d-flex align-items-center justify-content-center mb-4">
          <Card className="w-100" style={{ height: '500px' }}>
            <Card.Body>
              <Bar
                data={{
                  labels: ['Admin', 'Manager', 'Supervisor', 'Staff', 'Guest'],
                  datasets: [
                    {
                      label: 'Admin',
                      data: [userCounts.Admin, 0, 0, 0, 0],
                      backgroundColor: 'rgba(255, 99, 132, 0.5)',
                      borderColor: 'rgba(255, 99, 132, 1)',
                      borderWidth: 3,
                    },
                    {
                      label: 'Manager',
                      data: [0, userCounts.Manager, 0, 0, 0],
                      backgroundColor: 'rgba(54, 162, 235, 0.5)',
                      borderColor: 'rgba(54, 162, 235, 1)',
                      borderWidth: 3,
                    },
                    {
                      label: 'Supervisor',
                      data: [0, 0, userCounts.Supervisor, 0, 0],
                      backgroundColor: 'rgba(255, 206, 86, 0.5)',
                      borderColor: 'rgba(255, 206, 86, 1)',
                      borderWidth: 3,
                    },
                    {
                      label: 'Staff',
                      data: [0, 0, 0, userCounts.Staff, 0],
                      backgroundColor: 'rgba(75, 192, 192, 0.5)',
                      borderColor: 'rgba(75, 192, 192, 1)',
                      borderWidth: 3,
                    },
                    {
                      label: 'Guest',
                      data: [0, 0, 0, 0, userCounts.Guest],
                      backgroundColor: 'rgba(153, 102, 255, 0.5)',
                      borderColor: 'rgba(153, 102, 255, 1)',
                      borderWidth: 3,
                    },
                  ],
                }}
                options={{
                  ...options,
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      ticks: {
                        font: {
                          size: 16,
                        },
                      },
                    },
                    y: {
                      ticks: {
                        font: {
                          size: 16,
                        },
                      },
                    },
                  },
                  elements: {
                    bar: {
                      barThickness: 100, // ปรับให้หนาขึ้น
                      maxBarThickness: 120, // เพิ่มขนาดสูงสุดของแท่ง
                    },
                  },
                  plugins: {
                    ...options.plugins,
                    tooltip: {
                      callbacks: {
                        label: function (tooltipItem) {
                          return tooltipItem.dataset.label + ': ' + tooltipItem.raw;
                        },
                      },
                    },
                  },
                }}
              />
            </Card.Body>
          </Card>
        </Col>

        {/* กราฟจำนวนหมวดหมู่สินค้า */}
        <Col md={12} lg={6} className="d-flex align-items-center justify-content-center mb-4">
          <Card className="w-100" style={{ height: '500px' }}>
            <Card.Body>
              <Doughnut
                data={productData}
                options={{
                  ...options,
                  plugins: {
                    ...options.plugins,
                    title: {
                      display: true,
                      text: 'จำนวนหมวดหมู่สินค้า', // เพิ่มชื่อกราฟ
                    },
                  },
                  cutout: '0%',
                }}
              />
            </Card.Body>
          </Card>
        </Col>

        {/* กราฟจำนวนหมวดหมู่อุปกรณ์ */}
        <Col md={12} lg={6} className="d-flex align-items-center justify-content-center mb-4">
          <Card className="w-100" style={{ height: '500px' }}>
            <Card.Body>
              <Doughnut
                data={equipmentData}
                options={{
                  ...options,
                  plugins: {
                    ...options.plugins,
                    title: {
                      display: true,
                      text: 'จำนวนหมวดหมู่อุปกรณ์', // เพิ่มชื่อกราฟ
                    },
                  },
                  cutout: '0%',
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
