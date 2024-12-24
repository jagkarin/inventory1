import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const API_URL = 'http://localhost:2000/api/users';

function AddUser({ onAdd, onClose }) {
    const [newUser, setNewUser] = useState({
        Username: '',
        'Employee ID': '',
        Position: '',
        Status: 'Active'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null); // Reset error state

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            if (!response.ok) {
                throw new Error('Failed to add user. Please try again.');
            }

            const userData = await response.json();
            onAdd(userData); // Call the parent function to add the user
            onClose(); // Close the modal after adding the user
        } catch (err) {
            setError(err.message); // Set the error message
        } finally {
            setLoading(false); // Stop loading after the request finishes
        }
    };

    return (
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter username"
                            name="Username"
                            value={newUser.Username}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formEmployeeId">
                        <Form.Label>Employee ID</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter employee ID"
                            name="Employee ID"
                            value={newUser['Employee ID']}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formPosition">
                        <Form.Label>Position</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter position"
                            name="Position"
                            value={newUser.Position}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formStatus">
                        <Form.Label>Status</Form.Label>
                        <Form.Control as="select" name="Status" value={newUser.Status} onChange={handleInputChange}>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </Form.Control>
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Adding...' : 'Add User'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default AddUser;