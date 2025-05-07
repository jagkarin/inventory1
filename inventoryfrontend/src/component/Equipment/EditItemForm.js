import React from "react";
import Swal from "sweetalert2";
import "./css/EQM.css";

const EditItemForm = ({ categories, item, onRefresh }) => {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleEdit = async () => {
    const { value: formValues, isConfirmed } = await Swal.fire({
      title: "แก้ไขไอเทม",
      customClass: {
        popup: "eqmBorrow-popup",
        title: "eqmBorrow-title",
        htmlContainer: "eqmBorrow-html",
        confirmButton: "eqmBorrow-confirm",
        cancelButton: "eqmBorrow-cancel",
        actions: "swal2-actions",
      },
      html: `
  <div class="eqmBorrow-form">
    <div class="eqmBorrow-input-group">
      <label class="eqmBorrow-label" for="eqmBorrow-input-name">ชื่อ</label>
      <input id="eqmBorrow-input-name" class="eqmBorrow-input" value="${item.itemName}" placeholder="กรุณากรอกชื่อไอเท็ม" required>
    </div>
    <div class="eqmBorrow-input-group">
      <label class="eqmBorrow-label" for="eqmBorrow-input-description">คำอธิบาย</label>
      <textarea id="eqmBorrow-input-description" class="eqmBorrow-input" placeholder="กรุณากรอกรายละเอียด">${item.description || ''}</textarea>
    </div>
    <div class="eqmBorrow-input-group">
      <label class="eqmBorrow-label" for="eqmBorrow-input-units">หน่วย</label>
      <input id="eqmBorrow-input-units" class="eqmBorrow-input" value="${item.units || ''}" placeholder="กรุณากรอกหน่วย (เช่น ชิ้น, กก., ม.)" required>
    </div>
    <div class="eqmBorrow-input-group">
      <label class="eqmBorrow-label" for="eqmBorrow-input-status">สถานะ</label>
      <select id="eqmBorrow-input-status" class="eqmBorrow-input">
        <option value="0" ${item.status === 0 ? "selected" : ""}>ไม่พร้อมเบิก</option>
        <option value="1" ${item.status === 1 ? "selected" : ""}>พร้อมเบิก</option>
      </select>
    </div>
    <div class="eqmBorrow-input-group">
      <label class="eqmBorrow-label" for="eqmBorrow-input-itemtype">ประเภท</label>
      <select id="eqmBorrow-input-itemtype" class="eqmBorrow-input">
        <option value="1" ${item.itemType === 1 ? "selected" : ""}>สินค้า</option>
        <option value="2" ${item.itemType === 2 ? "selected" : ""}>อุปกรณ์</option>
      </select>
    </div>
    <div class="eqmBorrow-input-group">
      <label class="eqmBorrow-label" for="eqmBorrow-input-category">หมวดหมู่</label>
      <select id="eqmBorrow-input-category" class="eqmBorrow-input" required>
        ${categories
          .filter(category => category.itemType === item.itemType || category.id === item.categoryID)
          .map(
            (category) =>
              `<option value="${category.id}" ${category.id === item.categoryID ? "selected" : ""}>${category.name}</option>`
          )
          .join("")}
      </select>
    </div>
    <div class="eqmBorrow-input-group">
      <label class="eqmBorrow-label" for="eqmBorrow-input-image">รูปภาพ</label>
      <input id="eqmBorrow-input-image" class="eqmBorrow-input" type="file" accept="image/*">
      ${item.imageUrl
          ? `<img src="${item.imageUrl}" class="EQM-img-fluid EQM-img-thumbnail" style="max-width: 100px; margin-top: 10px;" alt="Current item image">`
          : ""}
    </div>
  </div>
  <script>
    // ฟังก์ชันสำหรับอัปเดตหมวดหมู่ตาม itemType
    function updateCategoryOptions(selectedItemType) {
      const categorySelect = document.getElementById("eqmBorrow-input-category");
      const categories = ${JSON.stringify(categories)};
      categorySelect.innerHTML = categories
        .filter(category => category.itemType === parseInt(selectedItemType))
        .map(category => 
          \`<option value="\${category.id}">\${category.name}</option>\`
        )
        .join("");
      // ถ้าไม่มีหมวดหมู่ที่ตรงกัน ให้เพิ่มตัวเลือกว่าง
      if (categorySelect.innerHTML === "") {
        categorySelect.innerHTML = '<option value="" disabled selected>ไม่มีหมวดหมู่สำหรับประเภทนี้</option>';
      }
    }

    // เพิ่ม event listener สำหรับการเปลี่ยน itemType
    document.getElementById("eqmBorrow-input-itemtype").addEventListener("change", function() {
      const selectedItemType = this.value;
      updateCategoryOptions(selectedItemType);
    });
  </script>
`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "บันทึก",
      cancelButtonText: "ยกเลิก",
      allowOutsideClick: false,
      allowEscapeKey: true,
      didClose: () => {
        const swalContainer = document.querySelector(".swal2-container");
        if (swalContainer) {
          swalContainer.style.display = "none";
          swalContainer.style.opacity = "0";
        }
      },
      preConfirm: () => {
        const itemName = document.getElementById("eqmBorrow-input-name")?.value?.trim() || item.itemName;
        const description = document.getElementById("eqmBorrow-input-description")?.value?.trim() || item.description || '';
        const units = document.getElementById("eqmBorrow-input-units")?.value?.trim() || item.units;
        const status = document.getElementById("eqmBorrow-input-status")?.value || item.status.toString();
        const itemType = document.getElementById("eqmBorrow-input-itemtype")?.value || item.itemType.toString();
        const categoryID = document.getElementById("eqmBorrow-input-category")?.value || item.categoryID.toString();
        const image = document.getElementById("eqmBorrow-input-image")?.files[0] || null;

        if (!itemName || !units || !status || !itemType || !categoryID) {
          Swal.showValidationMessage("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
          return false;
        }

        if (itemName.length < 3) {
          Swal.showValidationMessage("ชื่อไอเท็มต้องมีอย่างน้อย 3 ตัวอักษร");
          return false;
        }
        if (itemName.length > 100) {
          Swal.showValidationMessage("ชื่อไอเท็มยาวเกินไป (สูงสุด 100 ตัวอักษร)");
          return false;
        }
        const invalidNameChars = /[!@#$%^&*()_+\-=[]{};':"\\|,.<>?]/;
        if (invalidNameChars.test(itemName)) {
          Swal.showValidationMessage("ชื่อไอเท็มไม่สามารถมีอักขระพิเศษได้");
          return false;
        }

        if (description && description.length > 500) {
          Swal.showValidationMessage("คำอธิบายยาวเกินไป (สูงสุด 500 ตัวอักษร)");
          return false;
        }

        if (units.length < 1) {
          Swal.showValidationMessage("หน่วยต้องมีอย่างน้อย 1 ตัวอักษร");
          return false;
        }
        if (units.length > 20) {
          Swal.showValidationMessage("หน่วยยาวเกินไป (สูงสุด 20 ตัวอักษร)");
          return false;
        }
        const invalidUnitsChars = /[!@#$%^&*()_+\-=[]{};':"\\|,.<>?]/;
        if (invalidUnitsChars.test(units)) {
          Swal.showValidationMessage("หน่วยไม่สามารถมีอักขระพิเศษได้");
          return false;
        }

        if (status !== "0" && status !== "1") {
          Swal.showValidationMessage("กรุณาเลือกสถานะที่ถูกต้อง");
          return false;
        }

        if (itemType !== "1" && itemType !== "2") {
          Swal.showValidationMessage("กรุณาเลือกประเภทไอเท็มที่ถูกต้อง");
          return false;
        }

        if (!categories.some(category => category.id === parseInt(categoryID))) {
          Swal.showValidationMessage("กรุณาเลือกหมวดหมู่ที่ถูกต้อง");
          return false;
        }

        if (image) {
          const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
          if (!validImageTypes.includes(image.type)) {
            Swal.showValidationMessage("รูปภาพต้องเป็นไฟล์ประเภท JPEG, PNG หรือ GIF เท่านั้น");
            return false;
          }
          const maxSize = 5 * 1024 * 1024; // 5MB
          if (image.size > maxSize) {
            Swal.showValidationMessage("ขนาดรูปภาพต้องไม่เกิน 5MB");
            return false;
          }
        }

        return {
          itemName,
          description,
          units,
          status,
          itemType,
          categoryID,
          image,
        };
      },
    });

    if (isConfirmed && formValues) {
      const formData = new FormData();
      formData.append("itemID", item.itemID);
      formData.append("itemName", formValues.itemName);
      formData.append("description", formValues.description);
      formData.append("units", formValues.units);
      formData.append("status", formValues.status);
      formData.append("itemType", formValues.itemType);
      formData.append("categoryID", formValues.categoryID);
      if (formValues.image) {
        formData.append("image", formValues.image);
      }
      formData.append("createdAt", new Date().toISOString());

      try {
        const response = await fetch(
          `https://localhost:7294/api/ItemMaster/updateitemmaster/${item.itemID}`,
          {
            method: "PUT",
            body: formData,
          }
        );

        if (response.ok) {
          await delay(1000);
          Swal.fire({
            title: "สำเร็จ",
            text: "แก้ไขไอเท็มสำเร็จ!",
            icon: "success",
            customClass: {
              popup: "eqm-swal-popup EQM-shadow-lg",
              title: "eqm-swal-title EQM-center-title",
              confirmButton: "eqm-swal-confirm EQM-btn-primary",
            },
            didClose: () => {
              const swalContainer = document.querySelector(".swal2-container");
              if (swalContainer) {
                swalContainer.style.display = "none";
                swalContainer.style.opacity = "0";
              }
            },
          });
          if (onRefresh) onRefresh();
        } else {
          const errorText = await response.text();
          Swal.fire({
            title: "เกิดข้อผิดพลาด",
            text: `ไม่สามารถแก้ไขไอเท็มได้: ${errorText}`,
            icon: "error",
            customClass: {
              popup: "eqm-swal-popup EQM-shadow-lg",
              title: "eqm-swal-title EQM-center-title",
              confirmButton: "eqm-swal-confirm EQM-btn-primary",
            },
            didClose: () => {
              const swalContainer = document.querySelector(".swal2-container");
              if (swalContainer) {
                swalContainer.style.display = "none";
                swalContainer.style.opacity = "0";
              }
            },
          });
        }
      } catch (error) {
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถแก้ไขไอเท็มได้ กรุณาลองอีกครั้ง",
          icon: "error",
          customClass: {
            popup: "eqm-swal-popup EQM-shadow-lg",
            title: "eqm-swal-title EQM-center-title",
            confirmButton: "eqm-swal-confirm EQM-btn-primary",
          },
          didClose: () => {
            const swalContainer = document.querySelector(".swal2-container");
            if (swalContainer) {
              swalContainer.style.display = "none";
              swalContainer.style.opacity = "0";
            }
          },
        });
      }
    }
  };

  return (
    <button className="EQM-btn-warning me-2 EQM-shadow-sm" onClick={handleEdit}>
      <i className="fas fa-edit"></i> แก้ไข
    </button>
  );
};

export default EditItemForm;