import React, { useEffect, useState } from "react";
//import "./request.css"; // สำหรับจัดการ CSS

const API_URL = "https://localhost:7294/api/Product";

const RequestPage = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState({
        productID: "",
        status: "",
        company: "",
        category: "",
    });

    // ดึงข้อมูลสินค้าจาก API
    useEffect(() => {
        fetch(`${API_URL}/GetAllProduct`)
            .then((res) => res.json())
            .then((data) => {
                if (data.responseCode === "200") {
                    setProducts(data.data); // บันทึกข้อมูลสินค้า
                } else {
                    console.error("Error fetching products:", data.message);
                }
            })
            .catch((err) => console.error(err));
    }, []);

    // จัดการค้นหาสินค้า
    const handleSearch = () => {
        console.log("Search with query:", searchQuery);
        // เรียก API ที่รองรับการค้นหาด้วย query parameters
    };

    // จัดการปุ่มรีเซ็ต
    const handleReset = () => {
        setSearchQuery({
            productID: "",
            status: "",
            company: "",
            category: "",
        });
    };

    return (
        <div className="product-list-page">
            <h1>รายการอุปกรณ์</h1>
            {/* ส่วนค้นหาข้อมูล */}
            <div className="search-container">
                <div className="search-fields">
                    <input
                        type="text"
                        placeholder="รหัสอุปกรณ์"
                        value={searchQuery.productID}
                        onChange={(e) =>
                            setSearchQuery({ ...searchQuery, productID: e.target.value })
                        }
                    />
                    <select
                        value={searchQuery.status}
                        onChange={(e) =>
                            setSearchQuery({ ...searchQuery, status: e.target.value })
                        }
                    >
                        <option value="">กรุณาเลือก</option>
                        <option value="available">พร้อมใช้งาน</option>
                        <option value="unavailable">ไม่พร้อมใช้งาน</option>
                    </select>
                    <select
                        value={searchQuery.company}
                        onChange={(e) =>
                            setSearchQuery({ ...searchQuery, company: e.target.value })
                        }
                    >
                        <option value="">กรุณาเลือก</option>
                        <option value="บริษัท A">บริษัท A</option>
                        <option value="บริษัท B">บริษัท B</option>
                    </select>
                    <select
                        value={searchQuery.category}
                        onChange={(e) =>
                            setSearchQuery({ ...searchQuery, category: e.target.value })
                        }
                    >
                        <option value="">กรุณาเลือก</option>
                        <option value="อิเล็กทรอนิกส์">อิเล็กทรอนิกส์</option>
                        <option value="เครื่องเขียน">เครื่องเขียน</option>
                    </select>
                </div>
                <div className="search-buttons">
                    <button className="btn-reset" onClick={handleReset}>
                        ล้าง
                    </button>
                    <button className="btn-search" onClick={handleSearch}>
                        ค้นหา
                    </button>
                </div>
            </div>
            {/* ตารางแสดงข้อมูลสินค้า */}
            <table className="product-table">
                <thead>
                    <tr>
                        <th>รหัสอุปกรณ์</th>
                        <th>ชื่ออุปกรณ์</th>
                        <th>ประเภท</th>
                        <th>จำนวน</th>
                        <th>เพิ่ม</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <tr key={product.productsID}>
                                <td>{product.productsID}</td>
                                <td>{product.productsName}</td>
                                <td>{product.categoriesName}</td>
                                <td>{product.quantity}</td>
                                <td>
                                    <button className="btn-add">เพิ่ม</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="no-data">
                                ไม่มีข้อมูล
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default RequestPage;
