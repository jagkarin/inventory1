import React, { createContext, useState, useContext } from "react";

// สร้าง Context
const CartContext = createContext();

// สร้าง Provider สำหรับแชร์สถานะรถเข็น
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // ฟังก์ชันเพิ่มสินค้าในรถเข็น
    const addToCart = (product) => {
        setCart((prevCart) => [...prevCart, product]);
    };

    // ฟังก์ชันลบสินค้าออกจากรถเข็น
    const removeFromCart = (productID) => {
        setCart((prevCart) => prevCart.filter((item) => item.productsID !== productID));
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};

// Hook ใช้สำหรับดึงข้อมูลจาก CartContext
export const useCart = () => useContext(CartContext);
