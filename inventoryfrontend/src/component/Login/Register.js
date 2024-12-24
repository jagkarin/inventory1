import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const API_URL = 'http://localhost:2000/api'; // Define your API URL

const Register = () => {
    const [employeeId, setEmployeeId] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState('Active'); // Default status
    const [position, setPosition] = useState(''); // No default position value
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');
    const [showPassword, setShowPassword] = useState(false); // New state for password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // New state for confirm password visibility
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMaxEmployeeId = async () => {
            try {
                const response = await fetch(`${API_URL}/users`);
                const data = await response.json();
                const maxEmployeeId = data.length > 0 ? Math.max(...data.map(user => user['Employee ID'])) : 0;
                setEmployeeId(maxEmployeeId + 1); // Set the new Employee ID
            } catch (error) {
                console.error('Error fetching employee data:', error);
            }
        };

        fetchMaxEmployeeId();
    }, []);

    const checkPasswordStrength = (password) => {
        let strength = '';
        const strongPasswordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])([a-zA-Z0-9!@#$%^&*]{8,})$/;
        const mediumPasswordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])([a-zA-Z0-9]{6,})$/;

        if (strongPasswordRegex.test(password)) {
            strength = 'strong';
        } else if (mediumPasswordRegex.test(password)) {
            strength = 'medium';
        } else {
            strength = 'weak';
        }

        setPasswordStrength(strength);
    };

    const handleInputChange = (setter, maxLength, errorMessage) => (e) => {
        if (e.target.value.length > maxLength) {
            alert(errorMessage);
            return;
        }
        setter(e.target.value);
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        // Check if the position is selected
        if (position === '') {
            setErrorMessage('กรุณาเลือกตำแหน่ง');
            setSuccessMessage('');
            return;
        }

        if (password.length < 8 || password.length > 20) {
            setErrorMessage('รหัสผ่านต้องมีความยาว 8 ถึง 20 ตัวอักษร');
            setSuccessMessage('');
            return;
        }

        // ตรวจสอบความแข็งแกร่งของรหัสผ่าน
        const strongPasswordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])([a-zA-Z0-9!@#$%^&*]{8,})$/;
        if (!strongPasswordRegex.test(password)) {
            setErrorMessage('รหัสผ่านต้องมีตัวอักษร, ตัวเลข, และสัญลักษณ์พิเศษอย่างน้อยหนึ่งตัว');
            setSuccessMessage('');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
            setSuccessMessage('');
            return;
        }

        const userData = { 
            "Employee ID": employeeId, 
            Username: username, 
            Password: password, 
            Status: status, 
            Position: position 
        };

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(`ลงทะเบียน ${username} สำเร็จ`);
                setErrorMessage('');

                setTimeout(() => {
                    navigate('/'); // เปลี่ยนไปยังหน้า Login
                }, 2000);
            } else {
                setErrorMessage(data.error || 'เกิดข้อผิดพลาดในการลงทะเบียน');
                setSuccessMessage('');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            setErrorMessage('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
            setSuccessMessage('');
        }
    };

    return (
        <div className="register-container">
            <h2>สมัครบัญชีใหม่</h2>
            <form onSubmit={handleRegister}>
                <div className="form-group">
                    <label htmlFor="username">ชื่อผู้ใช้</label>
                    <input
                        type="text"
                        id="username"
                        className="form-input"
                        value={username}
                        onChange={handleInputChange(setUsername, 20, 'ชื่อผู้ใช้ไม่ควรเกิน 20 ตัวอักษร')}
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
                            onChange={(e) => {
                                handleInputChange(setPassword, 20, 'รหัสผ่านไม่ควรเกิน 20 ตัวอักษร')(e);
                                checkPasswordStrength(e.target.value);
                            }}
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
                </div>

                {password && (
                    <div className={`password-strength ${passwordStrength}`}>
                        {passwordStrength === 'strong' && (
                            <span className="strong">ความแข็งแกร่งของรหัสผ่าน: <strong>แข็งแกร่ง</strong></span>
                        )}
                        {passwordStrength === 'medium' && (
                            <span className="medium">ความแข็งแกร่งของรหัสผ่าน: <strong>ปานกลาง</strong></span>
                        )}
                        {passwordStrength === 'weak' && (
                            <span className="weak">ความแข็งแกร่งของรหัสผ่าน: <strong>อ่อนแอ</strong></span>
                        )}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="confirm-password">ยืนยันรหัสผ่าน</label>
                    <div className="password-input-container">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirm-password"
                            className="form-input"
                            value={confirmPassword}
                            onChange={handleInputChange(setConfirmPassword, 20, 'ยืนยันรหัสผ่านไม่ควรเกิน 20 ตัวอักษร')}
                            required
                        />
                        <span 
                            className="password-toggle"
                            onClick={() => setShowConfirmPassword(prev => !prev)}
                            style={{ cursor: 'pointer' }}
                        >
                            {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                        </span>
                    </div>
                </div>

                <div className="password-rules">
                    <h4>กฎการตั้งรหัสผ่าน:</h4>
                    <ul>
                        <li>ต้องมีความยาวระหว่าง 8 ถึง 20 ตัวอักษร</li>
                        <li>ต้องประกอบด้วยตัวอักษรภาษาอังกฤษ (ทั้งตัวพิมพ์เล็กและใหญ่)</li>
                        <li>ต้องมีตัวเลขอย่างน้อยหนึ่งตัว</li>
                        <li>ควรมีสัญลักษณ์พิเศษ (เช่น !, @, #, $, %, ^, &, *)</li>
                        <li>กรุณากรอกเฉพาะตัวเลขและตัวอักษรภาษาอังกฤษเท่านั้น!</li>
                    </ul>
                </div>

                <div className="form-group">
                    <label htmlFor="position">ตำแหน่ง</label>
                    <select
                        id="position"
                        className="form-input"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                    >
                        <option value="">เลือกตำแหน่ง</option>
                        <option value="Developer">Developer</option>
                        <option value="Admin">Admin</option>
                        <option value="ติดตั้ง">ติดตั้ง</option>
                    </select>
                </div>

                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}

                <button type="submit" className="submit-button">สมัครบัญชี</button>
                <p className="login-link">
                    มีบัญชีแล้ว? <a href="/">เข้าสู่ระบบ</a>
                </p>
            </form>
        </div>
    );
};

export default Register;