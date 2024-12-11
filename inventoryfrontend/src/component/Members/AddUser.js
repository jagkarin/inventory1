import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

const AddUser = ({ onAdd, onClose }) => {
    const [newUser, setNewUser] = useState({
        'Employee ID': '',
        Username: '',
        Status: 'Active',
        Position: '',
        Password: ''
    });

    useEffect(() => {
        // ดึงข้อมูลผู้ใช้งานที่มีอยู่เพื่อกำหนด Employee ID ถัดไป
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:2000/api/users');
                const users = await response.json();

                const maxId = Math.max(...users.map(user => parseInt(user['Employee ID'])), 0);
                setNewUser(prev => ({ ...prev, 'Employee ID': maxId + 1 }));
            } catch (error) {
                console.error('ไม่สามารถดึงข้อมูลผู้ใช้ได้:', error);
                alert('ไม่สามารถดึงข้อมูลผู้ใช้ได้ โปรดลองอีกครั้งในภายหลัง');
            }
        };

        fetchUsers();
    }, []);

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
                    alert(`ข้อผิดพลาด: ${errorData.error}`);
                    return;
                }

                const addedUser = await response.json();
                console.log('เพิ่มผู้ใช้:', addedUser);
                onAdd(addedUser);
                onClose();

            } catch (error) {
                console.error('ข้อผิดพลาดในการเพิ่มผู้ใช้:', error);
                alert('ไม่สามารถเพิ่มผู้ใช้ได้ โปรดลองอีกครั้งในภายหลัง');
            }
        } else {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน!");
        }
    };

    return (
        <Modal show onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>เพิ่มผู้ใช้</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <div className="form-group">
                        <label>รหัสพนักงาน</label>
                        <input
                            type="text"
                            className="form-control"
                            name="Employee ID"
                            value={newUser['Employee ID']}
                            onChange={handleChange}
                            disabled // ทำให้ไม่สามารถแก้ไขได้
                        />
                    </div>
                    <div className="form-group">
                        <label>ชื่อผู้ใช้ (ไม่เกิน 20 ตัวอักษร)</label>
                        <input
                            type="text"
                            className="form-control"
                            name="Username"
                            value={newUser.Username}
                            onChange={handleChange}
                            maxLength={20} // ตั้งค่าความยาวสูงสุดไว้ที่ 20 ตัวอักษร
                        />
                    </div>
                    <div className="form-group">
                        <label>รหัสผ่าน (ไม่เกิน 10 ตัวอักษร)</label>
                        <input
                            type="text" // แสดงรหัสผ่านเป็นข้อความธรรมดา
                            className="form-control"
                            name="Password"
                            value={newUser.Password}
                            onChange={handleChange}
                            maxLength={10} // ตั้งค่าความยาวสูงสุดไว้ที่ 10 ตัวอักษร
                        />
                    </div>
                    <div className="form-group">
                        <label>สถานะ</label>
                        <select
                            className="form-control"
                            name="Status"
                            value={newUser.Status}
                            onChange={handleChange}
                        >
                            <option value="Active">ใช้งาน</option>
                            <option value="Inactive">ไม่ใช้งาน</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>ตำแหน่ง</label>
                        <select
                            className="form-control"
                            name="Position"
                            value={newUser.Position}
                            onChange={handleChange}
                        >
                            <option value="">เลือกตำแหน่ง...</option>
                            <option value="admin">admin</option>
                            <option value="Developer">Developer</option>
                            <option value="ติดตั้ง">ติดตั้ง</option>
                            {/* คุณสามารถเพิ่มตำแหน่งอื่นๆ ได้ที่นี่ */}
                        </select>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    ปิด
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    เพิ่มผู้ใช้
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddUser;