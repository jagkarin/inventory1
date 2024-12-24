import React, { useEffect, useState } from "react";
import "./css/request.css";

const API_URL = "https://localhost:7294/api/Product/GetAllProduct";

const RequestPage = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [isCartVisible, setIsCartVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);
    const [currentPageCart, setCurrentPageCart] = useState(1);
    const [cartPerPage] = useState(10);

    // ดึงข้อมูลสินค้าจาก API
    useEffect(() => {
        fetch(API_URL)
            .then((res) => res.json())
            .then((data) => {
                if (data.responseCode === "200") {
                    setProducts(data.data);
                } else {
                    console.error("Error fetching products:", data.message);
                }
            })
            .catch((err) => console.error(err));
    }, []);

    // ฟังก์ชันเพิ่มสินค้าลงในรถเข็น และลดจำนวนสินค้าในคลัง
    const handleAddToCart = (product) => {
        if (product.quantity > 0) {
            setCart((prevCart) => {
                const existingProduct = prevCart.find(
                    (item) => item.productsID === product.productsID
                );
                if (existingProduct) {
                    return prevCart.map((item) =>
                        item.productsID === product.productsID
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                } else {
                    return [...prevCart, { ...product, quantity: 1 }];
                }
            });

            setProducts((prevProducts) =>
                prevProducts.map((item) =>
                    item.productsID === product.productsID
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
            );
        } else {
            alert("สินค้าหมดแล้ว");
        }
    };

    // ฟังก์ชันลบสินค้าจากรถเข็น และคืนจำนวนสินค้าในคลัง
    const handleRemoveFromCart = (productsID) => {
        const productToRemove = cart.find((item) => item.productsID === productsID);
        if (productToRemove) {
            setProducts((prevProducts) =>
                prevProducts.map((item) =>
                    item.productsID === productToRemove.productsID
                        ? { ...item, quantity: item.quantity + productToRemove.quantity }
                        : item
                )
            );
        }

        setCart((prevCart) =>
            prevCart.filter((item) => item.productsID !== productsID)
        );
    };

    // ฟังก์ชันยืนยันการเบิกสินค้า
    const handleConfirmRequest = () => {
        const requestData = cart.map((item) => ({
            productsID: item.productsID,
            productsName: item.productsName,
            quantity: item.quantity,
            status: "Pending",
        }));

        fetch(`${API_URL}/RequestApproval`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.responseCode === "200") {
                    alert("ยืนยันการเบิกสินค้าเรียบร้อย! รอการอนุมัติ");
                    setCart([]);
                } else {
                    console.error("Error confirming request:", data.message);
                }
            })
            .catch((err) => console.error(err));
    };

    // Pagination Logic - Products
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const nextPage = () => {
        if (currentPage < Math.ceil(products.length / productsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Pagination Logic - Cart
    const indexOfLastCart = currentPageCart * cartPerPage;
    const indexOfFirstCart = indexOfLastCart - cartPerPage;
    const currentCart = cart.slice(indexOfFirstCart, indexOfLastCart);

    const nextPageCart = () => {
        if (currentPageCart < Math.ceil(cart.length / cartPerPage)) {
            setCurrentPageCart(currentPageCart + 1);
        }
    };

    const prevPageCart = () => {
        if (currentPageCart > 1) {
            setCurrentPageCart(currentPageCart - 1);
        }
    };

    return (
        <div className="request-page">
            <h1>รายการขอเบิกสินค้า</h1>

            <button
                className="cart-button"
                onClick={() => setIsCartVisible(!isCartVisible)}
            >
                🛒 รถเข็น ({cart.length})
            </button>

            {isCartVisible ? (
                <div className="cart-section">
                    <h2>รถเข็นของคุณ</h2>
                    {cart.length > 0 ? (
                        <>
                            <table className="cart-table">
                                <thead>
                                    <tr>
                                        <th>รหัสสินค้า</th>
                                        <th>ชื่อสินค้า</th>
                                        <th>จำนวน</th>
                                        <th>ลบ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentCart.map((item) => (
                                        <tr key={item.productsID}>
                                            <td>{item.productsID}</td>
                                            <td>{item.productsName}</td>
                                            <td>{item.quantity}</td>
                                            <td>
                                                <button
                                                    className="btn-remove"
                                                    onClick={() =>
                                                        handleRemoveFromCart(item.productsID)
                                                    }
                                                >
                                                    ลบ
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="confirm-button-container">
                                <button
                                    className="btn-confirm"
                                    onClick={handleConfirmRequest}
                                >
                                    ยืนยันการเบิกสินค้า
                                </button>
                                <div className="pagination-container">
                                    <button
                                        className="btn-pagination"
                                        onClick={prevPageCart}
                                        disabled={currentPageCart === 1}
                                    >
                                        ย้อนกลับ
                                    </button>
                                    <span>
                                        หน้า {currentPageCart} /{" "}
                                        {Math.ceil(cart.length / cartPerPage)}
                                    </span>
                                    <button
                                        className="btn-pagination"
                                        onClick={nextPageCart}
                                        disabled={
                                            currentPageCart ===
                                            Math.ceil(cart.length / cartPerPage)
                                        }
                                    >
                                        ถัดไป
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p>ไม่มีสินค้าในรถเข็น</p>
                    )}
                </div>
            ) : (
                <div className="product-list">
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>รหัสสินค้า</th>
                                <th>ชื่อสินค้า</th>
                                <th>ประเภท</th>
                                <th>จำนวนในคลัง</th>
                                <th>เพิ่ม</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProducts.map((product) => (
                                <tr key={product.productsID}>
                                    <td>{product.productsID}</td>
                                    <td>{product.productsName}</td>
                                    <td>{product.categoriesName}</td>
                                    <td>{product.quantity}</td>
                                    <td>
                                        <button
                                            className="btn-add"
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            เพิ่ม
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination-container">
                        <button
                            className="btn-pagination"
                            onClick={prevPage}
                            disabled={currentPage === 1}
                        >
                            ย้อนกลับ
                        </button>
                        <span>
                            หน้า {currentPage} /{" "}
                            {Math.ceil(products.length / productsPerPage)}
                        </span>
                        <button
                            className="btn-pagination"
                            onClick={nextPage}
                            disabled={
                                currentPage ===
                                Math.ceil(products.length / productsPerPage)
                            }
                        >
                            ถัดไป
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestPage;
