import React, { useState, useEffect } from 'react';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import './css/product.css';

const API_URL = 'https://localhost:7294/api/Product/GetAllProduct';

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        productsID: '',
        image: '',
        productsName: '',
        description: '',
        CategoriesName: '',
        quantity: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [productIdToEdit, setProductIdToEdit] = useState(null);

    // State สำหรับการแบ่งหน้า
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // ดึงข้อมูลสินค้าทั้งหมด
    useEffect(() => {
        fetch('https://localhost:7294/api/Product/GetAllProduct')
            .then((res) => res.json())
            .then((response) => {
                setProducts(response.data);
            })
            .catch((err) => console.error('Error fetching products:', err));
    }, []);

    // เพิ่มหรือแก้ไขสินค้า
    const handleProduct = () => {
        if (!newProduct.productsName || !newProduct.description || !newProduct.CategoriesName || !newProduct.quantity) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        if (isEditing) {
            fetch(`https://localhost:7294/api/Product/UpdateProduct?ProductsID=${productIdToEdit}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct),
            })
                .then((res) => res.json())
                .then(() => {
                    setProducts((prevProducts) =>
                        prevProducts.map((product) =>
                            product.productsID === productIdToEdit ? { ...product, ...newProduct } : product
                        )
                    );
                    resetForm();
                })
                .catch((err) => console.error('Error updating product:', err));
        } else {
            fetch(`${API_URL}/AddProduct`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct),
            })
                .then((res) => res.json())
                .then((response) => {
                    setProducts((prevProducts) => [...prevProducts, response.data]);
                    resetForm();
                })
                .catch((err) => console.error('Error adding product:', err));
        }
    };

    const resetForm = () => {
        setNewProduct({
            productsID: '',
            productsName: '',
            description: '',
            CategoriesName: '',
            quantity: '',
        });
        setIsEditing(false);
        setProductIdToEdit(null);
    };

    const editProduct = (product) => {
        setNewProduct(product);
        setIsEditing(true);
        setProductIdToEdit(product.productsID);
    };

    const deleteProduct = (id) => {
        fetch(`${API_URL}/DeleteProduct/${id}`, { method: 'DELETE' })
            .then((res) => res.json())
            .then(() => {
                setProducts((prevProducts) => prevProducts.filter((product) => product.productsID !== id));
            })
            .catch((err) => console.error('Error deleting product:', err));
    };

    // คำนวณรายการสินค้าในหน้าปัจจุบัน
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

    // ฟังก์ชันเปลี่ยนหน้า
    const nextPage = () => {
        if (currentPage < Math.ceil(products.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="inventory-container">
            <h1 className="inventory-header">Manage Products</h1>
            <ProductForm
                newProduct={newProduct}
                setNewProduct={setNewProduct}
                isEditing={isEditing}
                handleProduct={handleProduct}
                handleCancel={resetForm}
            />
            <ProductList
                products={currentItems} // แสดงเฉพาะสินค้าของหน้าปัจจุบัน
                editProduct={editProduct}
                deleteProduct={deleteProduct}
            />
            <div className="pagination-container">
    <button
        className="btn-pagination"
        onClick={prevPage}
        disabled={currentPage === 1}
    >
        ย้อนกลับ
    </button>
    <span>
        หน้า {currentPage} จาก {Math.ceil(products.length / itemsPerPage)}
    </span>
    <button
        className="btn-pagination"
        onClick={nextPage}
        disabled={currentPage === Math.ceil(products.length / itemsPerPage)}
    >
        หน้าถัดไป
    </button>
</div>

        </div>
    );
};

export default Inventory;
