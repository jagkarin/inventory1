import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import './css/product.css';

const getImagePath = (filename) => {
  if (!filename || typeof filename !== "string" || filename.trim() === "") {
    return "";
  }
  const baseUrl = "https://localhost:7294";
  return `${baseUrl}${filename}`;
};

const Inventory = () => {
  const [stockData, setStockData] = useState([]);
  const [itemMasterData, setItemMasterData] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemTypeFilter, setItemTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const itemTypes = [
    { id: 1, name: "สินค้า" },
    { id: 2, name: "อุปกรณ์" },
  ];

  const [categories] = useState([
          // หมวดหมู่สำหรับประเภท "สินค้า" (itemType: 1)
          { id: 1, name: "Smart Easy OPD", itemType: 1 },
          { id: 2, name: "BP Box", itemType: 1 },
          { id: 3, name: "BP Kiosk", itemType: 1 },
          // หมวดหมู่สำหรับประเภท "อุปกรณ์" (itemType: 2)
        
          { id: 4, name: "วัสดุสำนักงาน", itemType: 2 },
          { id: 5, name: "ครุภัณฑ์สำนักงาน", itemType: 2 },
        ]);

  const warehouseOptions = [
    { warehouseID: 1, warehouseName: "โกดังวังอักษร" },
    { warehouseID: 2, warehouseName: "โกดังวัดอ้อมน้อย" },
  ];

  const getStatusText = (status) => {
    return status === 0 ? "พร้อมใช้งาน" : "ไม่พร้อมใช้งาน";
  };

  useEffect(() => {
    fetch("https://localhost:7294/api/Stock/StockImage", {
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData && Array.isArray(responseData.data)) {
          const updatedData = responseData.data.map((item, index) => ({
            ...item,
            imageUrl: item.image,
            stockID: item.stockID || item.id,
            uniqueKey: item.stockID ? `${item.stockID}-${index}` : `${item.itemID}-${index}`,
            units: item.units || "-",
          }));
          setStockData(updatedData);
        } else {
          console.error("ข้อมูลจาก API Stock ไม่ถูกต้อง:", responseData);
        }
      })
      .catch((error) => console.error("เกิดข้อผิดพลาดในการเรียกข้อมูลคลังสินค้า:", error));

    fetch("https://localhost:7294/api/ItemMaster/GetAllItemMaster", {
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData && Array.isArray(responseData.data)) {
          setItemMasterData(responseData.data);
        } else {
          console.error("ข้อมูลจาก API ItemMaster ไม่ถูกต้อง:", responseData);
        }
      })
      .catch((error) => console.error("เกิดข้อผิดพลาดในการเรียกข้อมูล ItemMaster:", error));

    fetch("https://localhost:7294/api/Warehouse/GetAllWarehouse", {
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData && Array.isArray(responseData.data)) {
          setWarehouses(responseData.data);
        } else {
          console.error("ข้อมูลจาก API Warehouses ไม่ถูกต้อง:", responseData);
        }
      })
      .catch((error) => console.error("เกิดข้อผิดพลาดในการเรียกข้อมูล Warehouses:", error));
  }, []);

  const filteredData = stockData.filter((item) => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesItemType =
      itemTypeFilter === "all" ||
      (itemTypeFilter === "1" && item.itemType === 1) ||
      (itemTypeFilter === "2" && item.itemType === 2);
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "0" && item.status === 0) ||
      (statusFilter === "1" && item.status === 1);
    return matchesSearch && matchesItemType && matchesStatus;
  });

  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredData.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAddStock = async () => {
    const today = new Date().toISOString().split("T")[0];

    const { value: formValues, isConfirmed } = await Swal.fire({
      title: "เพิ่มรายการสินค้าคงคลัง",
      html: `
        <select id="swal-input-itemSelect" class="inventory-swal2-select" onchange="document.getElementById('swal-input-itemName').style.display = this.value === 'new' ? 'block' : 'none';">
          <option value="" disabled selected>เลือกชื่อรายการสินค้า</option>
          ${itemMasterData
            .map(
              (item) =>
                `<option value="${item.itemID}" data-name="${item.itemName}">${item.itemName}</option>`
            )
            .join("")}
          <option value="new">เพิ่มสินค้าใหม่</option>
        </select>
        <input id="swal-input-itemName" class="swal2-input" placeholder="พิมพ์ชื่อรายการสินค้าใหม่" style="display: none;">
        <input id="swal-input-serialNumber" class="swal2-input" placeholder="หมายเลขประจำสินค้า">
        <input id="swal-input-stockin" class="swal2-input" type="date" value="${today}" min="${today}">
        <input id="swal-input-quantity" class="swal2-input" type="number" placeholder="จำนวน">
        <select id="swal-input-warehouse" class="inventory-swal2-select">
          <option value="" disabled selected>เลือกคลังสินค้า</option>
          ${warehouseOptions
            .map(
              (wh) =>
                `<option value="${wh.warehouseID}">${wh.warehouseName}</option>`
            )
            .join("")}
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "บันทึก",
      cancelButtonText: "ยกเลิก",
      backdrop: true,
      allowOutsideClick: false,
      preConfirm: async () => {
        const itemSelect = document.getElementById("swal-input-itemSelect");
        const itemNameInput = document.getElementById("swal-input-itemName").value;
        const serialNumber = document.getElementById("swal-input-serialNumber").value;
        const stockin = document.getElementById("swal-input-stockin").value;
        const quantity = document.getElementById("swal-input-quantity").value;
        const warehouseID = document.getElementById("swal-input-warehouse").value;

        let itemID, itemName;

        if (itemSelect.value === "new") {
          if (!itemNameInput || !quantity || !warehouseID) {
            Swal.showValidationMessage("กรุณากรอกชื่อสินค้าใหม่, จำนวน และเลือกคลังสินค้าให้ครบถ้วน");
            return false;
          }

          try {
            const newItemData = {
              itemID: 0,
              itemName: itemNameInput,
            };

            const response = await fetch("https://localhost:7294/api/ItemMaster", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(newItemData),
            });

            if (response.ok) {
              const newItem = await response.json();
              const matchedItem = newItem.data;
              itemID = matchedItem.itemID;
              itemName = matchedItem.itemName;

              setItemMasterData([...itemMasterData, matchedItem]);
            } else {
              const errorData = await response.text();
              Swal.showValidationMessage(
                `ไม่สามารถเพิ่มรายการสินค้าใหม่ได้: ${errorData || "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ"}`
              );
              return false;
            }
          } catch (error) {
            console.error("เกิดข้อผิดพลาดในการเพิ่มรายการสินค้าใหม่:", error);
            Swal.showValidationMessage("ไม่สามารถเพิ่มรายการสินค้าใหม่ได้");
            return false;
          }
        } else {
          itemID = itemSelect.value;
          itemName = itemSelect.options[itemSelect.selectedIndex].getAttribute("data-name");

          if (!itemID || !quantity || !warehouseID) {
            Swal.showValidationMessage("กรุณาเลือกชื่อสินค้า, กรอกจำนวน และเลือกคลังสินค้าให้ครบถ้วน");
            return false;
          }
        }

        return {
          itemID,
          itemName,
          serialNumber,
          stockin,
          quantity,
          warehouseID,
        };
      },
    });

    if (!isConfirmed || !formValues) return;

    const stockData = {
      stockID: 0,
      itemID: formValues.itemID ? parseInt(formValues.itemID) : null,
      itemName: formValues.itemName || "",
      serialNumber: formValues.serialNumber || "",
      status: 0,
      stockin: formValues.stockin || today,
      quantity: formValues.quantity ? parseInt(formValues.quantity) : null,
      warehouseID: formValues.warehouseID ? parseInt(formValues.warehouseID) : null,
    };

    try {
      const response = await fetch("https://localhost:7294/api/Stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stockData),
      });

      if (response.ok) {
        Swal.fire("สำเร็จ", "บันทึกรายการสินค้าคงคลังเรียบร้อยแล้ว", "success");
        window.location.reload();
      } else {
        const errorData = await response.text();
        Swal.fire(
          "ข้อผิดพลาด",
          `ไม่สามารถบันทึกรายการสินค้าคงคลังได้: ${errorData || "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ"}`,
          "error"
        );
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการเพิ่มรายการสินค้าคงคลัง:", error);
      Swal.fire("ข้อผิดพลาด", "ไม่สามารถบันทึกการแก้ไขรายการสินค้าคงคลังได้", "error");
    }
  };

  const handleEditStock = async (item) => {
    const today = new Date().toISOString().split("T")[0];

    const { value: formValues, isConfirmed } = await Swal.fire({
      title: "แก้ไขรายการสินค้าคงคลัง",
      html: `
        <input id="swal-input-stockID" type="hidden" value="${item.stockID}">
        <select id="swal-input-itemName" class="inventory-swal2-select">
          <option value="" disabled>เลือกชื่อรายการสินค้า</option>
          ${itemMasterData
            .map(
              (masterItem) =>
                `<option value="${masterItem.itemID}" data-name="${masterItem.itemName}" ${
                  masterItem.itemName === item.itemName ? "selected" : ""
                }>${masterItem.itemName}</option>`
            )
            .join("")}
        </select>
        <input id="swal-input-serialNumber" class="swal2-input" placeholder="หมายเลขประจำสินค้า" value="${
          item.serialNumber || ""
        }">
        <input id="swal-input-stockin" class="swal2-input" type="date" value="${
          item.stockin || today
        }" min="${today}">
        <input id="swal-input-quantity" class="swal2-input" type="number" placeholder="จำนวน" value="${
          item.quantity || ""
        }">
        <select id="swal-input-warehouse" class="inventory-swal2-select">
          <option value="" disabled selected>เลือกคลังสินค้า</option>
          ${warehouseOptions
            .map(
              (wh) =>
                `<option value="${wh.warehouseID}" ${
                  wh.warehouseID === item.warehouseID ? "selected" : ""
                }>${wh.warehouseName}</option>`
            )
            .join("")}
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "บันทึกการแก้ไข",
      cancelButtonText: "ยกเลิก",
      backdrop: true,
      allowOutsideClick: false,
      preConfirm: () => {
        const stockID = document.getElementById("swal-input-stockID").value;
        const itemSelect = document.getElementById("swal-input-itemName");
        const itemID = itemSelect.value;
        const itemName = itemSelect.options[itemSelect.selectedIndex].getAttribute("data-name");
        const serialNumber = document.getElementById("swal-input-serialNumber").value;
        const stockin = document.getElementById("swal-input-stockin").value;
        const quantity = document.getElementById("swal-input-quantity").value;
        const warehouseID = document.getElementById("swal-input-warehouse").value;

        if (!itemID || !quantity || !warehouseID) {
          Swal.showValidationMessage("กรุณาเลือกชื่อสินค้า, กรอกจำนวน และเลือกคลังสินค้าให้ครบถ้วน");
          return false;
        }

        return {
          stockID,
          itemID,
          itemName,
          serialNumber,
          stockin,
          quantity,
          warehouseID,
        };
      },
    });

    if (!isConfirmed || !formValues) return;

    const stockUpdateData = {
      itemID: formValues.itemID ? parseInt(formValues.itemID) : item.itemID,
      itemName: formValues.itemName || "",
      serialNumber: formValues.serialNumber || item.serialNumber || "",
      status: item.status,
      stockin: formValues.stockin || item.stockin || today,
      quantity: formValues.quantity ? parseInt(formValues.quantity) : item.quantity || 0,
      warehouseID: formValues.warehouseID ? parseInt(formValues.warehouseID) : item.warehouseID || null,
    };

    try {
      const stockId = parseInt(formValues.stockID);
      const url = `https://localhost:7294/api/Stock?stockId=${stockId}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stockUpdateData),
      });

      if (response.ok) {
        Swal.fire("สำเร็จ", "บันทึกการแก้ไขรายการสินค้าคงคลังเรียบร้อยแล้ว", "success");
        window.location.reload();
      } else {
        const errorData = await response.text();
        Swal.fire(
          "ข้อผิดพลาด",
          `ไม่สามารถบันทึกการแก้ไขรายการสินค้าคงคลังได้: ${errorData || "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ"}`,
          "error"
        );
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการแก้ไขรายการสินค้าคงคลัง:", error);
      Swal.fire("ข้อผิดพลาด", "ไม่สามารถบันทึกการแก้ไขรายการสินค้าคงคลังได้", "error");
    }
  };

  return (
    <div className="inventory-container">
      <h1 className="inventory-center-title">ระบบคลังสินค้า</h1>
      <div className="d-flex justify-content-end mb-3 inventory-flex-end">
        <button className="inventory-btn-primary" onClick={handleAddStock}>
          เพิ่มรายการสินค้าคงคลัง
        </button>
      </div>
      <hr className="inventory-hr" />
      <div className="d-flex mb-3">
        <input
          type="text"
          className="inventory-form-control me-3"
          placeholder="ค้นหารายการสินค้าคงคลัง..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="EQM-form-control me-2"
          value={itemTypeFilter}
          onChange={(e) => setItemTypeFilter(e.target.value)}
          style={{ width: "150px" }}
        >
          <option value="all">ทั้งหมด</option>
          <option value="1">สินค้า</option>
          <option value="2">อุปกรณ์</option>
        </select>
        <select
          className="inventory-form-control"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ width: "150px" }}
        >
          <option value="all">ทุกสถานะ</option>
          <option value="0">พร้อมใช้งาน</option>
          <option value="1">ไม่พร้อมใช้งาน</option>
        </select>
      </div>
      {currentItems.length > 0 ? (
        <>
          <table className="inventory-table inventory-table-bordered">
            <thead className="inventory-table-primary">
              <tr>
                <th>รูปภาพ</th>
                <th>ชื่อรายการสินค้า</th>
                <th>หมายเลขประจำสินค้า</th>
                <th>สถานะ</th>
                <th>จำนวน</th>
                <th>หน่วย</th>
                <th>ประเภทสินค้า</th>
                <th>หมวดหมู่</th>
                <th>คลังสินค้า</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.uniqueKey}>
                  <td>
                    {item.image ? (
                      <img
                        className="inventory-img-fluid inventory-img-thumbnail"
                        src={getImagePath(item.imageUrl)}
                        alt={item.itemName || "ภาพสินค้าคงคลัง"}
                        onError={(e) => (e.target.src = "/placeholder.jpg")}
                      />
                    ) : (
                      <span className="inventory-text-muted">ไม่มีรูปภาพ</span>
                    )}
                  </td>
                  <td>{item.itemName}</td>
                  <td>{item.serialNumber || "-"}</td>
                  <td className={item.status === 1 ? "inventory-low-stock" : ""}>
                    {getStatusText(item.status)}
                  </td>
                  <td>{item.quantity || 0}</td>
                  <td>{item.units}</td>
                  <td>{itemTypes.find((type) => type.id === item.itemType)?.name || item.itemType}</td>
                  <td>{categories.find((cat) => cat.id === item.categoryID)?.name || item.categoryID}</td>
                  <td>{warehouseOptions.find((wh) => wh.warehouseID === item.warehouseID)?.warehouseName || item.warehouseName || "-"}</td>
                  <td>
                    <button className="inventory-btn-warning me-2" onClick={() => handleEditStock(item)}>
                      <i className="fas fa-edit"></i> แก้ไข
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-between mt-3">
            <button
              className="inventory-btn-outline-primary"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              หน้าก่อนหน้า
            </button>
            <span>
              หน้า {currentPage} จาก {Math.ceil(filteredData.length / itemsPerPage)}
            </span>
            <button
              className="inventory-btn-outline-primary"
              onClick={handleNextPage}
              disabled={currentPage >= Math.ceil(filteredData.length / itemsPerPage)}
            >
              หน้าถัดไป
            </button>
          </div>
        </>
      ) : (
        <div className="inventory-no-products">
          ไม่พบรายการสินค้าคงคลังที่ตรงกับคำค้นหา
        </div>
      )}
    </div>
  );
};

export default Inventory;