// BorrowedItemsData.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BorrowedItemsData({ employeeId }) {
    const [borrowedItems, setBorrowedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBorrowedItems = async () => {
        try {
            const response = await axios.get(`http://localhost:2000/api/withdraw/${employeeId}`);
            setBorrowedItems(response.data);
        } catch (error) {
            console.error('Error fetching borrowed items:', error);
            setError('Error fetching borrowed items');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBorrowedItems();
    }, [employeeId]);

    if (loading) {
        return <p>Loading borrowed items...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <>
            <h2>Borrowed Items Data</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #dddddd', padding: '8px' }}>Item Name</th>
                        <th style={{ border: '1px solid #dddddd', padding: '8px' }}>Quantity</th>
                        <th style={{ border: '1px solid #dddddd', padding: '8px' }}>Date Borrowed</th>
                    </tr>
                </thead>
                <tbody>
                    {borrowedItems.length > 0 ? (
                        borrowedItems.map(item => (
                            <tr key={item.id}>
                                <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{item.item_name}</td>
                                <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{item.quantity}</td>
                                <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{item.date_borrowed}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" style={{ textAlign: 'center', border: '1px solid #dddddd', padding: '8px' }}>
                                No borrowed items found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
}

export default BorrowedItemsData;