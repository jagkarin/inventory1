import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { jwtDecode } from 'jwt-decode';
import Menu from "../Menu/Menu.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./css/Layout.css";
import logo from './css/logoExpert.png';

const AppLayout = ({ children, showMenu = false, onLogout }) => {
  const [isNotificationActive, setIsNotificationActive] = useState(false);
  const [lowStockData, setLowStockData] = useState({ inventory: [] });
  const [borrowNotifications, setBorrowNotifications] = useState({ upcoming: [], overdue: [] });
  const [pendingWithdraws, setPendingWithdraws] = useState([]);
  const [pendingReturns, setPendingReturns] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [profile, setProfile] = useState({});
  const [roleId, setRoleId] = useState('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const navigate = useNavigate();

  const fetchUserProfile = useCallback(async () => {
    setIsLoadingProfile(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("ไม่พบ Token, Redirect ไปยังหน้า Login");
        navigate("/login", { replace: true });
        return;
      }

      const decodedToken = jwtDecode(token);
      setRoleId(decodedToken.roleId);
      const userId = decodedToken.userId;

      console.log("กำลังเรียก API ด้วย userID:", userId);
      const response = await fetch(`https://localhost:7294/api/User/GetUserbyuserID?userid=${userId}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      console.log("สถานะ API Response:", response.status);
      if (response.status === 204) {
        console.warn("API คืนสถานะ 204: ไม่มีข้อมูลผู้ใช้");
        setProfile({});
        return;
      }

      if (!response.ok) {
        console.error("API ล้มเหลวด้วยสถานะ:", response.status);
        setProfile({});
        return;
      }

      const userData = await response.json();
      console.log("ข้อมูลจาก API:", userData);
      setProfile({
        firstName: userData.firstname || "ไม่ระบุ",
        lastName: userData.lastname || "",
        image: getImagePath(userData.profilePicture),
        roleName: userData.roleName || "ไม่ระบุ",
      });
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการเรียกข้อมูลผู้ใช้:", error);
      setProfile({});
    } finally {
      setIsLoadingProfile(false);
    }
  }, [navigate]);

  const getImagePath = (filename) => {
    if (!filename || typeof filename !== "string" || filename.trim() === "") {
      return "/profile-image.jpg";
    }
    const baseUrl = "https://localhost:7294";
    return `${baseUrl}${filename}`;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    } else {
      fetchUserProfile();
    }
  }, [fetchUserProfile, navigate]);

  const handleLowStockAlert = (products, source) => {
    setLowStockData((prev) => ({
      ...prev,
      [source]: products,
    }));
  };

  const fetchLowStockData = useCallback(async () => {
    try {
      const stockResponse = await fetch("https://localhost:7294/api/Stock/StockImage", {
        headers: { "Content-Type": "application/json" },
      });

      if (stockResponse.ok) {
        const stockData = await stockResponse.json();
        if (stockData.responseCode === "200" && Array.isArray(stockData.data)) {
          const lowStockItems = stockData.data
            .filter((item) => item.quantity < 1)
            .map((item) => ({
              itemName: item.itemName || "ไม่มีชื่อ",
              quantity: item.quantity || 0,
            }));
          handleLowStockAlert(lowStockItems, "inventory");
        }
      }
      setHasFetched(true);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสต๊อกต่ำ:", error);
    }
  }, []);

  const fetchBorrowNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("ไม่พบ token สำหรับการเรียก API การยืม");
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      const isAdmin = roleId === "1";

      console.log(`กำลังดึงข้อมูลการยืม${isAdmin ? 'สำหรับทุกผู้ใช้' : `สำหรับ userID: ${userId}`}`);
      const endpoint = isAdmin
        ? 'https://localhost:7294/api/EquipmentBorrow/GetAllEQMData'
        : `https://localhost:7294/api/EquipmentBorrow/user/${userId}`;

      const response = await fetch(endpoint, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("ข้อมูลการยืมจาก API:", responseData);

        const dataArray = Array.isArray(responseData)
          ? responseData
          : Array.isArray(responseData.data)
          ? responseData.data
          : [];

        const userBorrows = dataArray.filter(
          (borrow) =>
            borrow.itemtype === 2 &&
            borrow.status === 1 &&
            borrow.borrowStatus === 1 &&
            (isAdmin || borrow.userID === parseInt(userId))
        );

        const notifications = userBorrows
          .map((borrow) => {
            const expectedReturnDate = new Date(borrow.returnDate);
            if (isNaN(expectedReturnDate.getTime())) {
              console.error(`วันที่ไม่ถูกต้องสำหรับรหัสการยืม: ${borrow.borrowID}`, borrow.returnDate);
              return null;
            }
            const currentDate = new Date();
            const diffTime = expectedReturnDate - currentDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return { ...borrow, daysUntilReturn: diffDays };
          })
          .filter((borrow) => borrow && borrow.daysUntilReturn <= 2);

        const upcoming = notifications.filter((borrow) => borrow.daysUntilReturn >= 0);
        const overdue = notifications.filter((borrow) => borrow.daysUntilReturn < 0);

        console.log("การแจ้งเตือนการยืม - ใกล้ถึงกำหนด:", upcoming);
        console.log("การแจ้งเตือนการยืม - เลยกำหนด:", overdue);
        setBorrowNotifications({ upcoming, overdue });
        setHasFetched(true);
      } else {
        const errorText = await response.text();
        console.error("ไม่สามารถเรียกข้อมูลการยืมได้:", response.status, errorText);
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการเรียกข้อมูลการแจ้งเตือนการยืม:", error);
    }
  }, [roleId]);

  const fetchPendingRequests = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch('https://localhost:7294/api/EquipmentBorrow/GetAllEQMData', {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        const dataArray = Array.isArray(responseData.data) ? responseData.data : [];
        const pendingWithdraw = dataArray.filter(item => item.itemtype === 1 && item.status === 0);
        setPendingWithdraws(pendingWithdraw);

        const pendingReturn = dataArray.filter(item => item.itemtype === 2 && item.status === 0);
        setPendingReturns(pendingReturn);
      } else {
        console.error("ไม่สามารถเรียกข้อมูลคำขอที่รอดำเนินการได้, สถานะ:", response.status);
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการเรียกข้อมูลคำขอที่รอดำเนินการ:", error);
    }
  }, []);

  const showLowStockPopup = () => {
    const allLowStock = lowStockData.inventory;
    const { upcoming, overdue } = borrowNotifications;
    const hasLowStock = allLowStock.length > 0;
    const hasPendingWithdraws = pendingWithdraws.length > 0;
    const hasPendingReturns = pendingReturns.length > 0;
    const hasBorrowNotifications = upcoming.length > 0 || overdue.length > 0;

    if (!hasLowStock && !hasPendingWithdraws && !hasPendingReturns && !hasBorrowNotifications) {
      Swal.fire({
        title: '<span style="color: #718096; font-weight: 600; font-size: 1.25rem;">ไม่มีรายการแจ้งเตือน</span>',
        text: "ขณะนี้ไม่มีรายการสินค้าคงคลังไม่เพียงพอ, คำขอเบิก/ยืมที่รอการอนุมัติ, หรืออุปกรณ์ที่ใกล้ถึงกำหนดคืนหรือเลยกำหนดคืน",
        icon: "info",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#48bb78",
        customClass: {
          popup: "alert-popup shadow-xl rounded-xl border-0",
          title: "alert-title text-center font-semibold tracking-wide mb-3",
          confirmButton: "alert-confirm-btn btn rounded-lg px-6 py-2.5 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200",
        },
        buttonsStyling: false,
      });
      return;
    }

    let htmlContent = '<div style="max-height: 400px; overflow-y: auto;">';

    if (hasLowStock) {
      const inventoryLowStock = allLowStock;
      htmlContent += `
        <div class="notification-section mb-3" style="background:rgb(217, 237, 255); border-radius: 8px; padding: 10px;">
          <h5 style="color: #333333; font-size: 1.1rem; font-weight: 600; margin-bottom: 10px; border-bottom: 2px solid #3182ce; padding-bottom: 5px;">
            รายการสินค้าคงคลังไม่เพียงพอ
          </h5>
          <ul style="list-style: none; padding: 0; margin: 0;">
            ${inventoryLowStock
              .map(
                (product, index) => `
                  <li style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 0.95rem; color: #2d3748;">
                    <span><strong>${index + 1}.</strong> ${product.itemName}</span>
                    <span style="color: #e53e3e; font-weight: 500;">คงเหลือ ${product.quantity} รายการ</span>
                  </li>`
              )
              .join("")}
          </ul>
        </div>`;
    }

    if (hasPendingWithdraws) {
      const groupedPendingWithdraws = pendingWithdraws.reduce((acc, withdraw) => {
        const fullname = `${withdraw.firstname || "ไม่ระบุ"} ${withdraw.lastname || ""}`.trim();
        acc[fullname] = acc[fullname] || [];
        acc[fullname].push(withdraw);
        return acc;
      }, {});

      htmlContent += `
        <div class="notification-section mb-3" style="background: rgb(217, 237, 255); border-radius: 8px; padding: 10px;">
          <h5 style="color: #333333; font-size: 1.1rem; font-weight: 600; margin-bottom: 10px; border-bottom: 2px solid #3182ce; padding-bottom: 5px;">
            คำขอเบิกสินค้าที่รอการอนุมัติ
          </h5>
          <ul style="list-style: none; padding: 0; margin: 0;">
            ${Object.entries(groupedPendingWithdraws)
              .map(
                ([fullname, withdraws], index) => `
                  <li style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 0.95rem; color: #2d3748;">
                    <span><strong>${index + 1}.</strong> ${fullname}</span>
                    <span style="color: #e53e3e; font-weight: 500;">รอการอนุมัติ: ${withdraws.length} รายการ</span>
                  </li>`
              )
              .join("")}
          </ul>
        </div>`;
    }

    if (hasPendingReturns) {
      const groupedPendingReturns = pendingReturns.reduce((acc, withdraw) => {
        const fullname = `${withdraw.firstname || "ไม่ระบุ"} ${withdraw.lastname || ""}`.trim();
        acc[fullname] = acc[fullname] || [];
        acc[fullname].push(withdraw);
        return acc;
      }, {});

      htmlContent += `
        <div class="notification-section mb-3" style="background:rgb(217, 237, 255); border-radius: 8px; padding: 10px;">
          <h5 style="color: #333333; font-size: 1.1rem; font-weight: 600; margin-bottom: 10px; border-bottom: 2px solid #3182ce; padding-bottom: 5px;">
            คำขอยืมอุปกรณ์ที่รอการอนุมัติ
          </h5>
          <ul style="list-style: none; padding: 0; margin: 0;">
            ${Object.entries(groupedPendingReturns)
              .map(
                ([fullname, withdraws], index) => `
                  <li style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 0.95rem; color: #2d3748;">
                    <span><strong>${index + 1}.</strong> ${fullname}</span>
                    <span style="color: #e53e3e; font-weight: 500;">รอการอนุมัติ: ${withdraws.length} รายการ</span>
                  </li>`
              )
              .join("")}
          </ul>
        </div>`;
    }

    if (hasBorrowNotifications) {
      htmlContent += `
        <div class="notification-section mb-3" style="background: rgb(217, 237, 255); border-radius: 8px; padding: 10px;">
          <h5 style="color: #333333; font-size: 1.1rem; font-weight: 600; margin-bottom: 10px; border-bottom: 2px solid #3182ce; padding-bottom: 5px;">
            แจ้งเตือนกำหนดคืนอุปกรณ์
          </h5>
          <ul style="list-style: none; padding: 0; margin: 0;">
            ${overdue
              .map(
                (borrow, index) => {
                  const returnDate = new Date(borrow.returnDate).toLocaleDateString('th-TH');
                  const userName = `${borrow.firstname || "ไม่ระบุ"} ${borrow.lastname || ""}`.trim();
                  const daysOverdue = Math.abs(borrow.daysUntilReturn);
                  return `
                    <li style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 0.95rem; color: #2d3748;">
                      <span><strong>${index + 1}.</strong> ${borrow.itemName || "อุปกรณ์"} (${userName})</span>
                      <span style="color: #e53e3e; font-weight: 500;">เลยกำหนด: ${daysOverdue} วัน (${returnDate})</span>
                    </li>`;
                }
              )
              .join("")}
            ${upcoming
              .map(
                (borrow, index) => {
                  const returnDate = new Date(borrow.returnDate).toLocaleDateString('th-TH');
                  const userName = `${borrow.firstname || "ไม่ระบุ"} ${borrow.lastname || ""}`.trim();
                  return `
                    <li style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 0.95rem; color: #2d3748;">
                      <span><strong>${overdue.length + index + 1}.</strong> ${borrow.itemName || "อุปกรณ์"} (${userName})</span>
                      <span style="color:#e53e3e; font-weight: 500;">กำหนดคืน: ${returnDate} (เหลือ ${borrow.daysUntilReturn} วัน)</span>
                    </li>`;
                }
              )
              .join("")}
          </ul>
        </div>`;
    }

    htmlContent += "</div>";

    Swal.fire({
      title: '<span style="color:rgb(21, 23, 25); font-weight: 600; font-size: 1.25rem;">การแจ้งเตือนสำหรับผู้ดูแลคลังสินค้า</span>',
      html: htmlContent,
      allowOutsideClick: false,
      confirmButtonText: "รับทราบ",
      confirmButtonColor: "#48bb78",
      backdrop: "rgba(0, 0, 0, 0.6)",
      width: "40rem",
      padding: "1.5rem",
      customClass: {
        popup: "alert-popup shadow-xl rounded-xl border-0 animate__animated animate__fadeIn animate__faster",
        title: "alert-title text-center font-semibold tracking-wide mb-3",
        htmlContainer: "alert-text text-base leading-relaxed",
        confirmButton: "alert-confirm-btn btn rounded-lg px-6 py-2.5 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200",
      },
      buttonsStyling: false,
    });
  };

  const showBorrowNotificationPopup = () => {
    const { upcoming, overdue } = borrowNotifications;
    const hasNotifications = upcoming.length > 0 || overdue.length > 0;

    if (!hasNotifications) {
      Swal.fire({
        title: '<span style="color: #718096; font-weight: 600; font-size: 1.25rem;">ไม่มีรายการแจ้งเตือน</span>',
        text: "ขณะนี้คุณไม่มีอุปกรณ์ที่ใกล้ถึงกำหนดคืนหรือเลยกำหนดคืน",
        icon: "info",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#48bb78",
        customClass: {
          popup: "alert-popup shadow-xl rounded-xl border-0",
          title: "alert-title text-center font-semibold tracking-wide mb-3",
          confirmButton: "alert-confirm-btn btn rounded-lg px-6 py-2.5 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200",
        },
        buttonsStyling: false,
      });
      return;
    }

    let htmlContent = '<div style="max-height: 400px; overflow-y: auto;">';

    if (overdue.length > 0) {
      htmlContent += `
        <div class="notification-section mb-3" style="background: rgb(217, 237, 255); border-radius: 8px; padding: 10px;">
          <h5 style="color: #333333; font-size: 1.1rem; font-weight: 600; margin-bottom: 10px; border-bottom: 2px solid #e53e3e; padding-bottom: 5px;">
            อุปกรณ์ที่เลยกำหนดคืน
          </h5>
          <ul style="list-style: none; padding: 0; margin: 0;">
            ${overdue
              .map(
                (borrow, index) => {
                  const returnDate = new Date(borrow.returnDate).toLocaleDateString('th-TH');
                  const daysOverdue = Math.abs(borrow.daysUntilReturn);
                  return `
                    <li style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 0.95rem; color: #2d3748;">
                      <span><strong>${index + 1}.</strong> รหัส: ${borrow.borrowID} - ${borrow.itemName || "อุปกรณ์"}</span>
                      <span style="color: #e53e3e; font-weight: 500;">เลยกำหนด: ${daysOverdue} วัน (${returnDate})</span>
                    </li>`;
                }
              )
              .join("")}
          </ul>
        </div>`;
    }

    if (upcoming.length > 0) {
      htmlContent += `
        <div class="notification-section mb-3" style="background: #fefcbf; border-radius: 8px; padding: 10px;">
          <h5 style="color: #333333; font-size: 1.1rem; font-weight: 600; margin-bottom: 10px; border-bottom: 2px solid #2d3748; padding-bottom: 5px;">
            อุปกรณ์ที่ใกล้ถึงกำหนดคืน
          </h5>
          <ul style="list-style: none; padding: 0; margin: 0;">
            ${upcoming
              .map(
                (borrow, index) => {
                  const returnDate = new Date(borrow.returnDate).toLocaleDateString('th-TH');
                  return `
                    <li style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 0.95rem; color: #2d3748;">
                      <span><strong>${index + 1}.</strong> รหัส: ${borrow.borrowID} - ${borrow.itemName || "อุปกรณ์"}</span>
                      <span style="color: #e53e3e; font-weight: 500;">กำหนดคืน: ${returnDate} (เหลือ ${borrow.daysUntilReturn} วัน)</span>
                    </li>`;
                }
              )
              .join("")}
          </ul>
        </div>`;
    }

    htmlContent += '</div>';

    Swal.fire({
      title: '<span style="color: #e53e3e; font-weight: 600; font-size: 1.25rem;">แจ้งเตือนกำหนดคืนอุปกรณ์</span>',
      html: htmlContent,
      allowOutsideClick: false,
      confirmButtonText: "รับทราบ",
      confirmButtonColor: "#48bb78",
      backdrop: "rgba(0, 0, 0, 0.6)",
      width: "36rem",
      padding: "1.5rem",
      customClass: {
        popup: "alert-popup shadow-xl rounded-xl border-0 animate__animated animate__fadeIn animate__faster",
        title: "alert-title text-center font-semibold tracking-wide mb-3",
        htmlContainer: "alert-text text-base leading-relaxed",
        confirmButton: "alert-confirm-btn btn rounded-lg px-6 py-2.5 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200",
      },
      buttonsStyling: false,
    });
  };

  useEffect(() => {
    if (!hasFetched && roleId) {
      fetchLowStockData();
      fetchBorrowNotifications();
      if (roleId === "1") {
        fetchPendingRequests();
      }
    }
    const allLowStock = lowStockData.inventory;
    const hasNotifications = roleId === "1"
      ? allLowStock.length > 0 || pendingWithdraws.length > 0 || pendingReturns.length > 0 || borrowNotifications.upcoming.length > 0 || borrowNotifications.overdue.length > 0
      : borrowNotifications.upcoming.length > 0 || borrowNotifications.overdue.length > 0;
    setIsNotificationActive(hasNotifications);
  }, [lowStockData, borrowNotifications, pendingWithdraws, pendingReturns, hasFetched, fetchLowStockData, fetchBorrowNotifications, fetchPendingRequests, roleId]);

  const handleHomeClick = () => navigate("/Menu", { replace: true });

  const handleNotificationClick = () => {
    if (roleId === "1") {
      showLowStockPopup(); // เรียกคืนการแจ้งเตือนเดิมสำหรับแอดมิน
    } else {
      showBorrowNotificationPopup(); // ผู้ใช้ทั่วไปเห็นการแจ้งเตือนการยืมของตัวเอง
    }
  };

  const handleProfileClick = () => navigate("/Profile", { replace: true });

  const handleLogoClick = () => navigate("/Menu", { replace: true });

  const allLowStock = lowStockData.inventory;
  const totalNotifications = roleId === "1"
    ? allLowStock.length + pendingWithdraws.length + pendingReturns.length + borrowNotifications.upcoming.length + borrowNotifications.overdue.length
    : borrowNotifications.upcoming.length + borrowNotifications.overdue.length;

  return (
    <div className="layout-container">
      <nav className="MN-navbar navbar-expand-lg navbar-light">
        <div className="containerr-fluid d-flex justify-content-between align-items-center" style={{ justifyContent: "space-between" }}>
          <div className="logo-section" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            <img src={logo} className="expert-company-logo" alt="โลโก้ Expert Development" />
          </div>
          <div className="profile-section" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
            {isLoadingProfile ? (
              <div>กำลังโหลด...</div>
            ) : (
              <>
                <img
                  src={profile?.image || "/profile-image.jpg"}
                  alt={`${profile?.firstName || "ข้อมูลผู้ใช้"} ${profile?.lastName || ""}`}
                  className="rounded-circle shadow-lg hover-smooth"
                  style={{
                    width: "90px",
                    height: "90px",
                    objectFit: "cover",
                    transition: "all 0.5s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                    e.target.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.1)";
                  }}
                />
                <div className="ms-4 user-info">
                  <h4 className="mb-1 text-soft-primary" style={{ fontSize: "1.6rem", fontWeight: "700", textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)" }}>
                    {profile?.firstName && profile?.lastName ? `${profile.firstName} ${profile.lastName}` : "ผู้ใช้ไม่ระบุ"}
                  </h4>
                  <p className="mb-0 text-muted" style={{ fontSize: "1.1rem", textShadow: "0 1px 1px rgba(0, 0, 0, 0.05)" }}>
                    ตำแหน่ง: {profile?.roleName || "ไม่ระบุ"}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
      {showMenu && <Menu profile={profile} onLogout={onLogout} />}
      <div className="layout-content">{children}</div>
      <div className="bottom-nav">
        <button className="bottom-nav-btn home-btn" onClick={handleHomeClick}>
          <i className="bi bi-house-fill"></i>
        </button>
        <button className="bottom-nav-btn profile-btn" onClick={handleProfileClick}>
          <i className="bi bi-person-fill"></i>
        </button>
        <div
          className={`bottom-nav-btn notification-btn ${isNotificationActive ? "active" : ""}`}
          onClick={handleNotificationClick}
        >
          <i className="bi bi-bell-fill"></i>
          {totalNotifications > 0 && (
            <span className="notification-badge">{totalNotifications}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;