import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Profile.css';

const API_URL = 'http://localhost:2000/api/users';  // Update your API URL here

const Profile = () => {
    const [image, setImage] = useState(null);
    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const fileInputRef = useRef(null);
    const [imageError, setImageError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state) {
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
                // other profile data can be set here
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
        } else {
            setImageError('');
            setImage(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password) {
            setPasswordError('กรุณาใส่รหัสผ่านใหม่!');
            return;
        } else {
            setPasswordError('');
        }

        // Prepare data for updating password
        const userData = {
            Password: password,
        };

        // Call the API to update password
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

        setPassword('');

        setTimeout(() => {
            setSuccessMessage('');
        }, 3000);
    };

    const handleLogout = () => {
        console.log('Logout');
        navigate('/login');
    };

    const handleFileInputClick = () => {
        fileInputRef.current.click();
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
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
                    {isPasswordVisible && (
                        <div className="form-group">
                            <input
                                type="text" // Changed to password for security
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="กรุณาใส่รหัสผ่านตรงนี้"
                                style={{ backgroundColor: 'white' }}
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