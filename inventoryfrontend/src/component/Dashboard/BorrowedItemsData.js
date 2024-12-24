import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:2000/api/withdraw'; // Define the API URL

function BorrowedItemsData({ employeeId }) {
    const [borrowedItems, setBorrowedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch borrowed items
    const fetchBorrowedItems = async () => {
        setLoading(true); // Start loading
        try {
            const response = await fetch(`${API_URL}/${employeeId}`); // Fetch from the API
            if (!response.ok) {
                throw new Error('Network response was not ok'); // Throw error if response is not okay
            }
            const data = await response.json(); // Parse JSON response
            setBorrowedItems(data); // Set borrowed items state
        } catch (error) {
            console.error('Error fetching borrowed items:', error);
            setError('Error fetching borrowed items'); // Set error state
        } finally {
            setLoading(false); // End loading
        }
    };

    // Use effect to fetch borrowed items whenever employeeId changes
    useEffect(() => {
        if (employeeId) {
            fetchBorrowedItems(); // Fetch borrowed items if employeeId exists
        }
    }, [employeeId]);

    // Render loading state
    if (loading) {
        return <p>Loading borrowed items...</p>;
    }

    // Render error state
    if (error) {
        return <p>{error}</p>;
    }
    
    // Render borrowed items table
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