import React, { useState, useEffect } from "react";

const API_URL = ""; // ใส่ URL API ของคุณที่นี่

const EquipmentPage = () => {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({
        itemsID: '',
        image: '',
        itemsName: '',
        descriptions: '',
        itemquantity: '',
        adddate: '',
        CategoryID: '',
    });

    const [isEdit, setEdit] = useState(false);
    const [itemIdToEdit, setItemIdToEdit] = useState(null);

    const [currentPageItem, setCurrentPageItem] = useState(1);
    const itemPerPage = 10;

    // Fetch items when component mounts
    useEffect(() => {
        fetch(API_URL)
            .then((res) => res.json())
            .then((response) => {
                setItems(response.data || []);
            })
            .catch((err) => console.error("Error fetching items:", err));
    }, []);

    const handleItems = () => {
        if (!newItem.itemsName || !newItem.descriptions || !newItem.itemquantity || !newItem.CategoryID) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        if (isEdit) {
            // Editing an existing item
            fetch(`${API_URL}/${itemIdToEdit}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newItem),
            })
                .then((res) => res.json())
                .then((response) => {
                    setItems((prevItems) =>
                        prevItems.map((item) =>
                            item.itemsID === itemIdToEdit ? response.data : item
                        )
                    );
                    setEdit(false);
                    setItemIdToEdit(null);
                    setNewItem({
                        itemsID: '',
                        image: '',
                        itemsName: '',
                        descriptions: '',
                        itemquantity: '',
                        adddate: '',
                        CategoryID: '',
                    });
                })
                .catch((err) => console.error("Error updating item:", err));
        } else {
            // Adding a new item
            fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newItem),
            })
                .then((res) => res.json())
                .then((response) => {
                    setItems((prevItems) => [...prevItems, response.data]);
                    setNewItem({
                        itemsID: '',
                        image: '',
                        itemsName: '',
                        descriptions: '',
                        itemquantity: '',
                        adddate: '',
                        CategoryID: '',
                    });
                })
                .catch((err) => console.error("Error adding item:", err));
        }
    };

    const handleEdit = (item) => {
        setEdit(true);
        setItemIdToEdit(item.itemsID);
        setNewItem(item);
    };

    const handleCancelEdit = () => {
        setEdit(false);
        setItemIdToEdit(null);
        setNewItem({
            itemsID: '',
            image: '',
            itemsName: '',
            descriptions: '',
            itemquantity: '',
            adddate: '',
            CategoryID: '',
        });
    };

    return (
        <div>
            <h1>Equipment Management</h1>
            <form onSubmit={(e) => e.preventDefault()}>
                <input
                    type="text"
                    placeholder="Item Name"
                    value={newItem.itemsName}
                    onChange={(e) => setNewItem({ ...newItem, itemsName: e.target.value })}
                />
                <textarea
                    placeholder="Description"
                    value={newItem.descriptions}
                    onChange={(e) => setNewItem({ ...newItem, descriptions: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={newItem.itemquantity}
                    onChange={(e) => setNewItem({ ...newItem, itemquantity: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Category ID"
                    value={newItem.CategoryID}
                    onChange={(e) => setNewItem({ ...newItem, CategoryID: e.target.value })}
                />
                <button onClick={handleItems}>{isEdit ? "Update Item" : "Add Item"}</button>
                {isEdit && <button onClick={handleCancelEdit}>Cancel</button>}
            </form>
            <ul>
                {items.map((item) => (
                    <li key={item.itemsID}>
                        {item.itemsName} - {item.descriptions}
                        <button onClick={() => handleEdit(item)}>Edit</button>
                        {/* Add delete button if needed */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EquipmentPage;
