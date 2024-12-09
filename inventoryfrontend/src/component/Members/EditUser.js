import React, { useState } from 'react';
import { Modal, Button, Toast } from 'react-bootstrap';

function EditUser({ user, onUpdate, onClose }) {
    const [employeeId, setEmployeeId] = useState(user['Employee ID'] || '');
    const [username, setUsername] = useState(user.Username || '');
    const [password, setPassword] = useState(user.Password || '');
    const [status, setStatus] = useState(user.Status || 'Inactive');
    const [position, setPosition] = useState(user.Position || '');
    const [showToast, setShowToast] = useState(false);

    const handleSubmit = async () => {
        const updatedUser = { 
            'Employee ID': employeeId,
            Username: username, 
            Password: password, 
            Status: status, 
            Position: position 
        };

        try {
            const response = await fetch(`http://localhost:2000/api/users/${employeeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            onUpdate(data); 
            setShowToast(true); // Show Toast message
            onClose(); // Close modal
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    return (
        <>
            <Modal show={true} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label>Employee ID</label>
                        <input
                            type="text"
                            className="form-control"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
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
                            type="text" // Keep this as type="text" to show the password
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
                            <option value="">เลือกตำแหน่ง...</option>
                            <option value="Admin">Admin</option>
                            <option value="Developer">Developer</option>
                            <option value="ติดตั้ง">ติดตั้ง</option>
                        </select>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Save Changes
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
                <Toast.Body>ข้อมูลบันทึกสำเร็จ!</Toast.Body>
            </Toast>
        </>
    );
}

export default EditUser;