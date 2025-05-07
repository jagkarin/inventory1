import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/Menu.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const MenuUser = ({ profile }) => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: "/asset/new-product.png", label: "ขอเบิกสินค้าและอุปกรณ์", path: "/RequestP" },
    // { icon: "/asset/maintenance.png", label: "ยืมอุปกรณ์", path: "/BorrowForm" },
    { icon: "/asset/loading-bar.png", label: "ตรวจสอบสถานะคำขอเบิก", path: "/Status" },
    { icon: "/asset/load.png", label: "ตรวจสอบสถานะการยืมอุปกรณ์", path: "/BorrowStatus" },
  ];

  const handleMenuItemClick = (path) => {
    console.log(`กำลังนำไปยังหน้า: ${path}`);
    navigate(path, { replace: true });
  };

  return (
    <div className="menu-container">
      <div className="menu-grid">
        {menuItems.map((item, index) => (
          <div key={index} className="menu-item" onClick={() => handleMenuItemClick(item.path)}>
            <div className="menu-icon">
              {item.icon.startsWith("bi ") ? (
                <i className={item.icon}></i>
              ) : (
                <img
                  src={item.icon}
                  alt={item.label}
                  className="menu-icon-img"
                  onError={(e) => {
                    console.error(`ไม่สามารถโหลดไอคอนเมนูได้: ${item.icon}`);
                    e.target.src = "https://dummyimage.com/70x70/000/fff&text=ไอคอนไม่พบ";
                  }}
                />
              )}
            </div>
            <div className="menu-label">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuUser;