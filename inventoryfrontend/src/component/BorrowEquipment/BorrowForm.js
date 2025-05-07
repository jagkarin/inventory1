import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import './css/BorrowForm.css';
import Swal from 'sweetalert2';

const getImagePath = (filename) => {
  if (!filename || typeof filename !== 'string' || filename.trim() === '') {
    return '';
  }
  const baseUrl = 'https://localhost:7294';
  return `${baseUrl}${filename}`;
};

const BorrowForm = ({ onClose }) => {
  const [userID, setUserID] = useState(null);
  const [equipments, setEquipments] = useState([]);
  const [borrowCart, setBorrowCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [equipmentPage, setEquipmentPage] = useState(1); // หน้าเริ่มต้นสำหรับ equipments
  const [cartPage, setCartPage] = useState(1); // หน้าเริ่มต้นสำหรับ borrowCart
  const itemsPerPage = 10; // จำนวนรายการต่อหน้า

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserID(decodedToken.userId);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchEquipment = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://localhost:7294/api/Equipment/GetAllEquipmentCategory', {
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (data.responseCode === '200' && Array.isArray(data.data)) {
          const updatedData = data.data.map((equipment, index) => ({
            ...equipment,
            eqM_Id: equipment.eqM_Id || equipment.id || `temp-id-${index}`, // เพิ่ม fallback ถ้า eqM_Id ไม่มี
            eqmname: equipment.eqM_Name || '',
            imageUrl: equipment.eqMimage || equipment.imageUrl || '',
            category: equipment.category_Name || '',
          }));
          // ตรวจสอบว่ามี eqM_Id ซ้ำหรือไม่
          const idSet = new Set(updatedData.map(item => item.eqM_Id));
          if (idSet.size !== updatedData.length) {
            console.warn("Duplicate eqM_Id found in equipment data:", updatedData);
            // ถ้ามีซ้ำ ให้สร้าง eqM_Id ใหม่
            updatedData.forEach((item, idx) => {
              item.eqM_Id = `eq-${idx}-${item.eqM_Id || Date.now()}`;
            });
          }
          setEquipments(updatedData);
        } else {
          Swal.fire('Error', 'Failed to fetch equipment data.', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'Failed to fetch equipment data. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, []);

  const handleAddToCart = (equipment) => {
    setBorrowCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.eqM_Id === equipment.eqM_Id
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.eqM_Id === equipment.eqM_Id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            eqM_Id: equipment.eqM_Id,
            eqmname: equipment.eqmname,
            quantity: 1,
            category: equipment.category || '',
            imageUrl: equipment.imageUrl || '',
          },
        ];
      }
    });
  };

  const handleQuantityChange = (eqM_Id, newQuantity) => {
    if (newQuantity < 1) newQuantity = 1;
    setBorrowCart((prevCart) =>
      prevCart.map((item) =>
        item.eqM_Id === eqM_Id ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  const handleCancel = () => {
    setBorrowCart([]);
    if (typeof onClose === 'function') onClose();
  };

  const handleSubmit = async () => {
    if (!userID) {
      Swal.fire('Error', 'เกิดข้อผิดพลาด: ไม่พบข้อมูล UserID', 'error');
      return;
    }

    if (borrowCart.length === 0) {
      Swal.fire('Error', 'กรุณาเลือกอุปกรณ์อย่างน้อย 1 รายการ', 'error');
      return;
    }

    const currentDate = new Date().toISOString().split("T")[0];
    const { value: formValues } = await Swal.fire({
      title: "ยืนยันการยืม",
      html: `
        <div class="swal-custom-container">
          <div class="swal-custom-input">
            <label>รายละเอียดการยืม:</label>
            <textarea id="swal-borrow-details" class="swal2-textarea" placeholder="กรุณาระบุเหตุผลการยืม (เช่น วัตถุประสงค์, สถานที่ใช้)"></textarea>
          </div>
          <div class="swal-custom-input">
            <label>วันที่ยืม:</label>
            <input type="date" id="swal-borrow-date" class="swal2-input" value="${currentDate}" min="${currentDate}">
          </div>
          <div class="swal-custom-input">
            <label>วันที่คาดว่าจะคืน:</label>
            <input type="date" id="swal-return-date" class="swal2-input" min="${currentDate}">
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      customClass: {
        popup: "swal-borrow-popup",
        title: "swal-borrow-title",
        htmlContainer: "swal-borrow-content",
        confirmButton: "swal-borrow-confirm-btn",
        cancelButton: "swal-borrow-cancel-btn",
      },
      preConfirm: () => {
        const details = document.getElementById("swal-borrow-details").value;
        const borrowDate = document.getElementById("swal-borrow-date").value;
        const returnDate = document.getElementById("swal-return-date").value;
        if (!details || !borrowDate || !returnDate) {
          Swal.showValidationMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
          return false;
        }
        if (new Date(returnDate) <= new Date(borrowDate)) {
          Swal.showValidationMessage("วันที่คาดว่าจะคืนต้องมากกว่าวันที่ยืม");
          return false;
        }
        return { details, borrowDate, returnDate };
      },
      background: "#ffffff",
      width: "clamp(300px, 90vw, 500px)",
      padding: "clamp(15px, 3vw, 20px)",
      backdrop: "rgba(0, 0, 0, 0.6)",
    });

    if (!formValues) return;

    const borrowData = {
      userId: userID,
      borrowDate: formValues.borrowDate,
      expectedReturnDate: formValues.returnDate,
      status: "รอการอนุมัติ",
      borrowDetails: borrowCart.map((item) => ({
        eqmname: item.eqmname || "",
        quantity: item.quantity || 1,
        category: item.category || "",
        imageUrl: item.imageUrl || "",
      })),
      borrowDescription: formValues.details,
      borrowCode: "",
      returnStatus: "",
    };

    try {
      const response = await fetch("https://localhost:7294/api/Withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(borrowData),
      });

      const responseData = await response.json();
      if (response.ok) {
        const borrowCode = responseData.borrowCode || "ไม่ระบุ";
        // อัปเดตสถานะอุปกรณ์เป็น "ถูกยืม" (status: 1)
        setEquipments((prevEquipments) =>
          prevEquipments.map((equipment) =>
            borrowCart.some((item) => item.eqM_Id === equipment.eqM_Id)
              ? { ...equipment, status: 1 }
              : equipment
          )
        );
        setBorrowCart([]); // ล้างตะกร้า
        Swal.fire({
          title: "สำเร็จ!",
          text: `บันทึกรายการสำเร็จ (รหัส: ${borrowCode})`,
          icon: "success",
          confirmButtonText: "ตกลง",
          customClass: {
            popup: "swal-success-popup",
            title: "swal-success-title",
            confirmButton: "swal-success-confirm-btn",
          },
        }).then(() => {
          if (typeof onClose === "function") onClose();
          window.location.reload();
        });
      } else {
        throw new Error(responseData.message || "Unknown error");
      }
    } catch (error) {
      Swal.fire({
        title: "ผิดพลาด!",
        text: `เกิดข้อผิดพลาดในการบันทึก: ${error.message}`,
        icon: "error",
        confirmButtonText: "ตกลง",
        customClass: {
          popup: "swal-error-popup",
          title: "swal-error-title",
          confirmButton: "swal-error-confirm-btn",
        },
      });
    }
  };

  // Pagination Logic
  const indexOfLastEquipment = equipmentPage * itemsPerPage;
  const indexOfFirstEquipment = indexOfLastEquipment - itemsPerPage;
  const currentEquipments = equipments.slice(indexOfFirstEquipment, indexOfLastEquipment);

  const indexOfLastCartItem = cartPage * itemsPerPage;
  const indexOfFirstCartItem = indexOfLastCartItem - itemsPerPage;
  const currentCart = borrowCart.slice(indexOfFirstCartItem, indexOfLastCartItem);

  const totalEquipmentPages = Math.ceil(equipments.length / itemsPerPage);
  const totalCartPages = Math.ceil(borrowCart.length / itemsPerPage);

  const paginateEquipment = (pageNumber) => setEquipmentPage(pageNumber);
  const paginateCart = (pageNumber) => setCartPage(pageNumber);

  const nextEquipmentPage = () => {
    if (equipmentPage < totalEquipmentPages) setEquipmentPage(equipmentPage + 1);
  };

  const prevEquipmentPage = () => {
    if (equipmentPage > 1) setEquipmentPage(equipmentPage - 1);
  };

  const nextCartPage = () => {
    if (cartPage < totalCartPages) setCartPage(cartPage + 1);
  };

  const prevCartPage = () => {
    if (cartPage > 1) setCartPage(cartPage - 1);
  };

  return (
    <div className="equip-request-page-container">
      <div className="equip-request-page-content">
        {loading ? (
          <p className="equip-request-loading-text">กำลังโหลดข้อมูล...</p>
        ) : (
          <div className="equip-request-product-cart-container">
            <div className="equip-request-product-list-section">
              <h2 className="equip-request-product-list-title">รายการอุปกรณ์</h2>
              <div className="equip-request-product-table-wrapper">
                <table className="equip-request-product-table">
                  <thead>
                    <tr>
                      <th className="equip-request-table-header">รูปอุปรณ์</th>
                      <th className="equip-request-table-header">ชื่ออุปกรณ์</th>
                      <th className="equip-request-table-header">หมวดหมู่</th>
                      <th className="equip-request-table-header"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentEquipments.map((equipment) => (
                      <tr key={equipment.eqM_Id} className="equip-request-table-row">
                        <td className="equip-request-table-cell">
                          {equipment.imageUrl ? (
                            <div className="equip-request-product-image-container">
                              <img
                                className="equip-request-product-image"
                                src={getImagePath(equipment.imageUrl)}
                                alt={equipment.eqmname || 'Equipment Image'}
                              />
                            </div>
                          ) : (
                            <span className="equip-request-no-image">No image</span>
                          )}
                        </td>
                        <td className="equip-request-table-cell">{equipment.eqmname}</td>
                        <td className="equip-request-table-cell">{equipment.category}</td>
                        <td className="equip-request-table-cell">
                          <button
                            className="equip-request-btn-add-to-cart"
                            onClick={() => handleAddToCart(equipment)}
                          >
                            +
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination for Equipment */}
              <div className="equip-request-pagination">
                <button
                  onClick={prevEquipmentPage}
                  disabled={equipmentPage === 1}
                  className="equip-request-pagination-btn"
                >
                  ก่อนหน้า
                </button>
                {Array.from({ length: totalEquipmentPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    onClick={() => paginateEquipment(number)}
                    className={`equip-request-pagination-btn ${equipmentPage === number ? 'active' : ''}`}
                  >
                    {number}
                  </button>
                ))}
                <button
                  onClick={nextEquipmentPage}
                  disabled={equipmentPage === totalEquipmentPages}
                  className="equip-request-pagination-btn"
                >
                  ถัดไป
                </button>
              </div>
            </div>

            <div className="equip-request-cart-section">
              <h2 className="equip-request-cart-title">รายการยืม</h2>
              <div className="equip-request-cart-table-wrapper">
                <table className="equip-request-cart-table">
                  <thead>
                    <tr>
                      <th className="equip-request-table-header">ลำดับ</th>
                      <th className="equip-request-table-header">ชื่ออุปกรณ์</th>
                      <th className="equip-request-table-header">จำนวน</th>
                      <th className="equip-request-table-header">รูปอุปกรณ์</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCart.map((item, index) => (
                      <tr key={item.eqM_Id} className="equip-request-table-row">
                        <td className="equip-request-table-cell">{index + 1}</td>
                        <td className="equip-request-table-cell">{item.eqmname}</td>
                        <td className="equip-request-table-cell">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(item.eqM_Id, parseInt(e.target.value) || 1)
                            }
                            min="1"
                            className="equip-request-quantity-input"
                          />
                        </td>
                        <td className="equip-request-table-cell">
                          {item.imageUrl ? (
                            <div className="equip-request-cart-product-image-container">
                              <img
                                className="equip-request-cart-product-image"
                                src={getImagePath(item.imageUrl)}
                                alt={item.eqmname || 'Equipment Image'}
                              />
                            </div>
                          ) : (
                            <span className="equip-request-no-image">No image</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination for Cart */}
              <div className="equip-request-pagination">
                <button
                  onClick={prevCartPage}
                  disabled={cartPage === 1}
                  className="equip-request-pagination-btn"
                >
                  ก่อนหน้า
                </button>
                {Array.from({ length: totalCartPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    onClick={() => paginateCart(number)}
                    className={`equip-request-pagination-btn ${cartPage === number ? 'active' : ''}`}
                  >
                    {number}
                  </button>
                ))}
                <button
                  onClick={nextCartPage}
                  disabled={cartPage === totalCartPages}
                  className="equip-request-pagination-btn"
                >
                  ถัดไป
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="equip-request-cart-buttons">
          <button className="equip-request-btn-submit-withdraw" onClick={handleSubmit}>
            บันทึกการยืม
          </button>
          <button className="equip-request-btn-cancel-cart" onClick={handleCancel}>
            ยกเลิกรายการ
          </button>
        </div>
      </div>
    </div>
  );
};

export default BorrowForm;