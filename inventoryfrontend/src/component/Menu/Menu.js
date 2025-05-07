import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/Menu.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Menu = ({ profile }) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: "dashboard", icon: "/asset/dashboard.png", label: "แดชบอร์ด", path: "/dashboard1" },
    { id: "item-masters", icon: "/asset/checklist.png", label: "ข้อมูลรายการสินค้าและอุปกรณ์", path: "/EQMpage" },
    { id: "inventory", icon: "/asset/warehouse.png", label: "จัดการคลังสินค้า", path: "/Inventory" },
    { id: "request", icon: "/asset/new-product.png", label: "ขอเบิกสินค้าและอุปกรณ์", path: "/RequestP" },
    { id: "approve-withdraw", icon: "/asset/follow-up.png", label: "อนุมัติคำขอเบิกสินค้า", path: "/ApproveWithdrawPage" },
    { id: "approve-borrow", icon: "/asset/mark.png", label: "อนุมัติคำขอยืมอุปกรณ์", path: "/BorrowMain" },
    { id: "status", icon: "/asset/loading-bar.png", label: "ตรวจสอบสถานะคำขอเบิก", path: "/Status" },
    { id: "borrow-status", icon: "/asset/load.png", label: "ตรวจสอบสถานะการยืมอุปกรณ์", path: "/BorrowStatus" },
    { id: "member", icon: "/asset/team.png", label: "ข้อมูลผู้ใช้งานระบบ", path: "/Member" },
  ];

  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.adminOnly) return true; // แสดงเมนูที่ไม่จำกัดสิทธิ์
    return profile?.role === "admin"; // แสดงเมนูที่จำกัดสำหรับผู้ดูแลคลังสินค้าเท่านั้น
  });

  const handleMenuItemClick = (path) => {
    console.log(`กำลังนำไปยังหน้า: ${path}`);
    navigate(path, { replace: true });
  };

  return (
    <div className="menu-container">
      <div className="menu-grid">
        {filteredMenuItems.map((item) => (
          <div
            key={item.id}
            className="menu-item"
            onClick={() => handleMenuItemClick(item.path)}
          >
            <div className="menu-icon">
              <img
                src={item.icon}
                alt={item.label}
                className="menu-icon-img"
                onError={(e) => {
                  console.error(`ไม่สามารถโหลดไอคอนเมนูได้: ${item.icon}`);
                  e.target.src = "https://dummyimage.com/70x70/000/fff&text=ไอคอนไม่พบ";
                }}
              />
            </div>
            <div className="menu-label">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;