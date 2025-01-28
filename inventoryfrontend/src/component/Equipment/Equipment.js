import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';

const getImagePath = (filename) => {
  if (!filename) return ""; // ตรวจสอบว่า filename มีค่าหรือไม่
  const extractedFilename = filename.split("\\").pop(); 
  return `/asset/${extractedFilename}`;
};

const EquipmentForm = () => {
  const [equipmentData, setEquipmentData] = useState({
    eqmid: "",
    eqM_Name: "",
    eqmDescription: "",
    quantity: "",
    category_ID: "",
  });

  const [categories] = useState([
    { id: 1, name: "เครื่องมือวัดความดัน" },
    { id: 2, name: "อุปกรณ์ตรวจน้ำตาลในเลือด" },
    { id: 3, name: "เครื่องวัดอุณหภูมิ" },
    { id: 4, name: "เครื่องมือตรวจการได้ยิน" },
    { id: 5, name: "เครื่องวัดการเต้นหัวใจ" },
  ]);

  const [apiData, setApiData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ฟิลเตอร์ข้อมูลตามคำค้นหา
  const filteredData = apiData.filter((equipment) =>
    equipment.eqM_Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  // ดึงข้อมูลอุปกรณ์จาก API
  useEffect(() => {
    fetch("https://localhost:7294/api/Equipment/GetAllEquipmentCategory", {
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.responseCode === "200" && Array.isArray(data.data)) {
          const updatedData = data.data.map((equipment) => ({
            ...equipment,
            imageUrl: equipment.eqMimage, // ตรวจสอบค่า eqMimage
          }));
          setApiData(updatedData);
        } else {
          console.error("Invalid API data:", data);
        }
      })
      .catch((error) => console.error("Error fetching equipment:", error));
  }, []);

  const handleAdd = async () => {
    const { value: formValues, isConfirmed } = await Swal.fire({
      title: "Add New Equipment",
      html: `
        <input id="swal-input-name" class="swal2-input" placeholder="Equipment Name">
        <input id="swal-input-description" class="swal2-input" placeholder="Description">
        <input id="swal-input-quantity" class="swal2-input" type="number" placeholder="Quantity">
        <select id="swal-input-category" class="swal2-input">
          <option value="" disabled>Select a category</option>
          ${categories.map(
            (category) =>
              `<option value="${category.id}">${category.name}</option>`
          ).join('')}
        </select>
        <input id="swal-input-image" class="swal2-input" type="file">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Add',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return {
          eqM_Name: document.getElementById("swal-input-name").value,
          eqmDescription: document.getElementById("swal-input-description").value,
          quantity: document.getElementById("swal-input-quantity").value,
          category_ID: document.getElementById("swal-input-category").value,
          eqMimage: document.getElementById("swal-input-image").files[0]
        };
      }
    });

    if (!isConfirmed) {
      return; // Stop if user clicked Cancel
    }

    if (formValues) {
      if (!formValues.eqM_Name || !formValues.eqmDescription || !formValues.quantity || !formValues.category_ID) {
        Swal.fire("Error", "Please fill in all fields.", "error");
        return;
      }

      const formData = new FormData();
      formData.append("eqM_Name", formValues.eqM_Name);
      formData.append("eqmDescription", formValues.eqmDescription);
      formData.append("quantity", formValues.quantity);
      formData.append("category_ID", formValues.category_ID);
      formData.append("adddate", new Date().toISOString());
      if (formValues.eqMimage) {
        formData.append("eqMimage", formValues.eqMimage);
      }

      try {
        const response = await fetch("https://localhost:7294/api/Equipment/addimage", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          Swal.fire("Success", "Equipment added successfully!", "success");
          window.location.reload(); // Refresh the page after adding
        } else {
          Swal.fire("Error", "Failed to add equipment.", "error");
        }
      } catch (error) {
        console.error("Error adding equipment:", error);
        Swal.fire("Error", "Failed to add equipment. Please try again.", "error");
      }
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("คุณยืนยันที่จะลบอุปกรณ์ใช่หรือไม่?")) {
      fetch(`https://localhost:7294/api/Equipment/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            alert("ลบอุปกรณ์สำเร็จ!");
            setApiData(apiData.filter((equipment) => equipment.eqmid !== id));
          } else {
            alert("Failed to delete equipment.");
          }
        })
        .catch((error) => {
          console.error("Error deleting equipment:", error);
          alert("Error deleting equipment. Please try again.");
        });
    }
  };

  const handleEdit = (equipment) => {
    Swal.fire({
      title: "Edit Equipment",
      html: `
        <input id="swal-input-name" class="swal2-input" value="${equipment.eqM_Name}" placeholder="Equipment Name">
        <input id="swal-input-description" class="swal2-input" value="${equipment.eqmDescription}" placeholder="Description">
        <input id="swal-input-quantity" class="swal2-input" type="number" value="${equipment.quantity}" placeholder="Quantity">
        <select id="swal-input-category" class="swal2-input">
          <option value="" disabled>Select a category</option>
          ${categories.map(
            (category) =>
              `<option value="${category.id}" ${category.id === equipment.category_ID ? "selected" : ""}>${category.name}</option>`
          ).join('')}
        </select>
        <input id="swal-input-image" class="swal2-input" type="file">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Save Changes",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        return {
          eqM_Name: document.getElementById("swal-input-name").value,
          eqmDescription: document.getElementById("swal-input-description").value,
          quantity: document.getElementById("swal-input-quantity").value,
          category_ID: document.getElementById("swal-input-category").value,
          eqMimage: document.getElementById("swal-input-image").files[0]
        };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const updatedEquipment = result.value;
        if (!updatedEquipment.eqM_Name || !updatedEquipment.eqmDescription || !updatedEquipment.quantity || !updatedEquipment.category_ID) {
          Swal.fire("Error", "Please fill in all fields.", "error");
          return;
        }

        const formData = new FormData();
        formData.append("eqM_Name", updatedEquipment.eqM_Name);
        formData.append("eqmDescription", updatedEquipment.eqmDescription);
        formData.append("quantity", updatedEquipment.quantity);
        formData.append("category_ID", updatedEquipment.category_ID);
        if (updatedEquipment.eqMimage) {
          formData.append("eqMimage", updatedEquipment.eqMimage);
        }

        try {
          const response = await fetch(`https://localhost:7294/api/Equipment/update/${equipment.eqmid}`, {
            method: "PUT",
            body: formData,
          });

          if (response.ok) {
            Swal.fire("Success", "Equipment updated successfully!", "success");
            setApiData(apiData.map((item) => (item.eqmid === equipment.eqmid ? { ...item, ...updatedEquipment } : item)));
          } else {
            Swal.fire("Error", "Failed to update equipment.", "error");
          }
        } catch (error) {
          console.error("Error updating equipment:", error);
          Swal.fire("Error", "Failed to update equipment. Please try again.", "error");
        }
      }
    });
  };

  return (
    <div className="container mt-5">
      <h1 className="center-title">รายการอุปกรณ์</h1>

      <div className="text-end">
        <button className="btn btn-primary" onClick={handleAdd}>Add Equipment</button>
      </div>
      <hr />

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search equipment..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((equipment) => (
            <tr key={equipment.eqmid}>
              <td>
                {equipment.eqMimage ? (
                  <div className="product-image-container">
                    <img
                      className="product-image"
                      src={getImagePath(equipment.imageUrl)}
                      alt={equipment.eqM_Name || "Equipment Image"}
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                ) : (
                  <span>No image</span>
                )}
              </td>
              <td>{equipment.eqM_Name}</td>
              <td>{equipment.eqmDescription}</td>
              <td>{equipment.quantity}</td>
              <td className="action-buttons">
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(equipment)}
                >
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(equipment.eqmid)}
                >
                  <i className="fas fa-trash"></i> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="d-flex justify-content-between">
        <button className="btn btn-secondary" onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EquipmentForm;
