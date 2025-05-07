import React, { useEffect, useState, useRef } from "react";
import { Container, Table, Form, Button, Pagination, Row, Col, Modal } from "react-bootstrap";
import { FaSearch } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import './css/Members.css';

const Member = () => {
    const [users, setUsers] = useState([]);
    const [roles] = useState([
        { id: 1, name: 'แอดมิน' },
        { id: 2, name: 'พนักงาน' },
        
    ]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newFirstName, setNewFirstName] = useState("");
    const [newLastName, setNewLastName] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRoleId, setSelectedRoleId] = useState("");
    const [selectedRoleName, setSelectedRoleName] = useState("");
    const [newOtherRole, setNewOtherRole] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalShow, setModalShow] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [selectedRoleFilter, setSelectedRoleFilter] = useState("");
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [confirmAddModalShow, setConfirmAddModalShow] = useState(false);
    const [tempNewUser, setTempNewUser] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [currentUserID, setCurrentUserID] = useState(null);
    const [usernameErrorModalShow, setUsernameErrorModalShow] = useState(false);
    const [isNewUserActive, setIsNewUserActive] = useState(true);
    const [isLoading, setIsLoading] = useState(false); // เพิ่ม loading state
    const editSectionRef = useRef(null);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("https://localhost:7294/api/User/GetAllUserwithrole", {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();

            if (Array.isArray(data.data)) {
                setUsers(data.data);
            } else {
                console.error("Invalid data format: Expected an array", data);
                setModalMessage('รูปแบบข้อมูลไม่ถูกต้อง');
                setModalShow(true);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setModalMessage('ไม่สามารถเรียกข้อมูลผู้ใช้ได้');
            setModalShow(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const userID = decodedToken.userID || decodedToken.id || decodedToken.userId || decodedToken.sub;
                setCurrentUserID(userID ? parseInt(userID, 10) : null);
            } catch (error) {
                console.warn("Error decoding token:", error);
            }
        }
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const filteredUsers = users.filter((user) =>
        (user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedStatus === "All" ||
            (selectedStatus === "Open" && user.isActive) ||
            (selectedStatus === "Closed" && !user.isActive)) &&
        (selectedRoleFilter === "" || user.roleName === selectedRoleFilter)
    );

    const handleEditUser = (userID) => {
        const user = users.find(u => u.userID === userID);
        if (user) {
            setSelectedUser(user);
            setNewName(user.username || "");
            setNewEmail(user.email || "");
            setNewFirstName(user.firstname || "");
            setNewLastName(user.lastname || "");
            setSelectedRoleId(user.roleId?.toString() || "");
            setSelectedRoleName(user.roleName || "");
            setIsEditing(true);
            setIsAdding(false);

            if (editSectionRef.current) {
                editSectionRef.current.scrollIntoView({ behavior: "smooth" });
            }
        } else {
            console.error('User not found:', userID);
            setModalMessage('ไม่พบข้อมูลผู้ใช้');
            setModalShow(true);
        }
    };

    const handleSave = async () => {
        if (!selectedUser) return;
    
        // ตรวจสอบข้อมูลที่จำเป็น
        if (!newFirstName.trim() || !newLastName.trim() || !newEmail.trim()) {
            setModalMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
            setModalShow(true);
            return;
        }
    
        if (!validateEmail(newEmail)) {
            setModalMessage('รูปแบบอีเมลไม่ถูกต้อง');
            setModalShow(true);
            return;
        }
    
        // โครงสร้างข้อมูลที่ส่งไปยัง API
        const updatedUserData = {
            userID: selectedUser.userID,
            username: newName.trim(),
            email: newEmail.trim(),
            firstname: newFirstName.trim(),
            lastname: newLastName.trim(),
            roleId: parseInt(selectedRoleId, 10) || 0, // แปลงเป็น integer และมีค่า default
            roleName: selectedRoleName || "",
            // เพิ่มฟิลด์ UserProfile ถ้า API ต้องการ (อาจเป็น object)
            userProfile: {
                userID: selectedUser.userID,
                firstname: newFirstName.trim(),
                lastname: newLastName.trim(),
                email: newEmail.trim()
            }
        };
    
        setIsLoading(true);
        try {
            const apiUrl = `https://localhost:7294/api/User/UpdateUserProfilebyAdmin?UserID=${selectedUser.userID}`;
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updatedUserData)
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Update failed: ${errorText}`);
            }
    
            // อัพเดท state ท้องถิ่น
            setUsers(users.map(user =>
                user.userID === selectedUser.userID ? { ...user, ...updatedUserData } : user
            ));
            setModalMessage('การปรับปรุงข้อมูลผู้ใช้สำเร็จ');
            setModalShow(true);
            resetUserFields();
        } catch (error) {
            console.error('Error updating profile:', error);
            setModalMessage(`ไม่สามารถอัพเดทข้อมูลได้: ${error.message}`);
            setModalShow(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddUser = () => {
        if (!newName || !newPassword || !newFirstName || !newLastName || !newEmail || !selectedRoleId) {
            setModalMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
            setModalShow(true);
            return;
        }

        if (!validateEmail(newEmail)) {
            setModalMessage('รูปแบบอีเมลไม่ถูกต้อง');
            setModalShow(true);
            return;
        }

        if (users.some(user => user.username === newName.trim())) {
            setUsernameError("ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว");
            setUsernameErrorModalShow(true);
            return;
        }

        if (users.some(user => user.email === newEmail.trim())) {
            setModalMessage("อีเมลนี้มีอยู่ในระบบแล้ว");
            setModalShow(true);
            return;
        }

        const newUser = {
            username: newName.trim(),
            password: newPassword,
            roleId: selectedRoleId === "6" ? newOtherRole : parseInt(selectedRoleId),
            createdAt: new Date().toISOString(),
            firstname: newFirstName.trim(),
            lastname: newLastName.trim(),
            email: newEmail.trim(),
            isActive: isNewUserActive
        };

        setTempNewUser(newUser);
        setConfirmAddModalShow(true);
    };

    const confirmAddUser = async () => {
        setConfirmAddModalShow(false);
        if (!tempNewUser) return;

        setIsLoading(true);
        try {
            const response = await fetch("https://localhost:7294/api/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(tempNewUser)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Registration failed: ${errorText}`);
            }

            const newUserWithId = await response.json();
            await fetchUsers();

            setSuccessMessage(
                `การเพิ่มผู้ใช้สำเร็จ:\nชื่อผู้ใช้: ${newUserWithId.username}\nชื่อจริง: ${newUserWithId.firstname}\nนามสกุล: ${newUserWithId.lastname}`
            );
            setShowSuccessMessage(true);
            resetUserFields();
            setCurrentPage(1);

            setTimeout(() => setShowSuccessMessage(false), 5000);
        } catch (error) {
            console.error("Error adding user:", error);
            setModalMessage(`ไม่สามารถเพิ่มผู้ใช้ได้: ${error.message}`);
            setModalShow(true);
        } finally {
            setIsLoading(false);
        }
    };

    const resetUserFields = () => {
        setSelectedUser(null);
        setNewName("");
        setNewEmail("");
        setNewFirstName("");
        setNewLastName("");
        setNewPassword("");
        setSelectedRoleId("");
        setSelectedRoleName("");
        setNewOtherRole("");
        setIsEditing(false);
        setIsAdding(false);
        setUsernameError("");
        setIsNewUserActive(true);
    };

    const handleCancel = () => {
        resetUserFields();
        setSearchTerm("");
        setCurrentPage(1);
    };

    const handleToggleStatus = async (user) => {
        const isUserNowActive = !user.isActive;
        setIsLoading(true);
        try {
            const response = await fetch(`https://localhost:7294/api/users/${user.userID}/toggle-status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ isActive: isUserNowActive })
            });

            if (!response.ok) throw new Error('Failed to toggle status');

            setUsers(users.map(u =>
                u.userID === user.userID ? { ...u, isActive: isUserNowActive } : u
            ));
            setModalMessage(`สถานะของผู้ใช้ ${user.username} เปลี่ยนเป็น ${isUserNowActive ? 'ใช้งาน' : 'ไม่ใช้งาน'}`);
            setModalShow(true);
        } catch (error) {
            console.error("Error toggling status:", error);
            setModalMessage('ไม่สามารถเปลี่ยนสถานะได้');
            setModalShow(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = (user) => {
        if (user.userID === currentUserID) {
            setModalMessage('ไม่สามารถลบข้อมูลบัญชีของตนเองได้');
            setModalShow(true);
            return;
        }
        setUserToDelete(user);
        setShowDeleteConfirmation(true);
    };

    const confirmDeleteUser = async () => {
        if (!userToDelete) return;
        setShowDeleteConfirmation(false);
        setIsLoading(true);

        try {
            const response = await fetch(`https://localhost:7294/api/users/${userToDelete.userID}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Delete failed: ${errorText}`);
            }

            setUsers(users.filter(user => user.userID !== userToDelete.userID));
            setModalMessage('การลบผู้ใช้สำเร็จ');
            setModalShow(true);
            setUserToDelete(null);
        } catch (error) {
            console.error("Error deleting user:", error);
            setModalMessage(`ไม่สามารถลบผู้ใช้ได้: ${error.message}`);
            setModalShow(true);
        } finally {
            setIsLoading(false);
        }
    };

    const renderEditUserSection = () => (
        <div ref={editSectionRef} className="my-4 p-3 border border-secondary rounded">
            {showSuccessMessage ? (
                <div className="alert alert-success">
                    {successMessage.split("\n").map((line, index) => (
                        <React.Fragment key={index}>{line}<br /></React.Fragment>
                    ))}
                </div>
            ) : isAdding ? (
                <>
                    <h5>เพิ่มข้อมูลผู้ใช้ใหม่</h5>
                    <Row>
                        <Col md={6} className="mb-2">
                            <Form.Group controlId="formUsername">
                                <Form.Label>ชื่อผู้ใช้</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newName}
                                    onChange={(e) => {
                                        setNewName(e.target.value);
                                        setUsernameError("");
                                    }}
                                    isInvalid={!!usernameError}
                                />
                                <Form.Control.Feedback type="invalid">{usernameError}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6} className="mb-2">
                            <Form.Group controlId="formPassword">
                                <Form.Label>รหัสผ่าน</Form.Label>
                                <div style={{ position: 'relative' }}>
                                    <Form.Control
                                        type={showPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <span
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ cursor: 'pointer', position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}
                                    >
                                        {showPassword ? '👁️' : '👁️‍🗨️'}
                                    </span>
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} className="mb-2">
                            <Form.Group controlId="formFirstName">
                                <Form.Label>ชื่อจริง</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newFirstName}
                                    onChange={(e) => setNewFirstName(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6} className="mb-2">
                            <Form.Group controlId="formLastName">
                                <Form.Label>นามสกุล</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newLastName}
                                    onChange={(e) => setNewLastName(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} className="mb-2">
                            <Form.Group controlId="formEmail">
                                <Form.Label>อีเมล</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6} className="mb-2">
                            <Form.Group controlId="formRole">
                                <Form.Label>ตำแหน่ง</Form.Label>
                                <Form.Select
                                    value={selectedRoleId}
                                    onChange={(e) => {
                                        const roleId = e.target.value;
                                        setSelectedRoleId(roleId);
                                        setSelectedRoleName(roles.find(r => r.id === parseInt(roleId))?.name || "");
                                        if (roleId !== "6") setNewOtherRole("");
                                    }}
                                >
                                    <option value="">เลือกตำแหน่ง</option>
                                    {roles.map(role => (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                </Form.Select>
                                {selectedRoleId === "6" && (
                                    <Form.Control
                                        className="mt-2"
                                        type="text"
                                        placeholder="ระบุตำแหน่งอื่น"
                                        value={newOtherRole}
                                        onChange={(e) => setNewOtherRole(e.target.value)}
                                    />
                                )}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button variant="primary" onClick={handleAddUser} disabled={isLoading}>
                        {isLoading ? 'กำลังบันทึก...' : 'บันทึกข้อมูลผู้ใช้'}
                    </Button>
                    <Button variant="secondary" onClick={handleCancel} className="ms-2" disabled={isLoading}>
                        ยกเลิก
                    </Button>
                </>
            ) : isEditing ? (
                <>
                    <h5>แก้ไขข้อมูลผู้ใช้: {newName}</h5>
                    <Row>
                        <Col md={6} className="mb-2">
                            <Form.Group controlId="formFirstName">
                                <Form.Label>ชื่อจริง</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newFirstName}
                                    onChange={(e) => setNewFirstName(e.target.value)}
                                    disabled={!selectedUser?.isActive || isLoading}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6} className="mb-2">
                            <Form.Group controlId="formLastName">
                                <Form.Label>นามสกุล</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newLastName}
                                    onChange={(e) => setNewLastName(e.target.value)}
                                    disabled={!selectedUser?.isActive || isLoading}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} className="mb-2">
                            <Form.Group controlId="formEmail">
                                <Form.Label>อีเมล</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    disabled={!selectedUser?.isActive || isLoading}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6} className="mb-2">
                            <Form.Group controlId="formRole">
                                <Form.Label>ตำแหน่ง</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedRoleName}
                                    readOnly
                                    style={{ backgroundColor: '#e9ecef' }}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button variant="primary" onClick={handleSave} disabled={!selectedUser?.isActive || isLoading}>
                        {isLoading ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                    </Button>
                    <Button variant="secondary" onClick={handleCancel} className="ms-2" disabled={isLoading}>
                        ยกเลิก
                    </Button>
                </>
            ) : (
                <Button variant="success" onClick={() => setIsAdding(true)} disabled={isLoading}>
                    เพิ่มผู้ใช้ใหม่
                </Button>
            )}
        </div>
    );

    const renderUserTable = () => (
        <Table striped bordered hover variant="light">
            <thead>
                <tr>
                    <th>ลำดับ</th>
                    <th>ชื่อผู้ใช้</th>
                    <th>ชื่อจริง</th>
                    <th>นามสกุล</th>
                    <th>อีเมล</th>
                    <th>ตำแหน่ง</th>
                    <th>สถานะ</th>
                    <th>การดำเนินการ</th>
                </tr>
            </thead>
            <tbody>
                {filteredUsers.slice((currentPage - 1) * 10, currentPage * 10).map((user, index) => (
                    <tr key={user.userID}>
                        <td>{(currentPage - 1) * 10 + index + 1}</td>
                        <td>{user.username}</td>
                        <td>{user.firstname}</td>
                        <td>{user.lastname}</td>
                        <td>{user.email}</td>
                        <td>{user.roleName || "ไม่ระบุ"}</td>
                        <td>
                            <Form.Check
                                type="switch"
                                id={`status-switch-${user.userID}`}
                                label={user.isActive ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                                checked={user.isActive}
                                onChange={() => handleToggleStatus(user)}
                                disabled={isLoading}
                            />
                        </td>
                        <td>
                            <Button
                                variant="warning"
                                onClick={() => handleEditUser(user.userID)}
                                disabled={!user.isActive || isLoading}
                                className="me-2"
                            >
                                แก้ไข
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => handleDeleteUser(user)}
                                disabled={!user.isActive || isLoading}
                            >
                                ลบ
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );

    const renderPagination = () => (
        <Pagination className="my-3">
            <Pagination.Prev
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || isLoading}
            />
            {Array.from({ length: Math.ceil(filteredUsers.length / 10) }, (_, index) => (
                <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => setCurrentPage(index + 1)}
                    disabled={isLoading}
                >
                    {index + 1}
                </Pagination.Item>
            ))}
            <Pagination.Next
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredUsers.length / 10)))}
                disabled={currentPage === Math.ceil(filteredUsers.length / 10) || isLoading}
            />
        </Pagination>
    );

    return (
        <Container>
            <h1 className="my-4">รายการข้อมูลผู้ใช้</h1>
            {isLoading && <div className="text-center">กำลังโหลด...</div>}
            <Row className="mb-3">
                <Col md={4}>
                    <div className="input-group">
                        <span className="input-group-text"><FaSearch /></span>
                        <Form.Control
                            type="text"
                            placeholder="ค้นหาข้อมูลผู้ใช้"
                            value={searchTerm}
                            onChange={handleSearch}
                            disabled={isLoading}
                        />
                    </div>
                </Col>
                <Col md={4}>
                    <Form.Select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        disabled={isLoading}
                    >
                        <option value="All">ทุกสถานะ</option>
                        <option value="Open">ใช้งาน</option>
                        <option value="Closed">ไม่ใช้งาน</option>
                    </Form.Select>
                </Col>
                <Col md={4}>
                    <Form.Select
                        value={selectedRoleFilter}
                        onChange={(e) => setSelectedRoleFilter(e.target.value)}
                        disabled={isLoading}
                    >
                        <option value="">ทุกตำแหน่ง</option>
                        {roles.map((role) => (
                            <option key={role.id} value={role.name}>{role.name}</option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>
            {renderEditUserSection()}
            {renderUserTable()}
            {renderPagination()}

            <Modal show={modalShow} onHide={() => setModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>ผลการดำเนินการ</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModalShow(false)}>
                        ปิด
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={confirmAddModalShow} onHide={() => setConfirmAddModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>ยืนยันการเพิ่มข้อมูลผู้ใช้</Modal.Title>
                </Modal.Header>
                <Modal.Body>ต้องการบันทึกข้อมูลผู้ใช้นี้หรือไม่?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setConfirmAddModalShow(false)}>
                        ยกเลิก
                    </Button>
                    <Button variant="primary" onClick={confirmAddUser} disabled={isLoading}>
                        ยืนยัน
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>ยืนยันการลบข้อมูล</Modal.Title>
                </Modal.Header>
                <Modal.Body>แน่ใจหรือไม่ว่าต้องการลบผู้ใช้ {userToDelete?.username}?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>
                        ยกเลิก
                    </Button>
                    <Button variant="danger" onClick={confirmDeleteUser} disabled={isLoading}>
                        ลบ
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={usernameErrorModalShow} onHide={() => setUsernameErrorModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>ข้อผิดพลาด</Modal.Title>
                </Modal.Header>
                <Modal.Body>{usernameError}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setUsernameErrorModalShow(false)}>
                        ปิด
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Member;