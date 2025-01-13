import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const API_URL = 'http://localhost:2000/api/users';

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const savedUsername = localStorage.getItem('username');
        const savedPassword = localStorage.getItem('password');
        const savedRememberMe = localStorage.getItem('rememberMe') === 'true';

        if (savedRememberMe) {
            setUsername(savedUsername || '');
            setPassword(savedPassword || '');
            setRememberMe(savedRememberMe);
        }
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(users => {
                const foundUser = users.find(user => user.Username === username);

                if (foundUser) {
                    if (foundUser.Password === password) {
                        if (foundUser.Status === 'Active') {
                            localStorage.setItem('user', JSON.stringify({
                                Username: foundUser.Username,
                                Position: foundUser.Position
                            }));
                            navigate('/profile', { state: { username: foundUser.Username, position: foundUser.Position } });

                            if (rememberMe) {
                                localStorage.setItem('username', username);
                                localStorage.setItem('password', password);
                                localStorage.setItem('rememberMe', 'true');
                            } else {
                                localStorage.removeItem('username');
                                localStorage.removeItem('password');
                                localStorage.removeItem('rememberMe');
                            }
                        } else {
                            setErrorMessage('บัญชีผู้ใช้นี้ไม่สามารถเข้าสู่ระบบได้');
                        }
                    } else {
                        setErrorMessage('รหัสผ่านไม่ถูกต้อง');
                    }
                } else {
                    setErrorMessage('ชื่อผู้ใช้ไม่ถูกต้อง');
                }
            })
            .catch(error => {
                console.error('Error during login:', error);
                setErrorMessage('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
            });
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
                        required
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
                            required
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