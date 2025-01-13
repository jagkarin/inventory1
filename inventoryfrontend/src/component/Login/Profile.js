import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Profile.css';

const API_URL = 'http://localhost:2000/api/users';

const Profile = () => {
    const [image, setImage] = useState(null);
    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [reuseOldPassword, setReuseOldPassword] = useState(false);
    const [imageError, setImageError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const countdownRef = useRef(null);

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('user'));
        if (savedUser) {
            // ดึงค่าจาก local storage หากมี
            setName(savedUser.Username);
            setPosition(savedUser.Position);
        } else if (location.state) {
            setName(location.state.username);
            setPosition(location.state.position);
            fetchUserProfile(location.state.username);
        }
    }, [location.state]);

    const fetchUserProfile = async (username) => {
        try {
            const response = await fetch(`${API_URL}/${username}`);
            const data = await response.json();
            if (response.ok) {
                setName(data.username);
                setPosition(data.position);
                // บันทึกค่าลงใน local storage
                localStorage.setItem('user', JSON.stringify({
                    Username: data.username,
                    Position: data.position
                }));
            } else {
                console.error('Failed to fetch user profile:', data.message);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileType = file.type;
            const validImageTypes = ['image/png', 'image/jpeg'];
            if (validImageTypes.includes(fileType)) {
                setImage(URL.createObjectURL(file));
                setImageError('');
            } else {
                setImageError('Please select a valid image file (.png or .jpg)');
                setImage(null);
            }
        }
    };

    const startReuseOldPasswordCountdown = () => {
        setReuseOldPassword(true);
        setCountdown(10);
        let isAlertShown = false;

        countdownRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownRef.current);
                    setReuseOldPassword(false);
                    setOldPassword('');
                    setNewPassword('');

                    if (!isAlertShown) {
                        alert("เลือกใช้รหัสผ่านเดิม");
                        isAlertShown = true;
                    }

                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleReusePassword = () => {
        setNewPassword(oldPassword);
        setReuseOldPassword(false);
        setOldPassword('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newPassword && !reuseOldPassword) {
            setPasswordError('กรุณาใส่รหัสผ่านใหม่หรือยืนยันการใช้รหัสผ่านเดิม!');
            return;
        } else {
            setPasswordError('');
        }

        const userData = {
            Password: reuseOldPassword ? oldPassword : newPassword,
        };

        try {
            const response = await fetch(`${API_URL}/change-password/${name}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data.message);
            } else {
                setPasswordError(data.error);
            }
        } catch (error) {
            console.error('Error updating password:', error);
            setPasswordError('Error saving changes!');
        }

        setNewPassword('');

        setTimeout(() => {
            setSuccessMessage('');
        }, 3000);
    };

    const handleLogout = () => {
        localStorage.removeItem('user'); // ลบข้อมูลผู้ใช้ออกจาก local storage เมื่อออกจากระบบ
        navigate('/login');
    };

    const handleFileInputClick = () => {
        fileInputRef.current.click();
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(prev => !prev);
        if (isPasswordVisible) {
            setNewPassword('');
        }
    };

    const handleChangeNewPassword = (e) => {
        setNewPassword(e.target.value);
        if (e.target.value) {
            if (countdownRef.current) {
                clearInterval(countdownRef.current);
                setReuseOldPassword(false); 
                setCountdown(0);
            }
        }
    };

    return (
        <div className="profile-container">
            <h1>Profile</h1>
            <div className="profile-content">
                <div className="image-upload-container">
                    <div
                        className="profile-icon"
                        onClick={handleFileInputClick}
                        style={{ cursor: 'pointer', width: '100px', height: '100px', textAlign: 'center', border: '1px solid #ccc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        {image ? (
                            <img src={image} alt="Profile" style={{ borderRadius: '50%', width: '100%', height: 'auto' }} />
                        ) : (
                            <span style={{ fontSize: '50px' }}>👤</span>
                        )}
                    </div>
                    {imageError && <p className="error-message">{imageError}</p>}
                    <input
                        type="file"
                        id="image-upload"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        className="file-input"
                        style={{ display: 'none' }}
                        accept="image/png, image/jpeg"
                    />
                    <p className="upload-instruction">* Must be image files only (.png, .jpg)</p>
                    <button onClick={handleFileInputClick} className="custom-upload-button">
                        Upload Image
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                        <label>Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled // Disable input for Name
                        />
                    </div>
                    <div className="form-group">
                        <label>Position:</label>
                        <input
                            type="text"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            required
                            disabled // Disable input for Position
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ color: 'blue', cursor: 'pointer' }} onClick={togglePasswordVisibility}>
                            {isPasswordVisible ? 'Hide Password' : 'Change Password'}
                        </label>
                        <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>
                            หากคุณต้องการเปลี่ยนรหัสผ่าน โปรดคลิกที่ "เปลี่ยนรหัสผ่าน" ด้านบน
                        </p>
                    </div>

                    {reuseOldPassword ? (
                        <p className="countdown-message">จะใช้รหัสผ่านเก่าใน {countdown} วินาที</p>
                    ) : (
                        isPasswordVisible && (
                            <div className="form-group">
                                <button type="button" onClick={startReuseOldPasswordCountdown}>
                                    Confirm Old Password
                                </button>
                            </div>
                        )
                    )}

                    {isPasswordVisible && reuseOldPassword && ( // Show confirmation text instead of button
                        <div className="form-group">
                            <p>คุณเลือกใช้รหัสผ่านเดิม โปรดตรวจสอบเวลาใน {countdown} วินาที</p>
                        </div>
                    )}

                    {isPasswordVisible && (
                        <div className="form-group">
                            <input
                                type="text"
                                required
                                placeholder="กรุณาใส่รหัสผ่านใหม่"
                                value={newPassword}
                                onChange={handleChangeNewPassword}
                            />
                        </div>
                    )}

                    {passwordError && <p className="error-message">{passwordError}</p>}
                    <button type="submit" className="save-button">Save Changes</button>
                    {successMessage && <p className="success-message">{successMessage}</p>}
                </form>
            </div>
            <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
    );
};

export default Profile;