import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import ViewHistory from './ViewHistory'; // Import modal ที่ใช้ดูประวัติการเบิก

function UserDetails({ user, onClose }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const handleShowHistory = () => {
        setShowHistory(true);
    };

    const handleCloseHistory = () => {
        setShowHistory(false);
    };

    return (
        <>
            <Modal show={true} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>รายละเอียดพนักงาน</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>ข้อมูลพนักงาน</h5>
                    <div className="mb-3">
                        <strong>หมายเลขพนักงาน:</strong>
                        <span className="ms-2">{user['Employee ID']}</span>
                    </div>
                    <div className="mb-3">
                        <strong>ชื่อผู้ใช้:</strong>
                        <span className="ms-2">{user.Username}</span>
                    </div>
                    <div className="mb-3">
                        <strong>รหัสผ่าน:</strong>
                        <span className="ms-2">{showPassword ? user.Password : '******'}</span>
                        <Button 
                            variant="link" 
                            className="ms-2" 
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? '🙈 ซ่อน' : '👁️ แสดง'}
                        </Button>
                    </div>
                    <div className="mb-3">
                        <strong>สถานะ:</strong>
                        <span className="ms-2">{user.Status}</span>
                    </div>
                    <div className="mb-3">
                        <strong>ตำแหน่ง:</strong>
                        <span className="ms-2">{user.Position}</span>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        ปิด
                    </Button>
                    <Button variant="primary" onClick={handleShowHistory}>
                        ดูประวัติการเบิก
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* เปิด modal สำหรับประวัติการเบิก */}
            <ViewHistory userId={user['Employee ID']} show={showHistory} onClose={handleCloseHistory} />
        </>
    );
}

export default UserDetails;