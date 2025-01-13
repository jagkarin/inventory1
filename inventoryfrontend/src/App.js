import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUsers, faBox, faPaperPlane, faListAlt, faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import MembersComponent from './component/Members/Members';
import Dashboard from './component/Dashboard/Dashboard';
import Inventory from './component/InventoryPage/Inventory';
import RequestPage from './component/RequestP/Request';
import Login from './component/Login/Login';
import Register from './component/Login/Register';
import ForgotPassword from './component/Login/ForgotPassword';
import Profile from './component/Login/Profile';


const Layout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    // การออกจากระบบ (เช่น ลบคุกกี้ หรือรีเฟรชหน้า)
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // การเปลี่ยนเส้นทางไปที่หน้า login
    window.location.replace("/login");
  };

  return (
    <div className="layout">
      <nav className={`sidebar bg-dark ${isSidebarOpen ? 'open' : ''}`}>
  <ul className="nav flex-column text-white">
    {/* รายการเมนู */}
    <li className="nav-item">
      <Link className="nav-link text-white" to="/dashboard">
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
      <Link className="nav-link text-white" to="/Inventory">
        <FontAwesomeIcon icon={faBox} className="me-2" />
        Inventory
      </Link>
    </li>
  </ul>
      <div className="profile-link">
        <Link to="/Profile" className="text-white">
          <FontAwesomeIcon icon={faUser} className="me-2" />
          Profile
        </Link>
      </div>

      {/* ปุ่ม Logout */}
  <button 
    className="logout text-white" 
    onClick={handleLogout}>
    Logout
  </button>
</nav>

      <main className="content">{children}</main>
    </div>
  );
};



function App() {
  const isLoggedIn = false; // แก้ไขการตรวจสอบการล็อกอินตามจริง

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/members" element={<Layout><MembersComponent /></Layout>} />
        <Route path="/requestpage" element={<Layout><RequestPage /></Layout>} />
        <Route path="/Inventory" element={<Layout><Inventory /></Layout>} />
        <Route path="/Profile" element={<Layout><Profile /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;