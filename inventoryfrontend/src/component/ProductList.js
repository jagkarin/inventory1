import React, { useState } from "react";
import "./css/ProductList.css";

const ProductList = ({ products, editProduct, deleteProduct }) => {
    const [query, setQuery] = useState("");

    const filteredProducts = products.filter((product) =>
        product.productsName?.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="product-list">
            <h2>Product List</h2>

            {/* ช่องค้นหา */}
            <div className="search-container">
                <div className="search-wrapper">
                    <i className="search-icon fa fa-search"></i>
                    <input
                        type="text"
                        placeholder="ค้นหาสินค้า..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="search-input"
                    />
                    <link
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
    rel="stylesheet"
/>

                </div>
            </div>

            {/* ตารางสินค้า */}
            <div className="table-container">
                <div className="table-header">
                    <div className="table-column">รหัสสินค้า</div>
                    <div className="table-column">ชื่อสินค้า</div>
                    <div className="table-column">ประเภท</div>
                    <div className="table-column">จำนวน</div>
                    <div className="table-column"></div>
                </div>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <div key={product.productsID} className="table-row">
                            <div className="table-column">{product.productsID}</div>
                            <div className="table-column">{product.productsName || "ไม่มีชื่อสินค้า"}</div>
                            <div className="table-column">{product.categoriesName}</div>
                            <div className="table-column">{product.quantity}</div>
                            <div className="table-column">
                                <button
                                    className="btn btn-edit"
                                    onClick={() => editProduct(product)}
                                >
                                    แก้ไข
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => deleteProduct(product.productsID)}
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
