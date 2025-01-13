import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // ใช้ js-cookie
import './Login.css';
import { jwtDecode } from "jwt-decode";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        // Allow login without username and password
        if (username === '' && password === '') {
            navigate('/profile', { state: { username: 'Guest', position: 'Guest' } });
            return;
        }

        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(users => {
                const foundUser = users.find((user) => user.Username === username && user.Password === password);
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
                        expires: rememberMe ? 1 : 1, // ตั้งค่าอายุ Cookie 1 วัน หรือ 7 วันถ้าเลือก "จำรหัสผ่าน"
                        secure: true, // เปิดใช้งาน Secure สำหรับ HTTPS
                        sameSite: "strict", // ป้องกัน CSRF
                    });

                    try {
                        const decodedToken = jwtDecode(data.token);
                        const roleId = decodedToken.roleId;

                        if (roleId === "1") {
                            navigate("/dashboard");
                        } else if (roleId === "3") {
                            navigate("/Inventory");
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

    const checkPasswordStrength = (password) => {
        if (password.length < 6) {
            setPasswordStrength('อ่อน');
        } else if (password.length < 10) {
            setPasswordStrength('ปานกลาง');
        } else {
            setPasswordStrength('แข็งแรง');
        }
    };

    useEffect(() => {
        checkPasswordStrength(password);
    }, [password]);

    const getWelcomeMessage = () => {
        const hour = new Date().getHours();
        if (hour < 12) {
            return 'สวัสดีตอนเช้า';
        } else if (hour < 18) {
            return 'สวัสดีตอนบ่าย';
        } else {
            return 'สวัสดีตอนเย็น';
        }
    };

    return (
        <div className="login-container">
            <h2>{getWelcomeMessage()}</h2>
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
                    <div className="password-strength">
                        <p>ความแข็งแรงของรหัสผ่าน: {passwordStrength}</p>
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
                <div className="links-container">
                    <p className="forgot-password-link">
                        <Link to="/forgot-password">ลืมรหัสผ่าน?</Link>
                    </p>
                    <p className="register-link">
                        ยังไม่มีบัญชี? <Link to="/register">สมัครบัญชี</Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Login;
