import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Spinner } from 'react-bootstrap';
import axios from 'axios';

const WithdrawalHistoryModal = ({ userId, show, onClose }) => {
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistoryData = async () => {
            setLoading(true); // Start loading
            try {
                const response = await axios.get(`http://localhost:2000/api/withdraw/${userId}`); // Adjusted endpoint
                setHistoryData(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        if (show) {
            fetchHistoryData();
        }
    }, [show, userId]);

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>ประวัติการเบิก</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="d-flex justify-content-center">
                        <Spinner animation="border" />
                    </div>
                ) : error ? (
                    <p>Error fetching data: {error.message}</p>
                ) : (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>รายการ</th>
                                <th>จำนวน</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historyData.length > 0 ? (
                                historyData.map((entry) => (
                                    <tr key={entry.id || entry['Withdraw ID']}> {/* Use appropriate unique ID */}
                                        <td>{entry.things}</td>
                                        <td>{entry.quantity}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="text-center">ไม่มีข้อมูลการเบิก</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    ปิด
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WithdrawalHistoryModal;