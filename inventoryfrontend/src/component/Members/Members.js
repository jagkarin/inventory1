import React, { useState, useEffect } from 'react';
import './Members.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:2000/api/users';

function MembersComponent() {
    const navigate = useNavigate();
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [newEmployeeId, setNewEmployeeId] = useState(1);
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPosition, setNewPosition] = useState('Select Position');
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [editingMessage, setEditingMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const recordsPerPage = 5;
    const positions = ['Select Position', 'Admin', 'Developer', 'ติดตั้ง'];
    const [newlyAddedUserIds, setNewlyAddedUserIds] = useState([]);

    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        
        // Check if the logged user is either Developer or Installer
        if (loggedUser && (loggedUser.Position === 'Developer' || loggedUser.Position === 'ติดตั้ง')) {
            // Check if the user has already seen the alert
            const hasSeenAlert = localStorage.getItem('hasSeenAccessAlert');

            if (!hasSeenAlert) {
                alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
                localStorage.setItem('hasSeenAccessAlert', 'true'); // Mark that the alert has been seen
            }

            navigate('/'); // Redirect to the homepage or appropriate page
        }

        const fetchUsers = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setUserList(data);
                const maxEmployeeId = data.length > 0 ? Math.max(...data.map(user => user['Employee ID'])) : 0;
                setNewEmployeeId(maxEmployeeId + 1);
            } catch (err) {
                console.error('Fetch error:', err);
                setError('Unable to load members data.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
        const intervalId = setInterval(fetchUsers, 30000);
        return () => clearInterval(intervalId);
    }, [navigate]);

    // Inactivity Timer Logic
    useEffect(() => {
        let inactivityTimer;

        const resetTimer = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                window.location.reload(); // Refresh the page after inactivity
            }, 300000); // 5 minutes in milliseconds
        };

        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keypress', resetTimer);
        window.addEventListener('click', resetTimer);
        window.addEventListener('scroll', resetTimer);

        resetTimer();

        return () => {
            clearTimeout(inactivityTimer);
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keypress', resetTimer);
            window.removeEventListener('click', resetTimer);
            window.removeEventListener('scroll', resetTimer);
        };
    }, []);

    const handleAddUser = async () => {
        if (!newUsername || !newPassword || newPosition === 'Select Position') {
            setError('Please fill all fields');
            return;
        }

        const doesUsernameExist = userList.some(user => user.Username === newUsername);
        if (doesUsernameExist) {
            alert('This Username already exists!');
            return;
        }

        const userPayload = {
            'Employee ID': newEmployeeId,
            Username: newUsername,
            Password: newPassword,
            Status: 'Active',
            Position: newPosition,
        };

        setLoading(true);
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userPayload),
            });
            if (!response.ok) throw new Error('Failed to add user');
            const data = await response.json();

            setUserList(prevUserList => [data, ...prevUserList]);
            setNewlyAddedUserIds(prevIds => [data['Employee ID'], ...prevIds]);

            setShowSuccessAlert(true);
            handleClearForm();

            setTimeout(() => {
                setNewlyAddedUserIds(prevIds => prevIds.filter(id => id !== data['Employee ID']));
            }, 3000);
        } catch (error) {
            console.error('Error saving user data:', error);
            setError('Unable to save user data.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditUser = async () => {
        const doesUsernameExist = userList.some(user =>
            user.Username === newUsername && user['Employee ID'] !== currentUser['Employee ID']
        );

        if (doesUsernameExist) {
            alert('This Username already exists!');
            return;
        }

        const updatedUser = {
            'Employee ID': currentUser['Employee ID'],
            Username: newUsername,
            Password: newPassword,
            Status: currentUser.Status,
            Position: newPosition,
        };

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/${currentUser['Employee ID']}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            });
            if (!response.ok) throw new Error('Failed to update user');
            const data = await response.json();
            setUserList(userList.map(user => (user['Employee ID'] === currentUser['Employee ID'] ? data : user)));
            setShowSuccessAlert(true);
            handleClearForm();
        } catch (error) {
            console.error('Error updating user data:', error);
            setError('Unable to update user data.');
        } finally {
            setLoading(false);
        }
    };

    const handleClearForm = () => {
        setNewUsername('');
        setNewPassword('');
        setNewPosition('Select Position');
        setIsEditMode(false);
        setCurrentUser(null);
        setError(null);
        setEditingMessage('');
        const maxEmployeeId = Math.max(...userList.map(user => user['Employee ID']), 0);
        setNewEmployeeId(maxEmployeeId + 1);
    };

    const handleUserSelect = (user) => {
        setNewEmployeeId(user['Employee ID']);
        setNewUsername(user.Username);
        setNewPassword(user.Password);
        setNewPosition(user.Position);
        setCurrentUser(user);
        setIsEditMode(true);
        setEditingMessage(`Editing user: ${user.Username}`);
    };

    const handleStatusToggle = async (user) => {
        const updatedStatus = user.Status === 'Active' ? 'Inactive' : 'Active';
        const updatedUser = { ...user, Status: updatedStatus };

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/${user['Employee ID']}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            });
            if (!response.ok) throw new Error('Failed to update user status');
            const data = await response.json();
            setUserList(userList.map(u => (u['Employee ID'] === user['Employee ID'] ? data : u)));
            setShowSuccessAlert(true);
        } catch (error) {
            console.error('Error updating user status:', error);
            setError('Unable to update user status.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const filteredUserList = userList.filter(user => {
        const matchesStatus =
            statusFilter === 'All' || user.Status === statusFilter;
        const matchesSearch =
            user['Employee ID'].toString().includes(searchQuery) ||
            user.Username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.Status.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.Position.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const startIndex = currentPage * recordsPerPage;
    const currentRecords = filteredUserList.slice(startIndex, startIndex + recordsPerPage);
    const totalPages = Math.ceil(filteredUserList.length / recordsPerPage);

    const isNewlyAdded = (userId) => newlyAddedUserIds.includes(userId);

    return (
        <div className="content-wrapper">
            <section className="content">
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h3>User Management</h3>
                    </div>

                    <div className="card-body">
                        {isEditMode && <Alert variant="info">{editingMessage}</Alert>}

                        <div className="d-flex">
                            <div className="form-group mr-2">
                                <label>Employee ID</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Employee ID"
                                    value={newEmployeeId}
                                    disabled // Make it read-only
                                />
                            </div>
                            <div className="form-group mr-2">
                                <label>Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Username"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                />
                            </div>
                            <div className="form-group mr-2">
                                <label>Password</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div className="form-group mr-2">
                                <label>Position</label>
                                <select
                                    className="form-control"
                                    value={newPosition}
                                    onChange={(e) => setNewPosition(e.target.value)}
                                >
                                    {positions.map((position, index) => (
                                        <option key={index} value={position}>{position}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <button 
                            onClick={isEditMode ? handleEditUser : handleAddUser}
                            className="btn btn-success" 
                            disabled={!newUsername || !newPassword || newPosition === 'Select Position'}
                        >
                            {isEditMode ? 'Update User' : 'Add User'}
                        </button>
                        <button onClick={handleClearForm} className="btn btn-secondary">Clear</button>
                    </div>

                    <div className="card-body">
                        <div className="ml-3 d-flex align-items-center">
                            <select
                                className="form-control mr-2"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="All">All</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="ค้นหา"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="card-body">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Employee ID</th>
                                    <th>Username</th>
                                    <th>Password</th>
                                    <th>Status</th>
                                    <th>Position</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRecords.map(user => (
                                    <tr 
                                        key={user['Employee ID']} 
                                        className={isNewlyAdded(user['Employee ID']) ? 'highlight' : ''}
                                    >
                                        <td>{user['Employee ID']}</td>
                                        <td>{user.Username}</td>
                                        <td>{user.Password}</td>
                                        <td 
                                            onClick={() => handleStatusToggle(user)} 
                                            style={{ cursor: 'pointer', color: user.Status === 'Active' ? 'green' : 'red' }}
                                        >
                                            {user.Status}
                                        </td>
                                        <td>{user.Position}</td>
                                        <td>
                                            <button onClick={() => handleUserSelect(user)} className="btn btn-warning">Edit</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination Controls */}
                        <div className="d-flex justify-content-between my-3">
                            <button 
                                className="btn btn-secondary" 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                                disabled={currentPage === 0}
                            >
                                ย้อนกลับ
                            </button>
                            <span className="align-self-center">Page {currentPage + 1} of {totalPages}</span>
                            <button 
                                className="btn btn-secondary" 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                                disabled={currentPage >= totalPages - 1}
                            >
                                ถัดไป
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            {showSuccessAlert && <Alert variant="success">Operation completed successfully!</Alert>}
        </div>
    );
}

export default MembersComponent;