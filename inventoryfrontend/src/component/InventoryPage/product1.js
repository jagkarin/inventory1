import React, { useState, useEffect } from "react";

// ฟังก์ชันการดึง path ของรูปภาพจาก public
const getImagePath = (filename) => `/asset/${filename}`;

const UpdateProductForm = () => {
  const [productData, setProductData] = useState({
    productsID: "", // เพิ่ม productsID ให้เริ่มต้น
    productsName: "",
    description: "",
    quantity: "",
    categoriesID: "",
  });
  const [categories] = useState([
    { id: 1, name: "Electronic" },
    { id: 2, name: "Computer" },
    { id: 3, name: "OPD" },
  ]); // รายการ Category ที่กำหนดเอง
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [apiData, setApiData] = useState([]);

  // ดึงข้อมูลสินค้าจาก API
  useEffect(() => {
    fetch("https://localhost:7294/api/Product/GetAllProductCategory", {
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.responseCode === "200" && Array.isArray(data.data)) {
          setApiData(data.data); // ใช้ข้อมูลใน data ของ API
        } else {
          console.error("Invalid API data:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  // จัดการเปลี่ยนค่าฟิลด์ในฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  // จัดการอัปโหลดไฟล์
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // แก้ไขข้อมูลสินค้า
  const handleEdit = (product) => {
    setIsEditing(true);
    setProductData({
      productsID: product.productsID,  // เพิ่มการตั้งค่า productsID
      productsName: product.productsName,
      description: product.description,
      quantity: product.quantity,
      categoriesID: product.categoriesID, // ใช้ categoriesID จาก API
    });
  };

  // ส่งข้อมูลไปยัง API
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("productsName", productData.productsName);
    formData.append("description", productData.description);
    formData.append("quantity", productData.quantity);
    formData.append("categoriesID", productData.categoriesID);
    formData.append("adddate", new Date().toISOString());
    if (selectedFile) {
      formData.append("productImage", selectedFile);
    }

    if (!productData.productsID) {
      console.error("No product ID found, cannot update.");
      return;
    }

    // ตรวจสอบว่า productsID ถูกส่งใน URL
    fetch(`https://localhost:7294/api/Product/updateProduct/${productData.productsID}`, {
      method: "PUT",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          alert("Product updated successfully!");
        } else {
          alert("Failed to update product.");
        }
      })
      .catch((error) => {
        console.error("Error updating product:", error);
        alert("Error updating product. Please try again.");
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">{isEditing ? "Edit Product" : "Update Product"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            name="productsName"
            value={productData.productsName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={productData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Quantity</label>
          <input
            type="number"
            className="form-control"
            name="quantity"
            value={productData.quantity}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            name="categoriesID"
            value={productData.categoriesID}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Product Image</label>
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {isEditing ? "Save Changes" : "Update Product"}
        </button>
      </form>

      {/* แสดงข้อมูล API */}
      <h3 className="mt-5">Products List</h3>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Category</th>
            <th>Product Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {apiData.map((product) => (
            <tr key={product.productsID}>
              <td>{product.productsName}</td>
              <td>{product.description}</td>
              <td>{product.quantity}</td>
              <td>{product.categoriesName}</td>
              <td>
                {product.productimage ? (
                  <div className="product-image-container">
                    <img
                      className="product-image"
                      src={getImagePath(product.productimage.split('/').pop())} // ใช้ split('/') แทน
                      alt="Product"
                    />
                  </div>
                ) : (
                  "No image"
                )}
              </td>
              <td>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpdateProductForm;
