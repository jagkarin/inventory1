import React from "react";
import Swal from "sweetalert2";
import "./css/EQM.css";

const AddItemForm = ({ categories, onRefresh }) => {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleAdd = async () => {
    const { value: formValues, isConfirmed } = await Swal.fire({
      title: "เพิ่มไอเทมใหม่",
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
            <input id="eqmBorrow-input-name" class="eqmBorrow-input" placeholder="กรุณากรอกชื่อไอเท็ม">
          </div>
          <div class="eqmBorrow-input-group">
            <label class="eqmBorrow-label" for="eqmBorrow-input-description">คำอธิบาย</label>
            <input id="eqmBorrow-input-description" class="eqmBorrow-input" placeholder="กรุณากรอกรายละเอียด">
          </div>
          <div class="eqmBorrow-input-group">
            <label class="eqmBorrow-label" for="eqmBorrow-input-units">หน่วยนับ</label>
            <input id="eqmBorrow-input-units" class="eqmBorrow-input" placeholder="กรุณากรอกหน่วยนับ (เช่น ชิ้น, กล่อง)">
          </div>
          <div class="eqmBorrow-input-group">
            <label class="eqmBorrow-label" for="eqmBorrow-input-itemtype">ประเภท</label>
            <select id="eqmBorrow-input-itemtype" class="eqmBorrow-input">
              <option value="" disabled selected>เลือกประเภทไอเท็ม</option>
              <option value="1">สินค้า</option>
              <option value="2">อุปกรณ์</option>
            </select>
          </div>
          <div class="eqmBorrow-input-group">
            <label class="eqmBorrow-label" for="eqmBorrow-input-category">หมวดหมู่</label>
            <select id="eqmBorrow-input-category" class="eqmBorrow-input" disabled>
              <option value="" disabled selected>เลือกหมวดหมู่</option>
            </select>
          </div>
          <div class="eqmBorrow-input-group">
            <label class="eqmBorrow-label" for="eqmBorrow-input-image">รูปภาพ</label>
            <input id="eqmBorrow-input-image" class="eqmBorrow-input" type="file" accept="image/*">
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "เพิ่ม",
      cancelButtonText: "ยกเลิก",
      allowOutsideClick: false,
      allowEscapeKey: true,
      didOpen: () => {
        const itemTypeSelect = document.getElementById("eqmBorrow-input-itemtype");
        const categorySelect = document.getElementById("eqmBorrow-input-category");

        itemTypeSelect.addEventListener("change", () => {
          // ล้างตัวเลือกหมวดหมู่ก่อน
          categorySelect.innerHTML = '<option value="" disabled selected>เลือกหมวดหมู่</option>';

          // กรองหมวดหมู่ตามประเภทที่เลือก
          const selectedItemType = itemTypeSelect.value;
          const filteredCategories = categories.filter(
            (category) => category.itemType === parseInt(selectedItemType)
          );

          // เพิ่มตัวเลือกหมวดหมู่ใหม่
          filteredCategories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.id;
            option.text = category.name;
            categorySelect.appendChild(option);
          });

          // เปิดใช้งาน select ถ้ามีการเลือกประเภท
          categorySelect.disabled = !(selectedItemType === "1" || selectedItemType === "2");
        });
      },
      preConfirm: () => {
        const itemName = document.getElementById("eqmBorrow-input-name")?.value?.trim() || "";
        const description = document.getElementById("eqmBorrow-input-description")?.value?.trim() || "";
        const units = document.getElementById("eqmBorrow-input-units")?.value?.trim() || "";
        const itemType = document.getElementById("eqmBorrow-input-itemtype")?.value || "";
        const categoryID = document.getElementById("eqmBorrow-input-category")?.value || "";
        const image = document.getElementById("eqmBorrow-input-image")?.files[0];

        if (!itemName || !itemType || !categoryID || !units) {
          Swal.showValidationMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
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
          Swal.showValidationMessage("หน่วยนับต้องมีอย่างน้อย 1 ตัวอักษร");
          return false;
        }
        if (units.length > 20) {
          Swal.showValidationMessage("หน่วยนับยาวเกินไป (สูงสุด 20 ตัวอักษร)");
          return false;
        }
        const invalidUnitsChars = /[!@#$%^&*()_+\-=[]{};':"\\|,.<>?]/;
        if (invalidUnitsChars.test(units)) {
          Swal.showValidationMessage("หน่วยนับไม่สามารถมีอักขระพิเศษได้");
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
          itemType,
          categoryID,
          image,
        };
      },
    });

    if (isConfirmed && formValues) {
      const formData = new FormData();
      formData.append("itemName", formData.append("itemName", formValues.itemName));
      formData.append("description", formValues.description);
      formData.append("units", formValues.units);
      formData.append("status", "1");
      formData.append("itemType", formValues.itemType);
      formData.append("categoryID", formValues.categoryID);
      formData.append("createdAt", new Date().toISOString());
      if (formValues.image) {
        formData.append("image", formValues.image);
      }

      try {
        const response = await fetch(
          "https://localhost:7294/api/ItemMaster/additemmaster",
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          await delay(1000);
          Swal.fire({
            title: "สำเร็จ",
            text: "เพิ่มไอเท็มสำเร็จ!",
            icon: "success",
            customClass: {
              popup: "eqmBorrow-popup",
              title: "eqmBorrow-title",
              confirmButton: "eqmBorrow-confirm",
            },
          });
          if (onRefresh) onRefresh();
        } else {
          const errorText = await response.text();
          Swal.fire({
            title: "Error",
            text: `Failed to add item. ${errorText}`,
            icon: "error",
            customClass: {
              popup: "eqmBorrow-popup",
              title: "eqmBorrow-title",
              confirmButton: "eqmBorrow-confirm",
            },
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to add item. Please try again.",
          icon: "error",
          customClass: {
            popup: "eqmBorrow-popup",
            title: "eqmBorrow-title",
            confirmButton: "eqmBorrow-confirm",
          },
        });
      }
    }
  };

  return (
    <div className="text-end mb-3">
      <button className="EQM-btn-primary" onClick={handleAdd}>
        เพิ่มไอเทมใหม่
      </button>
    </div>
  );
};

export default AddItemForm;