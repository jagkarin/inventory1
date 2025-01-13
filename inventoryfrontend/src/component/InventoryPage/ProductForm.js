import React, { useState, useEffect } from "react";
import "./css/product.css";

const ProductForm = ({ newProduct, setNewProduct, isEditing, handleProduct, handleCancel }) => {
    const [image, setImage] = useState(newProduct?.image || ""); // เก็บ URL ของรูปภาพ
    const [preview, setPreview] = useState(newProduct?.image || ""); // สำหรับแสดงตัวอย่างของรูป

    // ฟังก์ชันสำหรับจับการเปลี่ยนแปลงข้อมูลในฟอร์ม
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct((prev) => ({ ...prev, [name]: value }));
    };

    // ฟังก์ชันสำหรับอัปโหลดรูปภาพ
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreview(imageUrl);
            setImage(file); // เก็บข้อมูลรูปภาพที่อัปโหลด
        }
    };

    // Reset states on cancel
    const handleCancelClick = () => {
    handleCancel(); // เรียกฟังก์ชันยกเลิกจาก props
    setNewProduct({ // รีเซ็ตข้อมูลฟอร์ม
        productsName: '',
        CategoriesName: '',
        quantity: 0,
        description: '',
        image: ''
    });
    setPreview(""); // รีเซ็ตการแสดงตัวอย่างรูป
    setImage(""); // รีเซ็ตข้อมูลรูปภาพ
};


    const product = newProduct || { 
        productsName: '', 
        CategoriesName: '', 
        quantity: 0, 
        description: '',
        image: ''
    };

    return (
        <div className="container">
            <h4 className="form-title">{isEditing ? 'Edit Product' : 'Add New Product'}</h4>
            <div className="form-grid">
                <div className="input-group">
                    <label htmlFor="id">รหัสสินค้า:</label>
                    <input
                        type="text"
                        id="id"
                        value={product.productsID || 'รหัสสินค้า. . .'}
                        readOnly
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="productsName"
                        value={product.productsName}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="CategoriesName">Category:</label>
                    <select
                        id="CategoriesName"
                        name="CategoriesName"
                        value={product.CategoriesName}
                        onChange={handleChange}
                    >
                        <option value="">กรุณาเลือก. . .</option>
                        <option value="electronics">Electronics</option>
                        <option value="furniture">Furniture</option>
                    </select>
                </div>
                <div className="input-group">
                    <label htmlFor="quantity">Quantity:</label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={product.quantity}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        rows="4"
                        value={product.description}
                        onChange={handleChange}
                    />
                </div>
                
                {/* ส่วนของการอัปโหลดรูปภาพ */}
                <div className="input-group">
                    <label htmlFor="image">Image:</label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {preview && (
                        <div className="image-preview">
                            <img src={preview} alt="Preview" width="100" height="100" />
                        </div>
                    )}
                </div>
            </div>

            <div className="btn-group">
                <button
                    type="button"
                    className="btnpro btn-success"
                    onClick={handleProduct}
                >
                    {isEditing ? 'แก้ไขสินค้า' : 'เพิ่มสินค้า'}
                </button>
                {isEditing || newProduct ? (
                    <button
                        type="button"
                        className="btnpro btn-danger"
                        onClick={handleCancelClick}
                    >
                        ยกเลิก
                    </button>
                ) : null}
            </div>
        </div>
    );
};

export default ProductForm;
