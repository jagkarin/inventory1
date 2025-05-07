import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Inventory from "./component/InventoryPage/Inventory.js";
import BorrowMain from "./component/BorrowEquipment/BorrowMain.js";
import Login from './component/Login/Login';
import EquipmentForm from "./component/Equipment/Equipment.js";
import Dashboard from "./component/Dashboard/DashBoard1.js";
import { jwtDecode } from 'jwt-decode';
import Profile from "./component/Login/Profile.js";
import Member from "./component/Members/Members.js";
import RequestPage from "./component/RequestP/Request.js";
import ApproveWithdrawPage from "./component/RequestP/approveProduct.js";
import BorrowForm from "./component/BorrowEquipment/BorrowForm.js";
import BorrowStatus from "./component/BorrowEquipment/BorrowStatus.js";
import MenuUser from "./component/Menu/MenuUser.js";
import './App.css';
import AppLayout from "./component/Menu/Layout.js";
import Menu from "./component/Menu/Menu.js";
import EquipmentPage from "./component/Equipment/EquimentPage.js";
import StatusUser from "./component/RequestP/StatusUser.js";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [roleId, setRoleId] = useState(null);

  // แก้ไข handleLogin: แปลง userRoleId เป็น string
  const handleLogin = (userRoleId) => {
    setIsLoggedIn(true);
    setRoleId(String(userRoleId)); // แปลงเป็น string ที่นี่
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setRoleId(null);
  };

  const profileData = {
    image: "/notice.png",
    name: "Expert ServicePRO",
    position: "Developer",
  };

  // แก้ไข useEffect: แปลง roleId จาก token เป็น string
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp > currentTime) {
          setIsLoggedIn(true);
          setRoleId(String(decodedToken.roleId || decodedToken.roleID)); // แปลงเป็น string ที่นี่
        } else {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          setRoleId(null);
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการถอดรหัสโทเค็น:", error);
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setRoleId(null);
      }
    } else {
      setIsLoggedIn(false);
      setRoleId(null);
    }
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route 
            path="/login" 
            element={!isLoggedIn ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to={roleId === "1" ? "/Menu" : "/MenuUser"} />
            )}
          />
          <Route
            path="/Menu"
            element={
              isLoggedIn && roleId === "1" ? (
                <AppLayout 
                  profile={profileData} 
                  showMenu={false} 
                  onLogout={handleLogout} 
                  roleId={roleId}
                >
                  <Menu/>
                  
                </AppLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/MenuUser"
            element={
              isLoggedIn && roleId !== "1" && roleId !== null ? (
                <AppLayout 
                  profile={profileData} 
                  showMenu={false} 
                  onLogout={handleLogout} 
                  roleId={roleId}
                >
                  <MenuUser/>
                  
                </AppLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          {/* เส้นทางอื่น ๆ คงเดิม */}
          <Route
            path="/dashboard1"
            element={
              isLoggedIn ? (
                <AppLayout profile={profileData} roleId={roleId}>
                  <Dashboard profile={profileData} />
                </AppLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/Inventory"
            element={
              isLoggedIn ? (
                <AppLayout profile={profileData} roleId={roleId}>
                  <Inventory />
                </AppLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/Status"
            element={
              isLoggedIn ? (
                <AppLayout profile={profileData} roleId={roleId}>
                  <StatusUser/>
                </AppLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/EQMpage"
            element={
              isLoggedIn ? (
                <AppLayout profile={profileData} roleId={roleId}>
                  <EquipmentPage />
                </AppLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/EQM"
            element={
              isLoggedIn ? (
                <AppLayout profile={profileData} roleId={roleId}>
                  <EquipmentForm />
                </AppLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/BorrowMain"
            element={
              isLoggedIn ? (
                <AppLayout profile={profileData} roleId={roleId}>
                  <BorrowMain />
                </AppLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/ApproveWithdrawPage"
            element={
              isLoggedIn ? (
                <AppLayout profile={profileData} roleId={roleId}>
                  <ApproveWithdrawPage />
                </AppLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/Profile"
            element={
              isLoggedIn ? (
                <AppLayout profile={profileData} onLogout={handleLogout} roleId={roleId}>
                  <Profile onLogout={handleLogout} />
                </AppLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/Member"
            element={
              isLoggedIn ? (
                <AppLayout profile={profileData} roleId={roleId}>
                  <Member />
                </AppLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/RequestP"
            element={
              isLoggedIn ? (
                <AppLayout profile={profileData} roleId={roleId}>
                  <RequestPage />
                </AppLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/BorrowForm"
            element={
              isLoggedIn ? (
                <AppLayout profile={profileData} roleId={roleId}>
                  <BorrowForm />
                </AppLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/BorrowStatus"
            element={
              isLoggedIn ? (
                <AppLayout profile={profileData} roleId={roleId}>
                  <BorrowStatus />
                </AppLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/"
            element={<Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;