import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const AddUser = ({ onAdd, onClose }) => {
    const [newUser, setNewUser] = useState({
        'Employee ID': '',
        Username: '',
        Status: 'Active',
        Position: '',
        Password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleSubmit = async () => {
        const isFormValid = 
            newUser['Employee ID'] &&
            newUser.Username &&
            newUser.Password &&
            newUser.Position;

        if (isFormValid) {
            try {
                const response = await fetch('http://localhost:2000/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newUser),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.error}`);
                    return;
                }

                const addedUser = await response.json();
                console.log('User added:', addedUser);
                onAdd(addedUser);
                onClose();
                
            } catch (error) {
                console.error('Error adding user:', error);
                alert('Unable to add user. Please try again later.');
            }
        } else {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน!");
        }
    };

    return (
        <Modal show onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <div className="form-group">
                        <label>Employee ID</label>
                        <input
                            type="text"
                            className="form-control"
                            name="Employee ID"
                            value={newUser['Employee ID']}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            className="form-control"
                            name="Username"
                            value={newUser.Username}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="text" // รหัสผ่านแสดงเป็นข้อความปกติ
                            className="form-control"
                            name="Password"
                            value={newUser.Password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select
                            className="form-control"
                            name="Status"
                            value={newUser.Status}
                            onChange={handleChange}
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Position</label>
                        <select
                            className="form-control"
                            name="Position"
                            value={newUser.Position}
                            onChange={handleChange}
                        >
                            <option value="">เลือกตำแหน่ง...</option>
                            <option value="admin">Admin</option>
                            <option value="Developer">Developer</option>
                            <option value="ติดตั้ง">ติดตั้ง</option>
                            {/* คุณสามารถเพิ่มตำแหน่งอื่นๆ ได้ที่นี่ */}
                        </select>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Add User
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddUser;