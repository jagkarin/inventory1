import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // ใช้ js-cookie
import { jwtDecode } from 'jwt-decode'; // แก้ไขการ import ให้ถูกต้อง
import './Login.css';


const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("https://localhost:7294/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.token && data.token.split('.').length === 3) {
                    // ใช้ js-cookie แทน localStorage
                    Cookies.set("token", data.token, {
                        expires: rememberMe ? 1 : 1, //  "จำรหัสผ่าน", 1 
                        secure: true,
                        sameSite: "strict",
                    });

                    try {
                        const decodedToken = jwtDecode(data.token);
                        const roleId = decodedToken.roleId;

                        // นำผู้ใช้ไปยังหน้าที่เกี่ยวข้องตาม roleId
                        if (roleId === "1") {
                            navigate("/DashBoard1");
                        } else if (roleId === "3") {
                            navigate("/Members");
                        } else {
                            setErrorMessage("ไม่ทราบสิทธิ์การเข้าถึง (Unknown roleId)");
                        }
                    } catch (error) {
                        setErrorMessage("ไม่สามารถถอดรหัสโทเคนได้");
                    }
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
        <div className="login-container">
            <h2>เข้าสู่ระบบ</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="username">ชื่อผู้ใช้</label>
                    <input
                        type="text"
                        id="username"
                        className="form-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">รหัสผ่าน</label>
                    <div className="password-input-container">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span 
                            className="password-toggle"
                            onClick={() => setShowPassword(prev => !prev)}
                            style={{ cursor: 'pointer' }}
                        >
                            {showPassword ? '👁️' : '👁️‍🗨️'}
                        </span>
                    </div>
                </div>

                <div className="form-group flex-container">
                    <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="rememberMe" style={{ marginLeft: '8px' }}>จำรหัสผ่าน</label>
                </div>

                <button type="submit" className="submit-button">เข้าสู่ระบบ</button>
            </form>
        </div>
    );
};

export default Login;