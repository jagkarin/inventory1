import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUsers, faBox, faPaperPlane, faUser } from '@fortawesome/free-solid-svg-icons';
import MembersComponent from './component/Members/Members';
import Inventory from './component/InventoryPage/Inventory';
import RequestPage from './component/RequestP/Request';
import Login from './component/Login/Login';
import Register from './component/Login/Register';
import ForgotPassword from './component/Login/ForgotPassword';
import Profile from './component/Login/Profile';
import Dashboard from './component/Dashboard/DashBoard1';
import Product from './component/InventoryPage/product1'; // import หน้า product1 ที่สร้างมา

const Layout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.replace("/login");
  };

  return (
    <div className="layout">
      <nav className={`sidebar bg-dark ${isSidebarOpen ? 'open' : ''}`}>
        <ul className="nav flex-column text-white">
          <li className="nav-item">
            <Link className="nav-link text-white" to="/dashboard1">
              <FontAwesomeIcon icon={faTachometerAlt} className="me-2" />
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/members">
              <FontAwesomeIcon icon={faUsers} className="me-2" />
              Members
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/requestpage">
              <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
              Request Page
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/inventory">
              <FontAwesomeIcon icon={faBox} className="me-2" />
              Inventory
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/product1">
              <FontAwesomeIcon icon={faBox} className="me-2" />
              Product1
            </Link>
          </li>
        </ul>
        <div className="profile-link">
          <Link to="/profile" className="text-white">
            <FontAwesomeIcon icon={faUser} className="me-2" />
            Profile
          </Link>
        </div>
        <button className="logout text-white" onClick={handleLogout}>
          Logout
        </button>
      </nav>
      <main className="content">{children}</main>
    </div>
  );
};

function App() {
  // ตรวจสอบการมีอยู่ของ JWT token ใน cookie
  const isLoggedIn = document.cookie.includes("jwt");

  return (
    <Router>
      <Routes>
        {/* เปลี่ยน path "/" ให้พาไป login ถ้ายังไม่ล็อกอิน */}
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/dashboard1" /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard1" element={<Layout><Dashboard /></Layout>} />
        <Route path="/members" element={<Layout><MembersComponent /></Layout>} />
        <Route path="/requestpage" element={<Layout><RequestPage /></Layout>} />
        <Route path="/inventory" element={<Layout><Inventory /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/product1" element={<Layout><Product /></Layout>} /> {/* เพิ่มเส้นทางใหม่ */}
      </Routes>
    </Router>
  );
}

export default App;
