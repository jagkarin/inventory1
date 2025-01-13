import React, { useState } from 'react';
import './css/ProductList.css';

const ProductList = ({ products = [], editProduct, deleteProduct }) => {
    const [query, setQuery] = useState('');

    // ค้นหาสินค้าจาก query
    const filteredProducts = products.filter((product) =>
        product.productsName?.toLowerCase().includes(query.toLowerCase())
    );

    const handleProductEdit = (product, actionType) => {
        const confirmMessage =
            actionType === 'edit'
                ? `ยืนยันที่จะแก้ไขสินค้า ${product.productsName || 'ไม่มีชื่อสินค้า'}`
                : `ยืนยันที่จะลบสินค้า ${product.productsName || 'ไม่มีชื่อสินค้า'}`;
        if (window.confirm(confirmMessage)) {
            if (actionType === 'edit') {
                editProduct(product);
            } else if (actionType === 'delete') {
                deleteProduct(product.productsID);
            }
        }
    };

    return (
        <div className="product-list">
            <h2>Product List</h2>

            <div className="searchh-container">
                <div className="searchh-wrapper">
                    <input
                        type="text"
                        className="searchh-input"
                        placeholder="ค้นหาสินค้าของคุณ..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-container">
                <div className="table-header">
                    <div className="table-column">รหัสสินค้า</div>
                    <div className="table-column"></div>
                    <div className="table-column">ชื่อสินค้า</div>
                    <div className="table-column">ประเภท</div>
                    <div className="table-column">จำนวน</div>
                    <div className="table-column">การจัดการ</div>
                </div>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <div key={product.productsID} className="table-row">
                            <div className="table-column">{product.productsID}</div>
                            <div className="table-column">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt="Product"
                                        width="100"
                                        height="100"
                                    />
                                ) : (
                                    <span>ไม่มีรูปภาพ</span>
                                )}
                            </div>
                            <div className="table-column">{product.productsName}</div>
                            <div className="table-column">{product.CategoriesName}</div>
                            <div className="table-column">{product.quantity}</div>
                            <div className="table-column">
                                <button
                                    className="btnpro btnpro-edit"
                                    onClick={() => handleProductEdit(product, 'edit')}
                                >
                                    แก้ไข
                                </button>
                                <button
                                    className="btnpro btnpro-danger"
                                    onClick={() => handleProductEdit(product, 'delete')}
                                >
                                    ลบ
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-products">ไม่พบสินค้า</div>
                )}
            </div>
        </div>
    );
};

export default ProductList;
