import React, { useState, useEffect} from "react";
import Swal from 'sweetalert2';
import './css/product.css';




// ฟังก์ชันการดึง path ของรูปภาพจาก public
const getImagePath = (filename) => {
  if (!filename) return ""; // ตรวจสอบว่า filename มีค่าหรือไม่
  const extractedFilename = filename.split("\\").pop(); 
  return `/asset/${extractedFilename}`;
};



const Inventory = () => {
  const [productData, setProductData] = useState({
    productsName: "",
    description: "",
    quantity: "",
    categoriesID: "",
  });
  const [categories] = useState([
    { id: 1, name: "Electronic" },
    { id: 2, name: "Computer" },
    { id: 3, name: "OPD" },
  ]);
  const [apiData, setApiData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  

  // ฟิลเตอร์ข้อมูลตามคำค้นหา
  const filteredData = apiData.filter((product) =>
    product.productsName.toLowerCase().includes(searchTerm.toLowerCase())
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

 

  // ดึงข้อมูลสินค้าจาก API
  useEffect(() => {
    fetch("https://localhost:7294/api/Product/GetAllProductCategory", {
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.responseCode === "200" && Array.isArray(data.data)) {
          const updatedData = data.data.map((product) => ({
            ...product,
            imageUrl: product.productimage, // ตรวจสอบค่า productimage
          }));
          setApiData(updatedData);
        } else {
          console.error("Invalid API data:", data);
        }
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);
  


  const handleAddProduct = async () => {
    const { value: formValues, isConfirmed } = await Swal.fire({
      title: "Add New Product",
      html: `
        <input id="swal-input-name" class="swal2-input" placeholder="Product Name">
        <input id="swal-input-description" class="swal2-input" placeholder="Description">
        <input id="swal-input-quantity" class="swal2-input" type="number" placeholder="Quantity">
        <select id="swal-input-category" class="swal2-input">
          <option value="" disabled selected>Select a category</option>
          ${categories.map(
            (category) =>
              `<option value="${category.id}">${category.name}</option>`
          ).join('')}
        </select>
        <input id="swal-input-image" class="swal2-input" type="file">
      `,
      focusConfirm: false,
      showCancelButton: true, // แสดงปุ่ม Cancel
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return {
          productsName: document.getElementById("swal-input-name").value,
          description: document.getElementById("swal-input-description").value,
          quantity: document.getElementById("swal-input-quantity").value,
          categoriesID: document.getElementById("swal-input-category").value,
          productImage: document.getElementById("swal-input-image").files[0]
        };
      }
    });
  
    if (!isConfirmed) {
      return; // ถ้าผู้ใช้กด Cancel ให้หยุดทำงาน
    }
  
    if (formValues) {
      // ตรวจสอบข้อมูลก่อนเพิ่ม
      if (!formValues.productsName || !formValues.description || !formValues.quantity || !formValues.categoriesID) {
        Swal.fire("Error", "Please fill in all fields.", "error");
        return;
      }
  
      const formData = new FormData();
      formData.append("productsName", formValues.productsName);
      formData.append("description", formValues.description);
      formData.append("quantity", formValues.quantity);
      formData.append("categoriesID", formValues.categoriesID);
      formData.append("adddate", new Date().toISOString());
      if (formValues.productImage) {
        formData.append("productImage", formValues.productImage);
      }
  
      try {
        const response = await fetch("https://localhost:7294/api/Product/addimage", {
          method: "POST",
          body: formData,
        });
  
        if (response.ok) {
          Swal.fire("Success", "Product added successfully!", "success");
          window.location.reload(); // รีเฟรชหน้าหลังเพิ่มสินค้า
        } else {
          Swal.fire("Error", "Failed to add product.", "error");
        }
      } catch (error) {
        console.error("Error adding product:", error);
        Swal.fire("Error", "Failed to add product. Please try again.", "error");
      }
    }
  };
  
  const handleEdit = async (product) => {
    const { value: formValues, isConfirmed } = await Swal.fire({
      title: "Edit Product",
      html: `
        <input id="swal-input-name" class="swal2-input" value="${product.productsName}" placeholder="Product Name">
        <input id="swal-input-description" class="swal2-input" value="${product.description}" placeholder="Description">
        <input id="swal-input-quantity" class="swal2-input" type="number" value="${product.quantity}" placeholder="Quantity">
        <select id="swal-input-category" class="swal2-input">
          <option value="" disabled>Select a category</option>
          ${categories.map(
            (category) =>
              `<option value="${category.id}" ${category.id === product.categoriesID ? 'selected' : ''}>${category.name}</option>`
          ).join('')}
        </select>
        <input id="swal-input-image" class="swal2-input" type="file">
      `,
      focusConfirm: false,
      showCancelButton: true, // แสดงปุ่ม Cancel
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return {
          productsName: document.getElementById("swal-input-name").value,
          description: document.getElementById("swal-input-description").value,
          quantity: document.getElementById("swal-input-quantity").value,
          categoriesID: document.getElementById("swal-input-category").value,
          productImage: document.getElementById("swal-input-image").files[0]
        };
      }
    });
  
    if (!isConfirmed) {
      return; // ถ้าผู้ใช้กด Cancel ให้หยุดทำงาน
    }
  
    if (formValues) {
      // ตรวจสอบข้อมูลก่อนแก้ไข
      if (!formValues.productsName || !formValues.description || !formValues.quantity || !formValues.categoriesID) {
        Swal.fire("Error", "Please fill in all fields.", "error");
        return;
      }
  
      const formData = new FormData();
      formData.append("productsName", formValues.productsName);
      formData.append("description", formValues.description);
      formData.append("quantity", formValues.quantity);
      formData.append("categoriesID", formValues.categoriesID);
      formData.append("adddate", new Date().toISOString());
      if (formValues.productImage) {
        formData.append("productImage", formValues.productImage);
      }
  
      try {
        const response = await fetch(`https://localhost:7294/api/Product/updateProduct/${product.productsID}`, {
          method: "PUT",
          body: formData,
        });
  
        if (response.ok) {
          Swal.fire("Success", "Product updated successfully!", "success");
          window.location.reload(); // รีเฟรชหน้าหลังแก้ไขสินค้า
        } else {
          Swal.fire("Error", "Failed to update product.", "error");
        }
      } catch (error) {
        console.error("Error updating product:", error);
        Swal.fire("Error", "Failed to update product. Please try again.", "error");
      }
    }
  };
  
  
  
  
  const handleDelete = (id) => {
    if (window.confirm("คุณยืนยันที่จะลบสินค้าใช่หรือไม่?")) {
      fetch(`https://localhost:7294/api/Product/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            alert("ลบสินค้าสำเร็จ!");
            setApiData(apiData.filter((product) => product.productsID !== id));
          } else {
            alert("Failed to delete product.");
          }
        })
        .catch((error) => {
          console.error("Error deleting product:", error);
          alert("Error deleting product. Please try again.");
        });
    }
  };

  
  
  
  
  return (
    <div className="container mt-5">
      <h1 className="center-title">รายการสินค้า</h1>

      <div className="text-end">
  <button className="btn btn-primary" onClick={handleAddProduct}>Add Product</button>
</div>
<hr />

      

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search products..."
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
  {currentProducts.map((product, index) => (
    <tr key={product.productsID}>
      <td>
        {product.productimage ? (
          <div className="product-image-container">
            <img
              className="product-image"
              src={getImagePath(product.imageUrl)}
              alt={product.productsName || "Product Image"}
              style={{
                width: "150px", // กำหนดขนาดกว้าง
                height: "150px", // กำหนดขนาดสูง
                objectFit: "contain", // ใช้ "contain" เพื่อให้รูปอยู่ในขอบเขตโดยไม่ถูกตัด
              }}
            />
          </div>
        ) : (
          <span>No image</span>
        )}
      </td>
      <td>{product.productsName}</td>
      <td>{product.description}</td>
      <td>{product.quantity}</td>
      <td className="action-buttons">
        <button
          className="btn btn-sm btn-warning me-2"
          onClick={() => handleEdit(product)}
        >
          <i className="fas fa-edit"></i> Edit
        </button>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => handleDelete(product.productsID)}
        >
          <i className="fas fa-trash"></i> Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>

  </table>

<div className="d-flex justify-content-between mt-3">


  <button
    className="btn btn-outline-secondary"
    onClick={handlePrevPage}
    disabled={currentPage === 1}
  >
    Previous
  </button>
  <span>
    Page {currentPage} of {Math.ceil(filteredData.length / itemsPerPage)}
  </span>
  <button
    className="btn btn-outline-secondary"
    onClick={handleNextPage}
    disabled={currentPage >= Math.ceil(filteredData.length / itemsPerPage)}
  >
    Next
  </button>
</div>

    </div>
  );
};

export default Inventory; 