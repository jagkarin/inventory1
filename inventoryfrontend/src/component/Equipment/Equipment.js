import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
// import { useLocation } from "react-router-dom";
import "./css/EQM.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const getImagePath = (filename) => {
  if (!filename || typeof filename !== "string" || filename.trim() === "") {
    return "https://dummyimage.com/100x100/455ede/ffffff";
  }
  const baseUrl = "https://localhost:7294";
  return `${baseUrl}${filename}`;
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const EquipmentForm = () => {
  const [categories] = useState([
    { id: 1, name: "เครื่องมือวัดความดัน" },
    { id: 2, name: "อุปกรณ์ตรวจน้ำตาลในเลือด" },
    { id: 3, name: "เครื่องวัดอุณหภูมิ" },
    { id: 4, name: "เครื่องมือตรวจการได้ยิน" },
    { id: 5, name: "เครื่องวัดการเต้นหัวใจ" },
  ]);

  const [apiData, setApiData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showOptions, setShowOptions] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const filteredData = apiData.filter((equipment) => {
    const matchesSearch = equipment?.eqM_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
    const matchesCategory = selectedCategory === "all" || parseInt(equipment.category_ID) === parseInt(selectedCategory);
    return matchesSearch && matchesCategory;
  });

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

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
    setShowOptions(false);
  };

  const fetchEquipment = async () => {
    try {
      const response = await fetch("https://localhost:7294/api/Equipment/GetAllEquipmentCategory", {
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data.responseCode === "200" && Array.isArray(data.data)) {
        const updatedData = data.data.map((equipment) => ({
          ...equipment,
          eqM_Name: equipment.eqM_Name || "",
          imageUrl: equipment.eqMimage || "",
        }));
        setApiData(updatedData);
      } else {
        Swal.fire("Error", "Failed to fetch equipment data.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to fetch equipment data. Please try again.", "error");
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const handleAdd = async () => {
    const { value: formValues, isConfirmed } = await Swal.fire({
      title: "เพิ่มอุปกรณ์ใหม่",
      html: `
        <div class="eqm-swal-form">
          <div class="eqm-swal-input-group">
            <label for="swal-input-name" class="eqm-swal-label">ชื่ออุปกรณ์</label>
            <input id="swal-input-name" class="swal2-input eqm-swal-input" placeholder="กรุณากรอกชื่ออุปกรณ์">
          </div>
          <div class="eqm-swal-input-group">
            <label for="swal-input-description" class="eqm-swal-label">คำอธิบาย</label>
            <textarea id="swal-input-description" class="swal2-input eqm-swal-input" placeholder="กรุณากรอกคำอธิบาย" rows="3"></textarea>
          </div>
          <div class="eqm-swal-input-group">
            <label for="swal-input-quantity" class="eqm-swal-label">จำนวน</label>
            <input id="swal-input-quantity" class="swal2-input eqm-swal-input" type="number" placeholder="กรุณากรอกจำนวน">
          </div>
          <div class="eqm-swal-input-group">
            <label for="swal-input-category" class="eqm-swal-label">หมวดหมู่</label>
            <select id="swal-input-category" class="swal2-input eqm-swal-input">
              <option value="" disabled selected>เลือกหมวดหมู่</option>
              ${categories.map(category => `<option value="${category.id}">${category.name}</option>`).join('')}
            </select>
          </div>
          <div class="eqm-swal-input-group">
            <label for="swal-input-image" class="eqm-swal-label">รูปภาพ</label>
            <input id="swal-input-image" class="swal2-input eqm-swal-input" type="file" accept="image/*">
          </div>
        </div>
      `,
      customClass: {
        popup: 'eqm-swal-popup',
        title: 'eqm-swal-title',
        confirmButton: 'eqm-swal-confirm',
        cancelButton: 'eqm-swal-cancel',
        htmlContainer: 'eqm-swal-html',
      },
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'เพิ่ม',
      cancelButtonText: 'ยกเลิก',
      preConfirm: () => {
        const eqM_Name = document.getElementById("swal-input-name")?.value;
        const eqmDescription = document.getElementById("swal-input-description")?.value;
        const quantity = document.getElementById("swal-input-quantity")?.value;
        const category_ID = document.getElementById("swal-input-category")?.value;
        const eqMimage = document.getElementById("swal-input-image")?.files[0];
  
        if (!eqM_Name || !eqmDescription || !quantity || !category_ID) {
          Swal.showValidationMessage("กรุณากรอกข้อมูลให้ครบทุกช่อง.");
          return false;
        }
        return { eqM_Name, eqmDescription, quantity, category_ID, eqMimage };
      },
    });
  
    if (!isConfirmed || !formValues) return;
  
    const formData = new FormData();
    formData.append("eqM_Name", formValues.eqM_Name);
    formData.append("eqmDescription", formValues.eqmDescription);
    formData.append("quantity", formValues.quantity);
    formData.append("category_ID", formValues.category_ID);
    formData.append("adddate", new Date().toISOString());
    if (formValues.eqMimage) formData.append("eqMimage", formValues.eqMimage);
  
    try {
      const response = await fetch("https://localhost:7294/api/Equipment/addimage", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        await delay(1000);
        Swal.fire("สำเร็จ", "เพิ่มอุปกรณ์เรียบร้อยแล้ว!", "success");
        fetchEquipment();
      } else {
        throw new Error(await response.text());
      }
    } catch (error) {
      Swal.fire("ข้อผิดพลาด", `ไม่สามารถเพิ่มอุปกรณ์ได้: ${error.message}`, "error");
    }
  };


  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "คุณยืนยันที่จะลบอุปกรณ์นี้?",
      text: "การลบนี้ไม่สามารถกู้คืนได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
      customClass: {
        popup: 'eqm-swal-popup',
        title: 'eqm-swal-title',
        confirmButton: 'eqm-swal-confirm',
        cancelButton: 'eqm-swal-cancel',
        htmlContainer: 'eqm-swal-html',
      },
    });
  
    if (result.isConfirmed) {
      try {
        const response = await fetch(`https://localhost:7294/api/Equipment/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          Swal.fire({
            title: "สำเร็จ",
            text: "ลบอุปกรณ์เรียบร้อยแล้ว!",
            icon: "success",
            customClass: {
              popup: 'eqm-swal-popup',
              title: 'eqm-swal-title',
              confirmButton: 'eqm-swal-confirm',
            },
          });
          setApiData(apiData.filter((equipment) => equipment.eqmid !== id));
        } else {
          throw new Error(await response.text());
        }
      } catch (error) {
        Swal.fire({
          title: "ข้อผิดพลาด",
          text: `ไม่สามารถลบอุปกรณ์ได้: ${error.message}`,
          icon: "error",
          customClass: {
            popup: 'eqm-swal-popup',
            title: 'eqm-swal-title',
            confirmButton: 'eqm-swal-confirm',
          },
        });
      }
    }
  };

  const handleEdit = async (eqm) => {
  const { value: formValues, isConfirmed } = await Swal.fire({
    title: "แก้ไขอุปกรณ์",
    html: `
      <div class="eqm-swal-form">
        <div class="eqm-swal-input-group">
          <label for="swal-input-name" class="eqm-swal-label">ชื่ออุปกรณ์</label>
          <input id="swal-input-name" class="swal2-input eqm-swal-input" value="${eqm.eqM_Name}" placeholder="กรุณากรอกชื่ออุปกรณ์">
        </div>
        <div class="eqm-swal-input-group">
          <label for="swal-input-description" class="eqm-swal-label">คำอธิบาย</label>
          <textarea id="swal-input-description" class="swal2-input eqm-swal-input" placeholder="กรุณากรอกคำอธิบาย" rows="3">${eqm.eqmDescription}</textarea>
        </div>
        <div class="eqm-swal-input-group">
          <label for="swal-input-quantity" class="eqm-swal-label">จำนวน</label>
          <input id="swal-input-quantity" class="swal2-input eqm-swal-input" type="number" value="${eqm.quantity}" placeholder="กรุณากรอกจำนวน">
        </div>
        <div class="eqm-swal-input-group">
          <label for="swal-input-category" class="eqm-swal-label">หมวดหมู่</label>
          <select id="swal-input-category" class="swal2-input eqm-swal-input">
            <option value="" disabled>เลือกหมวดหมู่</option>
            ${categories.map(category => 
              `<option value="${category.id}" ${category.id === eqm.category_ID ? 'selected' : ''}>${category.name}</option>`
            ).join('')}
          </select>
        </div>
        <div class="eqm-swal-input-group">
          <label for="swal-input-image" class="eqm-swal-label">รูปภาพ</label>
          <input id="swal-input-image" class="swal2-input eqm-swal-input" type="file" accept="image/*">
        </div>
      </div>
    `,
    customClass: {
      popup: 'eqm-swal-popup',
      title: 'eqm-swal-title',
      confirmButton: 'eqm-swal-confirm',
      cancelButton: 'eqm-swal-cancel',
      htmlContainer: 'eqm-swal-html',
    },
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'บันทึก',
    cancelButtonText: 'ยกเลิก',
    preConfirm: () => {
      const eqM_Name = document.getElementById("swal-input-name")?.value;
      const eqmDescription = document.getElementById("swal-input-description")?.value;
      const quantity = document.getElementById("swal-input-quantity")?.value;
      const category_ID = document.getElementById("swal-input-category")?.value;
      const eqMimage = document.getElementById("swal-input-image")?.files[0];

      if (!eqM_Name || !eqmDescription || !quantity || !category_ID) {
        Swal.showValidationMessage("กรุณากรอกข้อมูลให้ครบทุกช่อง.");
        return false;
      }
      return { eqM_Name, eqmDescription, quantity, category_ID, eqMimage };
    },
  });

  if (!isConfirmed || !formValues) return;

  const formData = new FormData();
  formData.append("eqM_Name", formValues.eqM_Name);
  formData.append("eqmDescription", formValues.eqmDescription);
  formData.append("quantity", formValues.quantity);
  formData.append("category_ID", formValues.category_ID);
  formData.append("adddate", new Date().toISOString());
  if (formValues.eqMimage) formData.append("eqmImage", formValues.eqMimage);

  try {
    const response = await fetch(`https://localhost:7294/api/Equipment/updateEquipment/${eqm.eqmid}`, {
      method: "PUT",
      body: formData,
    });
    if (response.ok) {
      await delay(1000);
      Swal.fire("สำเร็จ", "แก้ไขอุปกรณ์เรียบร้อยแล้ว!", "success");
      fetchEquipment();
    } else {
      throw new Error(await response.text());
    }
  } catch (error) {
    Swal.fire("ข้อผิดพลาด", `ไม่สามารถแก้ไขอุปกรณ์ได้: ${error.message}`, "error");
  }
};

  return (
    <div className="EQM-container py-4">
      <h1 className="EQM-center-title mb-4">รายการอุปกรณ์</h1>

      <div className="d-flex justify-content-end align-items-center mb-4 flex-wrap gap-3">
        <div className="search-container position-relative">
          <input
            type="text"
            className="EQM-form-control EQM-shadow-sm"
            placeholder="ค้นหาอุปกรณ์..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '200px',
              paddingRight: '35px',
              transition: 'all 0.3s ease',
              borderRadius: '8px',
            }}
          />
          <i
            className="fas fa-search EQM-search-icon"
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#455ede',
              fontSize: '16px',
            }}
          />
        </div>

        <select
          className="EQM-form-select EQM-shadow-sm"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            width: '180px',
            borderRadius: '8px',
            padding: '8px',
            transition: 'all 0.3s ease',
          }}
        >
          <option value="all">ทุกหมวดหมู่</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <div className="position-relative">
          <i
            className="far fa-caret-square-down"
            style={{
              fontSize: '24px',
              color: '#455ede',
              cursor: 'pointer',
              transition: 'color 0.3s ease',
              marginTop: '5px',
            }}
            onClick={() => setShowOptions(!showOptions)}
            onMouseEnter={(e) => (e.target.style.color = '#3b50ce')}
            onMouseLeave={(e) => (e.target.style.color = '#455ede')}
          />
          {showOptions && (
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="EQM-form-select EQM-shadow-sm"
              style={{
                width: '150px',
                position: 'absolute',
                top: '100%',
                right: 0,
                zIndex: 1,
                borderRadius: '8px',
                marginTop: '5px',
              }}
            >
              <option value={5}>แสดง 5 รายการ</option>
              <option value={10}>แสดง 10 รายการ</option>
              <option value={15}>แสดง 15 รายการ</option>
            </select>
          )}
        </div>

        <button
          className="EQM-btn-primary EQM-shadow-sm d-flex align-items-center gap-2"
          onClick={handleAdd}
          style={{
            borderRadius: '8px',
            padding: '8px 16px',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
        >
          <i className="fas fa-plus-circle" style={{ fontSize: '18px' }}></i>
          <span>เพิ่มอุปกรณ์</span>
        </button>
      </div>

      <div className="EQM-text-muted text-center mb-3" style={{ fontSize: '14px' }}>
        <small>
          {filteredData.length === 0 ? (
            "ไม่พบรายการอุปกรณ์"
          ) : (
            `กำลังแสดง ${filteredData.length} รายการจาก ${apiData.length} รายการ ${
              selectedCategory !== "all"
                ? `ในหมวดหมู่ ${categories.find((cat) => cat.id === parseInt(selectedCategory))?.name || ""}`
                : ""
            }`
          )}
        </small>
      </div>

      <hr style={{ borderColor: '#d6e0ff', borderWidth: '2px', margin: '20px 0' }} />

      <div className="table-responsive">
        <table className="EQM-table EQM-table-bordered EQM-shadow-sm" style={{ overflow: 'hidden' }}>
          <thead className="EQM-table-primary">
            <tr>
              <th className="text-center py-3">ID</th>
              <th className="text-center py-3">Image</th>
              <th className="text-center py-3">Name</th>
              <th className="text-center py-3">Description</th>
              <th className="text-center py-3">Category</th>
              <th className="text-center py-3">Quantity</th>
              <th className="text-center py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((equipment) => (
              <tr key={equipment.eqmid} style={{ transition: 'background-color 0.2s ease' }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fc')}>
                <td className="text-center fw-bold text-dark py-3">{equipment.eqmid}</td>
                <td className="text-center py-3">
                  {equipment.eqMimage ? (
                    <img
                      className="EQM-img-fluid EQM-img-thumbnail EQM-shadow-sm"
                      src={getImagePath(equipment.eqMimage)}
                      alt={equipment.eqM_Name || "Equipment Image"}
                      onLoad={() => setImageLoading(false)}
                      style={{ maxWidth: '100px', height: 'auto', objectFit: 'contain', borderRadius: '8px' }}
                      onError={(e) => (e.target.src = "https://dummyimage.com/100x100/455ede/ffffff")}
                      onLoadStart={() => setImageLoading(true)}
                    />
                  ) : (
                    <span className="EQM-text-muted">No image</span>
                  )}
                  {imageLoading && <span className="EQM-loading-text">Loading...</span>}
                </td>
                <td className="text-dark py-3">{equipment.eqM_Name || 'ไม่ระบุชื่อ'}</td>
                <td className="text-dark py-3">{equipment.eqmDescription || 'ไม่มีคำอธิบาย'}</td>
                <td className="text-center py-3">
                  {categories.find((cat) => cat.id === parseInt(equipment.category_ID))?.name || "ไม่ระบุ"}
                </td>
                <td className="text-center fw-bold py-3">
                  <span className={equipment.quantity < 10 ? 'EQM-low-stock' : 'text-dark'}>
                    {equipment.quantity}
                  </span>
                </td>
                <td className="text-center py-3">
                  <div className="d-flex gap-2 justify-content-center">
                    <button
                      className="EQM-btn-warning EQM-shadow-sm d-flex align-items-center gap-1"
                      onClick={() => handleEdit(equipment)}
                      style={{ borderRadius: '6px' }}
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button
                      className="EQM-btn-danger EQM-shadow-sm d-flex align-items-center gap-1"
                      onClick={() => handleDelete(equipment.eqmid)}
                      style={{ borderRadius: '6px' }}
                    >
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {currentProducts.length === 0 && (
              <tr>
                <td colSpan="7" className="EQM-no-products py-4">
                  ไม่พบอุปกรณ์
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between mt-4 align-items-center flex-wrap gap-3">
        <button
          className="EQM-btn-outline-primary EQM-shadow-sm"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          style={{
            borderRadius: '8px',
            padding: '8px 20px',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#eef2ff')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
        >
          ย้อนกลับ
        </button>
        <span
          className="text-dark fw-bold"
          style={{ fontSize: '16px', color: '#2c3e50', textShadow: '0 1px 1px rgba(0, 0, 0, 0.05)' }}
        >
          หน้า {currentPage} / {Math.ceil(filteredData.length / itemsPerPage)}
        </span>
        <button
          className="EQM-btn-outline-primary EQM-shadow-sm"
          onClick={handleNextPage}
          disabled={currentPage >= Math.ceil(filteredData.length / itemsPerPage)}
          style={{
            borderRadius: '8px',
            padding: '8px 20px',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#eef2ff')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
};

export default EquipmentForm;