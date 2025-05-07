import Swal from "sweetalert2";

// ฟังก์ชันสำหรับเพิ่มรายการสินค้าใหม่
const handleAddProduct = async (categories, fetchProducts) => {
  const { value: formValues, isConfirmed } = await Swal.fire({
    title: '<h4 class="fw-bold text-primary product-center-title">เพิ่มรายการสินค้าใหม่</h4>',
    html: `
      <div class="product-container">
        <div class="row mb-2">
          <div class="col"><input id="swal-input-name" class="product-form-control form-control-sm" placeholder="ชื่อรายการสินค้า"></div>
        </div>
        <div class="row mb-2">
          <div class="col"><input id="swal-input-description" class="product-form-control" placeholder="คำอธิบาย"></div>
        </div>
        <div class="row mb-2">
          <div class="col"><input id="swal-input-quantity" class="product-form-control" type="number" placeholder="จำนวน"></div>
        </div>
        <div class="row mb-2">
          <div class="col">
            <select id="swal-input-category" class="product-form-select">
              <option value="" disabled selected>เลือกหมวดหมู่</option>
              ${categories.map((category) => `<option value="${category.id}">${category.name}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="row mb-2">
          <div class="col"><input id="swal-input-image" class="product-form-control" type="file"></div>
        </div>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'บันทึก',
    cancelButtonText: 'ยกเลิก',
    customClass: {
      confirmButton: "product-btn-primary",
      cancelButton: "btn btn-secondary btn-lg",
    },
    preConfirm: () => {
      return {
        productsName: document.getElementById("swal-input-name").value,
        description: document.getElementById("swal-input-description").value,
        quantity: document.getElementById("swal-input-quantity").value,
        categoriesID: document.getElementById("swal-input-category").value,
        productImage: document.getElementById("swal-input-image").files[0],
      };
    },
  });

  if (!isConfirmed) return;

  if (formValues) {
    if (formValues.quantity < 10) {
      Swal.fire("ข้อผิดพลาด", "จำนวนต้องมีอย่างน้อย 10 รายการ", "error");
      return;
    }

    if (!formValues.productsName || !formValues.quantity || !formValues.categoriesID) {
      Swal.fire("ข้อผิดพลาด", "กรุณากรอกข้อมูลให้ครบทุกช่อง", "error");
      return;
    }

    const formData = new FormData();
    formData.append("productsName", formValues.productsName);
    formData.append("description", formValues.description);
    formData.append("quantity", formValues.quantity);
    formData.append("categoriesID", formValues.categoriesID);
    formData.append("adddate", new Date().toISOString());
    if (formValues.productImage) formData.append("productImage", formValues.productImage);

    try {
      const response = await fetch("https://localhost:7294/api/Product/addimage", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        Swal.fire("สำเร็จ", "บันทึกรายการสินค้าใหม่เรียบร้อยแล้ว", "success");
        await fetchProducts();
      } else {
        Swal.fire("ข้อผิดพลาด", "ไม่สามารถบันทึกรายการสินค้าได้", "error");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการเพิ่มรายการสินค้า:", error);
      Swal.fire("ข้อผิดพลาด", "ไม่สามารถบันทึกรายการสินค้าได้ กรุณาลองใหม่", "error");
    }
  }
};

// ฟังก์ชันสำหรับแก้ไขรายการสินค้า
const handleEdit = async (product, categories, fetchProducts) => {
  const { value: formValues, isConfirmed } = await Swal.fire({
    html: `
      <div class="product-container">
        <div class="mb-2">
          <input id="swal-input-name" class="product-form-control" value="${product.productsName}" placeholder="ชื่อรายการสินค้า">
        </div>
        <div class="mb-2">
          <input id="swal-input-description" class="product-form-control" value="${product.description}" placeholder="คำอธิบาย">
        </div>
        <div class="mb-2">
          <input id="swal-input-quantity" class="product-form-control" type="number" value="${product.quantity}" placeholder="จำนวน">
        </div>
        <div class="mb-2">
          <select id="swal-input-category" class="product-form-select">
            <option value="" disabled>เลือกหมวดหมู่</option>
            ${categories
              .map(
                (category) =>
                  `<option value="${category.id}" ${category.id === product.categoriesID ? "selected" : ""}>${category.name}</option>`
              )
              .join("")}
          </select>
        </div>
        <div class="mb-2">
          <input id="swal-input-image" class="product-form-control" type="file">
        </div>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'บันทึกการแก้ไข',
    cancelButtonText: 'ยกเลิก',
    customClass: {
      confirmButton: "product-btn-primary",
      cancelButton: "btn btn-secondary btn-lg",
    },
    preConfirm: () => {
      return {
        productsName: document.getElementById("swal-input-name").value,
        description: document.getElementById("swal-input-description").value,
        quantity: document.getElementById("swal-input-quantity").value,
        categoriesID: document.getElementById("swal-input-category").value,
        productImage: document.getElementById("swal-input-image").files[0],
      };
    },
  });

  if (!isConfirmed) return;

  if (formValues) {
    if (formValues.quantity < 10) {
      Swal.fire("ข้อผิดพลาด", "จำนวนต้องมีอย่างน้อย 10 รายการ", "error");
      return;
    }

    if (!formValues.productsName || !formValues.description || !formValues.quantity || !formValues.categoriesID) {
      Swal.fire("ข้อผิดพลาด", "กรุณากรอกข้อมูลให้ครบทุกช่อง", "error");
      return;
    }

    const formData = new FormData();
    formData.append("productsName", formValues.productsName);
    formData.append("description", formValues.description);
    formData.append("quantity", formValues.quantity);
    formData.append("categoriesID", formValues.categoriesID);
    formData.append("adddate", new Date().toISOString());
    if (formValues.productImage) formData.append("productImage", formValues.productImage);

    try {
      const response = await fetch(`https://localhost:7294/api/Product/updateProduct/${product.productsID}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        Swal.fire("สำเร็จ", "บันทึกการแก้ไขรายการสินค้าเรียบร้อยแล้ว", "success");
        await fetchProducts();
      } else {
        Swal.fire("ข้อผิดพลาด", "ไม่สามารถบันทึกการแก้ไขรายการสินค้าได้", "error");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการแก้ไขรายการสินค้า:", error);
      Swal.fire("ข้อผิดพลาด", "ไม่สามารถบันทึกการแก้ไขรายการสินค้าได้ กรุณาลองใหม่", "error");
    }
  }
};

export { handleAddProduct, handleEdit };