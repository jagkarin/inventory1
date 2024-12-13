import React, { useState, useEffect } from 'react';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import './css/product.css';

const API_URL = 'https://localhost:7294/api/Product';

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        productsID: '',  // รหัสสินค้าจะถูกตั้งค่าจาก API
        productsName: '',  // ใช้ productsName แทน name
        description: '',
        //categoriesID: '',
        quantity: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [productIdToEdit, setProductIdToEdit] = useState(null);

    // ดึงข้อมูลสินค้าทั้งหมดเมื่อหน้าเว็บโหลด
    useEffect(() => {
        fetch('https://localhost:7294/api/Product/GetAllProduct')
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((response) => {
                console.log('API Response:', response);
                if (response.responseCode === '200') {
                    console.log(response.data);
                    setProducts(response.data);  // เก็บข้อมูลสินค้าใน state
                } else {
                    console.error('Failed to load products:', response.message);
                }
            })
            .catch((err) => console.error('Error fetching products:', err));
    }, []);

    // เพิ่มหรือแก้ไขสินค้า
    const handleProduct = () => {
        // ตรวจสอบว่าทุกฟิลด์ถูกกรอกครบถ้วน
        if (!newProduct.productsName || !newProduct.description || !newProduct.category || !newProduct.quantity) {
            alert('Please fill in all required fields.');
            return;
        }
    
        console.log(newProduct);
        if (isEditing) {
            // ดำเนินการอัปเดตสินค้า (PUT)
            fetch(`https://localhost:7294/api/Product/UpdateProduct?ProductsID=${productIdToEdit}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productsID: newProduct.productsID,
                    productsName: newProduct.productsName,  // ใช้ productsName แทน name
                    description: newProduct.description,
                   // categoriesID: newProduct.categoriesID,
                    quantity: newProduct.quantity,
                }),
            })
                .then((res) => res.json())
                .then((response) => {
                    if (response.responseCode === '200') {
                        setProducts((prevProducts) =>
                            prevProducts.map((product) =>
                                product.productsID === productIdToEdit ? { ...product, ...newProduct } : product
                            )
                        );
                        resetForm();
                    } else {
                        console.error('Failed to update product:', response.responseMessage || response.message);
                    }
                })
                .catch((err) => console.error('Error updating product:', err));
        } else {
            // ดำเนินการเพิ่มสินค้าใหม่ (POST)
            fetch(`https://localhost:7294/api/Product/AddProduct`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productsName: newProduct.productsName,  // ใช้ productsName แทน name
                    description: newProduct.description,
                    //categoriesID: newProduct.categoriesID,
                    quantity: newProduct.quantity,
                }),
            })
                .then((res) => res.json())
                .then((response) => {
                    if (response.responseCode === '200') {
                        setProducts((prevProducts) => [...prevProducts, response.data]);
                        resetForm();
                    } else {
                        console.error('Failed to add product:', response.message);
                    }
                })
                .catch((err) => console.error('Error adding product:', err));
        }
    };
    
    // ฟังก์ชัน Reset Form
    const resetForm = () => {
        setNewProduct({
            productsID: '',  // เริ่มต้นให้เป็นค่าว่าง
            productsName: '',  // ใช้ productsName แทน name
            description: '',
            //categoriesID: '',
            quantity: '',
        });
        setIsEditing(false);
        setProductIdToEdit(null);
    };

    // ฟังก์ชันแก้ไขสินค้า
    const editProduct = (product) => {
        setNewProduct({
            productsID: product.productsID,
            productsName: product.productsName,  // ใช้ productsName แทน name
            description: product.description,
            //categoriesID: product.categoriesID,    // หมายเหตุ: ตรวจสอบว่า categoriesName ใช้ใน API หรือไม่
            quantity: product.quantity,
        });
        setIsEditing(true);
        setProductIdToEdit(product.productsID);
    };

    // ลบสินค้า
    const deleteProduct = (id) => {
        fetch(`${API_URL}/DeleteProduct/${id}`, {
            method: 'DELETE',
        })
            .then((res) => res.json())
            .then((response) => {
                if (response.responseCode === '200') {
                    setProducts((prevProducts) => prevProducts.filter((product) => product.productsID !== id));
                } else {
                    console.error('Failed to delete product:', response.message);
                }
            })
            .catch((err) => console.error('Error deleting product:', err));
    };

    return (
        <div className="inventory-container">
            <h1 className="inventory-header">Manage Products</h1>
            <div className="inventory-content">
                <ProductForm
                    newProduct={newProduct}
                    setNewProduct={setNewProduct}
                    isEditing={isEditing}
                    handleProduct={handleProduct}
                />
                <ProductList
                    products={products}
                    editProduct={editProduct}
                    deleteProduct={deleteProduct}
                />
            </div>
        </div>
    );
};

export default Inventory;
