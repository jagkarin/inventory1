import React, { useState } from 'react';
import { Modal, Button, Toast } from 'react-bootstrap';
import { FaEdit, FaSave } from 'react-icons/fa';

// Define the API URL
const API_URL = 'http://localhost:2000/api/users';

function EditUser({ user, onUpdate, onClose }) {
    const [employeeId] = useState(user['Employee ID'] || '');
    const [username, setUsername] = useState(user.Username || '');
    const [password, setPassword] = useState(user.Password || '');
    const [status, setStatus] = useState(user.Status || 'Inactive');
    const [position, setPosition] = useState(user.Position || '');
    const [showToast, setShowToast] = useState(false);

    const handleSubmit = async () => {
        // Validate all fields
        if (!username || !password || !position) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน!"); // Alert for empty fields if necessary
            return; // Prevent submission if validation fails
        }

        const updatedUser = { 
            'Employee ID': employeeId, // Employee ID should remain unchanged
            Username: username, 
            Password: password, 
            Status: status, 
            Position: position 
        };

        try {
            const response = await fetch(`${API_URL}/${employeeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`ข้อผิดพลาด: ${errorData.error}`);
                return;
            }

            const data = await response.json();
            onUpdate(data); 
            setShowToast(true); // Show Toast message
            onClose(); // Close Modal
        } catch (error) {
            console.error("Error updating user:", error);
            alert('ไม่สามารถอัปเดตข้อมูลผู้ใช้ได้ โปรดลองอีกครั้งในภายหลัง');
        }
    };

    return (
        <>
            <Modal show={true} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FaEdit className="mr-2" />
                        Edit User
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label>Employee ID</label>
                        <input
                            type="text"
                            className="form-control"
                            value={employeeId}
                            disabled // Keep it disabled to avoid changes
                        />
                    </div>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password" // Change to password type for security
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select
                            className="form-control"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Position</label>
                        <select
                            className="form-control"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                        >
                            <option value="">Select Position...</option>
                            <option value="Admin">Admin</option>
                            <option value="Developer">Developer</option>
                            <option value="Installer">ติดตั้ง</option>
                        </select>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        <FaSave className="mr-2" /> Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <Toast
                onClose={() => setShowToast(false)}
                show={showToast}
                delay={3000}
                autohide
                style={{ position: 'absolute', top: '10%', right: '10%' }}
            >
                <Toast.Header>
                    <strong className="mr-auto">Success</strong>
                </Toast.Header>
                <Toast.Body>Data saved successfully!</Toast.Body>
            </Toast>
        </>
    );
}

export default EditUser;