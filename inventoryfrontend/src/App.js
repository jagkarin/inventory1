<<<<<<< HEAD
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUsers, faBox, faPaperPlane, faListAlt, faUser, faBars } from '@fortawesome/free-solid-svg-icons';  
=======
import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
>>>>>>> adb0757d73a6c63f2831392dcbce1e08afbbebaf
import MembersComponent from './component/Members/Members';
import Dashboard from './component/Dashboard/Dashboard';
import Inventory from './component/InventoryPage/Inventory';
import RequestPage from './component/RequestP/Request';
import ProductList from './component/InventoryPage/ProductList';
import Login from './component/Login/Login';
import Register from './component/Login/Register';
import ForgotPassword from './component/Login/ForgotPassword';
import Profile from './component/Login/Profile';
<<<<<<< HEAD

function Layout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="layout">
      {/* Hamburger Menu */}
      {!isSidebarOpen && (  // เพิ่มเงื่อนไขให้ปุ่ม hamburger แสดงเฉพาะเมื่อ Sidebar ปิด
        <button
          className="btn btn-primary hamburger-menu"
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            top: 20,
            left: 20,
            zIndex: 1000,
            fontSize: '1.5rem',
            padding: '10px',
          }}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      )}

      {/* Sidebar */}
      <nav className={`sidebar bg-dark ${isSidebarOpen ? 'open' : ''}`}>
        <ul className="nav flex-column text-white">
          <li className="nav-item">
            <a className="nav-link text-white" href="/dashboard">
              <FontAwesomeIcon icon={faTachometerAlt} className="me-2" />
              Dashboard
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="/members">
              <FontAwesomeIcon icon={faUsers} className="me-2" />
              Members
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="/requestpage">
              <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
              Request Page
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="/ProductList">
              <FontAwesomeIcon icon={faListAlt} className="me-2" />
              Product List
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="/Inventory">
              <FontAwesomeIcon icon={faBox} className="me-2" />
              Inventory
            </a>
          </li>
        </ul>
      </nav>

      {/* Profile Link at Top Right */}
      <div className="profile-link">
        <a href="/Profile" className="text-white">
          <FontAwesomeIcon icon={faUser} className="me-2" />
          Profile
        </a>
      </div>

      {/* Main Content */}
      <main className="content">
        {children}
      </main>

      {/* Sidebar Styling */}
      <style>{`
        .sidebar {
          position: fixed;
          top: 0;
          left: ${isSidebarOpen ? '0' : '-250px'};
          width: 250px;
          height: 100%;
          transition: left 0.3s ease;
          z-index: 999;
          overflow-y: auto;
        }

        .content {
          margin-left: ${isSidebarOpen ? '250px' : '0'};
          transition: margin-left 0.3s ease;
          padding: 20px;
        }

        .sidebar a {
          font-size: 1.1rem;
          padding: 12px 20px;
        }

        .sidebar a:hover {
          background-color: #575757;
        }

        .hamburger-menu {
          background-color: #007bff;
          border: none;
          border-radius: 30%;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
        }

        .hamburger-menu:hover {
          background-color: #0056b3;
        }

        .profile-link {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
        }

        .profile-link a {
          color: white;
          font-size: 1.1rem;
        }

        .profile-link a:hover {
          color: #007bff;
        }
      `}</style>
    </div>
  );
}
=======
>>>>>>> adb0757d73a6c63f2831392dcbce1e08afbbebaf

function App() {
  const isLoggedIn = false; // เปลี่ยนเป็น true เมื่อผู้ใช้ล็อกอินสำเร็จ

  return (
    <Router>
<<<<<<< HEAD
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/dashboard"
          element={<Layout><Dashboard /></Layout>}
        />
        <Route
          path="/members"
          element={<Layout><MembersComponent /></Layout>}
        />
        <Route
          path="/requestpage"
          element={<Layout><RequestPage /></Layout>}
        />
        <Route
          path="/ProductList"
          element={<Layout><ProductList /></Layout>}
        />
        <Route
          path="/Inventory"
          element={<Layout><Inventory /></Layout>}
        />
        <Route
          path="/Profile"
          element={<Layout><Profile /></Layout>}
        />
      </Routes>
=======
      <div>
        {/* เมนูนำทาง */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">My App</Link>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/members">Members</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/forgot-password">Forgot Password</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Profile">Profile</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/RequestPage">RequestPage</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/ProductList">ProductList</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Inventory">Inventory</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Routes สำหรับเมนูที่เลือก */}
        <Routes>
          <Route path="/" element={<Inventory />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/members" element={<MembersComponent />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/RequestPage" element={<RequestPage />} />
          <Route path="/ProductList" element={<ProductList />} />
          
          {/* คุณสามารถเพิ่มเส้นทางอื่นๆ ได้ที่นี่ */}
        </Routes>
      </div>
>>>>>>> adb0757d73a6c63f2831392dcbce1e08afbbebaf
    </Router>
  );
}

export default App;
