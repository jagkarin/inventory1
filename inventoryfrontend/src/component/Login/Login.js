import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import logo from './css/logo_Expert.png';
import './css/Login.css';
import { API_ENDPOINT } from '../API';

const Login = ({ onLogin, fetchLowStockData }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_ENDPOINT}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token && data.token.split('.').length === 3) {
          localStorage.setItem("token", data.token);
          const decodedToken = jwtDecode(data.token);
          const roleId = decodedToken.roleId || decodedToken.roleID;
          onLogin(roleId);
          fetchLowStockData();
        } else {
          setErrorMessage("รูปแบบโทเคนไม่ถูกต้อง");
        }
      } else {
        setErrorMessage("เข้าสู่ระบบล้มเหลว");
      }
    } catch (error) {
      setErrorMessage("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    }
  };

  return (
    <div className="expert-login-container">
      <div className="expert-logo-container">
        <img
          src={logo}
          className="expert-company-logo"
          alt="Expert Development Logo"
        />
      </div>

      {errorMessage && <p className="expert-error-message">{errorMessage}</p>}

      <form onSubmit={handleLogin} className="expert-login-form">
        <div className="expert-form-group">
          <label htmlFor="username" className="expert-form-label">Username</label>
          <input
            type="text"
            id="username"
            className="expert-form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>

        <div className="expert-form-group">
          <label htmlFor="password" className="expert-form-label">Password</label>
          <div className="expert-password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="expert-form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <span
              className="expert-password-toggle"
              onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </span>
          </div>
        </div>

        <div className="expert-remember-container">
          <input
            type="checkbox"
            id="rememberMe"
            className="expert-remember-checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="rememberMe" className="expert-remember-label">Remember Me</label>
        </div>

        <button type="submit" className="expert-login-button">Login</button>
      </form>
    </div>
  );
};

export default Login;