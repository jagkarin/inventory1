import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ItemTable from "./ItemTable.js";
import AddItemForm from "./AddItemForm.js";

const EquipmentPage = () => {
  const location = useLocation();
  const [categories] = useState([
        // หมวดหมู่สำหรับประเภท "สินค้า" (itemType: 1)
        { id: 1, name: "Smart Easy OPD", itemType: 1 },
        { id: 2, name: "BP Box", itemType: 1 },
        { id: 3, name: "BP Kiosk", itemType: 1 },
        // หมวดหมู่สำหรับประเภท "อุปกรณ์" (itemType: 2)
      
        { id: 4, name: "วัสดุสำนักงาน", itemType: 2 },
        { id: 5, name: "ครุภัณฑ์สำนักงาน", itemType: 2 },
      ]);

  const [categoriesEQM] = useState([]); // ปิดใช้งาน categoriesEQM หากไม่ใช้
  const [refreshTable, setRefreshTable] = useState(null);

  return (
    <div className="EQM-container">
      <h1 className="EQM-center-title my-4">ข้อมูลรายการสินค้าและอุปกรณ์</h1>
      <AddItemForm categories={categories} onRefresh={refreshTable} />
      <ItemTable
        categories={categories}
        onDataChange={(fetchFn) => setRefreshTable(() => fetchFn)}
      />
    </div>
  );
};

export default EquipmentPage;