import React from "react";
import { useCart } from "./CartContext";

const CartPage = () => {
    const { cart, removeFromCart } = useCart();

    return (
        <div>
            <h1>รถเข็นของคุณ</h1>
            <table>
                <thead>
                    <tr>
                        <th>รหัสสินค้า</th>
                        <th>ชื่อสินค้า</th>
                        <th>ประเภท</th>
                        <th>จำนวน</th>
                        <th>ลบ</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map((item) => (
                        <tr key={item.productsID}>
                            <td>{item.productsID}</td>
                            <td>{item.productsName}</td>
                            <td>{item.categoriesName}</td>
                            <td>{item.quantity}</td>
                            <td>
                                <button onClick={() => removeFromCart(item.productsID)}>ลบ</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h3>รวมทั้งหมด: {cart.length} รายการ</h3>
        </div>
    );
};

export default CartPage;
