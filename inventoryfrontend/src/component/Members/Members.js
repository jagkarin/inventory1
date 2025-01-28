import React, { useEffect, useState } from 'react';
import { Container, ListGroup, Form, Button, Modal } from 'react-bootstrap';

const Member = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRoleID, setNewRoleID] = useState("");
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    fetch('https://localhost:7294/GetAllUserwithrole')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data.data)) {
          setUsers(data.data);
        } else {
          console.error('Invalid data format: Expected data to be an array', data);
        }
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStatus = (userID) => {
    setUsers(users.map(user =>
      user.userID === userID
        ? { ...user, isActive: !user.isActive }
        : user
    ));
  };

  const editUser = (userID) => {
    const user = users.find(u => u.userID === userID);
    setSelectedUser(user);
    setNewRoleID(user.roleID);
    setNewEmail(user.email);
    setShowModal(true);
  };

  const handleSave = () => {
    if (selectedUser) {
      setUsers(users.map(user =>
        user.userID === selectedUser.userID
          ? { ...user, roleID: newRoleID, email: newEmail }
          : user
      ));
      setShowModal(false);
    }
  };

  return (
    <Container>
      <h1 className="my-4">รายชื่อผู้ใช้</h1>

      {/* ช่องค้นหาผู้ใช้ */}
      <Form.Control
        type="text"
        placeholder="ค้นหาผู้ใช้"
        value={searchTerm}
        onChange={handleSearch}
        className="mb-3"
      />

      {/* รายชื่อผู้ใช้ */}
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <ListGroup variant="flush">
          {filteredUsers.map(user => (
            <ListGroup.Item key={user.userID}>
              <strong>{user.username}</strong><br />
              ตำแหน่ง (roleID): {user.roleID}<br />
              อีเมล: {user.email}<br />
              {/* ปุ่มเลื่อนเปิด/ปิดการใช้งาน */}
              <Form.Check
                type="switch"
                id={`custom-switch-${user.userID}`}
                label={user.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                checked={user.isActive}
                onChange={() => toggleStatus(user.userID)}
              /><br />
              {/* ปุ่มแก้ไขข้อมูล */}
              <Button variant="warning" onClick={() => editUser(user.userID)}>
                แก้ไข
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>

      {/* Modal สำหรับการแก้ไขข้อมูลผู้ใช้ */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>แก้ไขข้อมูลผู้ใช้</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>ตำแหน่ง (roleID)</Form.Label>
                <Form.Control
                  type="text"
                  value={newRoleID}
                  onChange={(e) => setNewRoleID(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>อีเมล</Form.Label>
                <Form.Control
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            ปิด
          </Button>
          <Button variant="primary" onClick={handleSave}>
            บันทึก
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Member;
