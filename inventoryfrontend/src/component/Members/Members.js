import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserDetails from './UserDetails';
import EditUser from './EditUser';
import AddUser from './AddUser';
import { Alert } from 'react-bootstrap';
import { FaUserCheck, FaUserSlash } from 'react-icons/fa';
import ViewHistory from './ViewHistory';

function MembersComponent() {
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [statusFilter, setStatusFilter] = useState('All');
    const [showViewHistoryModal, setShowViewHistoryModal] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:2000/api/users');
                setUserList(response.data);
            } catch (err) {
                console.error('Fetch error:', err);
                setError('Unable to load members data');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUserList = userList.filter(user => {
        if (statusFilter === 'Active') {
            return user.Status === 'Active';
        } else if (statusFilter === 'Inactive') {
            return user.Status === 'Inactive';
        }
        return true;
    });

    const handleOpenModal = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleOpenEditModal = (user) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    const handleOpenAddModal = () => {
        setShowAddModal(true);
    };

    const handleViewHistory = (employeeId) => {
        setSelectedEmployeeId(employeeId);
        setShowViewHistoryModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedUser(null);
    };

    const handleCloseAddModal = () => {
        setShowAddModal(false);
    };

    const handleCloseViewHistory = () => {
        setShowViewHistoryModal(false);
        setSelectedEmployeeId(null);
    };

    const handleUpdateUser = (updatedUser) => {
        const updatedUserList = userList.map(user => 
            user['Employee ID'] === updatedUser['Employee ID'] ? updatedUser : user
        );
        setUserList(updatedUserList);
        handleCloseEditModal();
        handleSuccessAlert();
    };

    const handleAddUser = (newUser) => {
        const updatedUserList = [...userList, newUser];
        setUserList(updatedUserList);
        handleSuccessAlert();
    };

    const handleSuccessAlert = () => {
        setShowSuccessAlert(true);
        setTimeout(() => {
            setShowSuccessAlert(false);
        }, 3000);
    };

    const handleToggle = async (user) => {
        const updatedStatus = user.Status === 'Active' ? 'Inactive' : 'Active';
        const updatedUser = { ...user, Status: updatedStatus };

        try {
            await axios.put(`http://localhost:2000/api/users/${user['Employee ID']}`, updatedUser);
            const updatedUserList = userList.map(u => u['Employee ID'] === user['Employee ID'] ? updatedUser : u);
            setUserList(updatedUserList);
        } catch (error) {
            console.error('Error updating user status:', error);
            setError('Unable to update user status');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="content-wrapper">
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-12">
                            <h1>Members</h1>
                        </div>
                    </div>
                </div>
            </section>

            <section className="content">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Member List</h3>
                        <div className="float-right">
                            <button className="btn btn-primary" onClick={handleOpenAddModal}>
                                Add User
                            </button>
                            <select className="form-select d-inline-block mx-2" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                <option value="All">All</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-striped projects">
                                <thead className="thead-light">
                                    <tr>
                                        <th style={{ width: '20%' }}>Employee ID</th>
                                        <th style={{ width: '30%' }}>Username</th>
                                        <th style={{ width: '20%' }} className="text-center">Status</th>
                                        <th style={{ width: '30%' }} className="text-center">Position</th>
                                        <th style={{ width: '30%' }} className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUserList.map(user => (
                                        <tr key={user['Employee ID']}>
                                            <td 
                                                onMouseEnter={() => handleViewHistory(user['Employee ID'])} 
                                                onMouseLeave={handleCloseViewHistory}
                                            >
                                                {user['Employee ID']}
                                            </td>
                                            <td>{user.Username}</td>
                                            <td className="project-state text-center">
                                                <button
                                                    className={`btn btn-sm ${user.Status === 'Active' ? 'btn-success' : 'btn-danger'}`}
                                                    onClick={() => handleToggle(user)}
                                                >
                                                    {user.Status === 'Active' ? <FaUserCheck /> : <FaUserSlash />}
                                                    {user.Status}
                                                </button>
                                            </td>
                                            <td>{user.Position}</td>
                                            <td className="project-actions text-right">
                                                <div className="btn-group" role="group" aria-label="Basic example">
                                                    <button className="btn btn-outline-primary btn-sm" onClick={() => handleOpenModal(user)}>
                                                        View
                                                    </button>
                                                    <button className="btn btn-outline-info btn-sm" onClick={() => handleOpenEditModal(user)}>
                                                        Edit
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {showSuccessAlert && 
                <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible>
                    Edit successful!
                </Alert>
            }

            {showModal && selectedUser && (
                <UserDetails user={selectedUser} onClose={handleCloseModal} />
            )}

            {showEditModal && selectedUser && (
                <EditUser
                    user={selectedUser}
                    onUpdate={handleUpdateUser}
                    onClose={handleCloseEditModal}
                />
            )}

            {showAddModal && (
                <AddUser
                    onAdd={handleAddUser} 
                    onClose={handleCloseAddModal} 
                />
            )}

            {showViewHistoryModal && selectedEmployeeId && (
                <ViewHistory 
                    show={showViewHistoryModal} 
                    onClose={handleCloseViewHistory} 
                    employeeId={selectedEmployeeId} 
                />
            )}
        </div>
    );
}

export default MembersComponent;