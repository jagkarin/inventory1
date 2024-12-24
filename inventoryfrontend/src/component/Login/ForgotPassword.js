import React, { useState } from 'react';
import './ForgotPassword.css'; // เพิ่มไฟล์ CSS สำหรับสไตล์

const API_URL = 'http://localhost:2000/api'; // URL ของ API

const ForgotPassword = () => {
    const [username, setUsername] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPasswordField, setShowPasswordField] = useState(false);

    // ฟังก์ชันตรวจสอบชื่อผู้ใช้
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/users/check-username/${username}`);
            const data = await response.json();

            if (data.exists) {
                setSuccessMessage(`คุณสามารถเปลี่ยนรหัสผ่านสำหรับชื่อผู้ใช้ ${username} ในระบบได้.`);
                setErrorMessage(''); // เคลียร์ข้อความผิดพลาด
                setShowPasswordField(true); // แสดงช่องสำหรับกรอกรหัสผ่านใหม่
                setNewPassword(''); // เคลียร์ค่ารหัสผ่านใหม่
            } else {
                setErrorMessage(`ชื่อผู้ใช้ ${username} ไม่พบในระบบ.`);
                setSuccessMessage(''); // เคลียร์ข้อความสำเร็จ
                setShowPasswordField(false); // ซ่อนช่องสำหรับกรอกรหัสผ่านใหม่
            }
        } catch (error) {
            console.error('Error checking username:', error);
            setErrorMessage('เกิดข้อผิดพลาดในการตรวจสอบชื่อผู้ใช้!'); // ข้อความผิดพลาด
        }
    };

    // ฟังก์ชันในการเปลี่ยนรหัสผ่าน
    const handleChangePassword = async (e) => {
        e.preventDefault();

        // ตรวจสอบว่ามีการกรอกรหัสผ่านใหม่หรือไม่
        if (!newPassword) {
            setErrorMessage('กรุณาใส่รหัสผ่านใหม่!');
            return;
        }

        // ส่งข้อมูลรหัสผ่านใหม่ไปยัง API
        try {
            const response = await fetch(`${API_URL}/users/change-password/${username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Password: newPassword }), // ข้อมูลที่ส่งไป
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data.message); // แสดงข้อความความสำเร็จ
                setNewPassword(''); // เคลียร์ฟิลด์รหัสผ่านใหม่
            } else {
                setErrorMessage(data.error); // แสดงข้อความผิดพลาด
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setErrorMessage('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน!'); // ข้อความผิดพลาด
        }
    };

    return (
        <div className="forgot-password-container">
            <h2>ลืมรหัสผ่าน?</h2>
            <p>กรุณากรอกชื่อผู้ใช้ของคุณเพื่อตรวจสอบว่ามีในระบบหรือไม่</p>

            <form onSubmit={handleSubmit} className="forgot-password-form">
                <div className="form-group">
                    <label htmlFor="username">ชื่อผู้ใช้:</label>
                    <input
                        type="text"
                        id="username"
                        className="form-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">ตรวจสอบชื่อผู้ใช้</button>
            </form>

            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            {showPasswordField && (
                <form onSubmit={handleChangePassword} className="change-password-form">
                    <div className="form-group">
                        <label htmlFor="new-password">รหัสผ่านใหม่:</label>
                        <input
                            type="text" // แนะนำให้ใช้ type เป็น password เพื่อความปลอดภัย
                            id="new-password"
                            className="form-input"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button">เปลี่ยนรหัสผ่าน</button>
                </form>
            )}

            <p className="back-to-login-link">
                <a href="/login">กลับไปที่หน้าลงชื่อเข้าใช้</a>
            </p>
        </div>
    );
};

export default ForgotPassword;