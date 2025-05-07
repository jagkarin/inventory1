import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import EditItemForm from "./EditItemForm.js";
import "./css/EQM.css";

const getImagePath = (filename) => {
  if (!filename || typeof filename !== "string" || filename.trim() === "") {
    return "";
  }
  const baseUrl = "https://localhost:7294";
  return `${baseUrl}${filename}`;
};

const ItemTable = ({ categories, onDataChange }) => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemTypeFilter, setItemTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchItems = async () => {
    try {
      const response = await fetch(
        "https://localhost:7294/api/ItemMaster/GetAllItemMaster",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("API Response:", data);

      let fetchedItems = [];
      if (Array.isArray(data)) {
        fetchedItems = data;
      } else if (data.data && Array.isArray(data.data)) {
        fetchedItems = data.data;
      } else if (data && typeof data === "object" && data.itemID) {
        fetchedItems = [data];
      } else {
        throw new Error("Unexpected JSON response format");
      }

      const updatedData = fetchedItems.map((item) => ({
        itemID: item.itemID || 0,
        itemName: item.itemName || "",
        description: item.description || "",
        quantity: item.quantity || 0,
        units: item.units || "", // Added units field
        status: item.status || 0,
        itemType: item.itemType || 1,
        categoryID: item.categoryID || 1,
        serialNumber: item.serialNumber || "",
        image: item.image || "",
        createdAt: item.createdAt || "",
      }));
      setItems(updatedData);
      console.log("Updated Data:", updatedData);
      if (onDataChange) onDataChange(fetchItems);
    } catch (error) {
      console.error("Fetch error:", error);
      Swal.fire({
        title: "Error",
        text: `Failed to fetch item data: ${error.message}`,
        icon: "error",
        customClass: {
          popup: "eqm-swal-popup",
          title: "eqm-swal-title",
          confirmButton: "eqm-swal-confirm",
        },
      });
      setItems([]);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredData = Array.isArray(items)
    ? items.filter((item) => {
        const matchesSearch =
          item && item.itemName && typeof item.itemName === "string"
            ? item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
            : false;
        const matchesItemType =
          itemTypeFilter === "all" ||
          (itemTypeFilter === "1" && item.itemType === 1) ||
          (itemTypeFilter === "2" && item.itemType === 2);
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "1" && item.status === 1) ||
          (statusFilter === "0" && item.status === 0);
        return matchesSearch && matchesItemType && matchesStatus;
      })
    : [];

  const currentProducts = filteredData.slice(
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

  return (
    <div className="EQM-container mt-5">
      <hr className="EQM-hr" />
      <div className="d-flex align-items-center mb-3">
        <div className="search-container d-flex align-items-center" style={{ flex: 1 }}>
          <input
            type="text"
            className="EQM-form-control me-2"
            placeholder="Search items..."
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
            className="EQM-form-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: "150px" }}
          >
            <option value="all">สถานะทั้งหมด</option>
            <option value="1">พร้อมเบิก</option>
            <option value="0">ไม่พร้อมเบิก</option>
          </select>
        </div>
      </div>

      <table className="EQM-table EQM-table-bordered">
        <thead className="EQM-table-primary">
          <tr>
            <th>รูปภาพ</th>
            <th>ชื่อ</th>
            <th>รายละเอียด</th>
            <th>หน่วยนับ</th> {/* Added Units column header */}
            <th>สถานะ</th>
            <th>ประเภทรายการ</th>
            <th>หมวดหมู่</th>
            <th>แก้ไข</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.length > 0 ? (
            currentProducts.map((item) => (
              <tr key={item.itemID}>
                <td>
                  {item.image ? (
                    <div
                      className="product-image-container"
                      style={{ width: "150px", height: "150px", overflow: "hidden" }}
                    >
                      <img
                        key={item.itemID}
                        className="EQM-img-fluid EQM-img-thumbnail"
                        src={getImagePath(item.image)}
                        alt={item.itemName || "Item Image"}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          display: "block",
                        }}
                        onError={(e) => {
                          console.error(
                            `Failed to load image: ${getImagePath(item.image)}`
                          );
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  ) : (
                    <span className="EQM-text-muted">No image</span>
                  )}
                </td>
                <td>{item.itemName}</td>
                <td>{item.description}</td>
                <td>{item.units || "N/A"}</td> {/* Added Units column data */}
                <td>{item.status === 1 ? "พร้อมเบิก" : "ไม่พร้อมเบิก"}</td>
                <td>{item.itemType === 1 ? "สินค้า" : "อุปกรณ์"}</td>
                <td>
                  {categories.find((cat) => cat.id === item.categoryID)?.name ||
                    item.categoryID}
                </td>
                <td className="action-buttons">
                  <EditItemForm
                    categories={categories}
                    item={item}
                    onRefresh={fetchItems}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="EQM-no-products"> {/* Updated colSpan to 8 */}
                No items found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="d-flex justify-content-between mt-3">
        <button
          className="EQM-btn-outline-primary"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="EQM-btn-outline-primary"
          onClick={handleNextPage}
          disabled={
            currentPage === Math.ceil(filteredData.length / itemsPerPage)
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ItemTable;



