import React, { useState } from 'react';
import { Modal, Button, Toast } from 'react-bootstrap';
import { FaEdit, FaSave } from 'react-icons/fa'; // Importing both Edit and Save icons

function EditUser({ user, onUpdate, onClose }) {
    const [employeeId, setEmployeeId] = useState(user['Employee ID'] || '');
    const [username, setUsername] = useState(user.Username || '');
    const [password, setPassword] = useState(user.Password || '');
    const [status, setStatus] = useState(user.Status || 'Inactive');
    const [position, setPosition] = useState(user.Position || '');
    const [showToast, setShowToast] = useState(false);

    const handleSubmit = async () => {
        console.log("Submit button clicked"); // For debugging
        
        // Validate all fields
        if (!employeeId || !username || !password || !position) {
            console.error("Validation failed: All fields must be filled out");
            return; // Prevent submission if validation fails
        }

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
            onClose(); // Close Modal
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    return (
        <>
            <Modal show={true} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FaEdit className="mr-2" /> {/* Adding the edit icon */}
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
                            disabled // Disable input to make it non-editable
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
                            type="text" // Intentionally kept as text
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
                            <option value="admin">Admin</option>
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
                        <FaSave className="mr-2" /> Save Changes {/* Add the save icon here */}
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