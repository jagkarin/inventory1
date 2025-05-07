import React, { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import "./css/request.css";

const getImagePath = (filename) => {
    if (!filename || typeof filename !== "string" || filename.trim() === "") {
        return "";
    }
    const baseUrl = "https://localhost:7294";
    return `${baseUrl}${filename}`;
};

const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime()) || date.getFullYear() < 1900) {
            console.warn('Invalid or unreasonable date:', dateStr);
            return '';
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch (error) {
        console.error('Error parsing date:', error, dateStr);
        return '';
    }
};

const formatDateForBackend = (dateStr) => {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime()) || date.getFullYear() < 1900) {
            console.warn('Invalid or unreasonable date:', dateStr);
            return '';
        }
        const utcDate = new Date(date.getTime() - (7 * 60 * 60 * 1000));
        const year = utcDate.getFullYear();
        const month = String(utcDate.getMonth() + 1).padStart(2, '0');
        const day = String(utcDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch (error) {
        console.error('Error parsing date:', error, dateStr);
        return '';
    }
};

const RequestPage = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [userID, setUserID] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemTypeFilter, setItemTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [itemsPerPage] = useState(5);
    const [categories, setCategories] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [pendingRequests, setPendingRequests] = useState({});

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const userIdFromToken = decodedToken.userId || decodedToken.UserId || decodedToken.id;
                if (!userIdFromToken) {
                    throw new Error("ไม่พบ UserID ใน token");
                }
                setUserID(parseInt(userIdFromToken));
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการถอดรหัส token:", error);
                Swal.fire("ข้อผิดพลาด", "ไม่สามารถดึงข้อมูล UserID จาก token ได้ กรุณาลงชื่อเข้าใช้ใหม่", "error");
            }
        } else {
            console.error("ไม่พบ token ใน localStorage");
            Swal.fire("ข้อผิดพลาด", "กรุณาลงชื่อเข้าใช้ก่อนดำเนินการขอเบิก", "error");
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const stockResponse = await fetch("https://localhost:7294/api/Stock/StockImage", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                if (!stockResponse.ok) {
                    throw new Error(`Stock API error! Status: ${stockResponse.status}`);
                }
                const stockData = await stockResponse.json();
                const fetchedItems = Array.isArray(stockData) ? stockData : (stockData?.data || []);
                setItems(fetchedItems);
                setFilteredItems(fetchedItems);

                try {
                    const pendingResponse = await fetch("https://localhost:7294/api/EquipmentBorrow/pending", {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    });
                    if (pendingResponse.ok) {
                        const pendingData = await pendingResponse.json();
                        const pendingMap = {};
                        pendingData.forEach(req => {
                            pendingMap[req.stockID] = (pendingMap[req.stockID] || 0) + req.quantity;
                        });
                        setPendingRequests(pendingMap);
                    } else if (pendingResponse.status === 404) {
                        console.warn("PendingRequests endpoint not found. Proceeding without pending data.");
                        setPendingRequests({});
                    } else {
                        throw new Error(`PendingRequests API error! Status: ${pendingResponse.status}`);
                    }
                } catch (pendingError) {
                    console.error("Error fetching pending requests:", pendingError);
                    setPendingRequests({});
                }

                const warehouseResponse = await fetch("https://localhost:7294/api/Warehouse/GetAllWarehouse", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                if (!warehouseResponse.ok) {
                    throw new Error(`Warehouse API error! Status: ${warehouseResponse.status}`);
                }
                const warehouseData = await warehouseResponse.json();
                const fetchedWarehouses = Array.isArray(warehouseData) ? warehouseData : (warehouseData?.data || []);
                setWarehouses(fetchedWarehouses);

                const categories = [
                    { categoryID: 1, categoryName: "Smart Easy OPD" },
                    { categoryID: 2, categoryName: "BP Box" },
                    { categoryID: 3, categoryName: "BP Kiosk" },
                    { categoryID: 4, categoryName: "วัสดุสำนักงาน" },
                    { categoryID: 5, categoryName: "ครุภัณฑ์สำนักงาน" },
                    
                ];
                setCategories(categories);
            } catch (err) {
                console.error("เกิดข้อผิดพลาดในการเรียกข้อมูล:", err);
                Swal.fire("ข้อผิดพลาด", `ไม่สามารถเรียกข้อมูลได้: ${err.message}`, "error");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const filtered = items.filter((item) => {
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
        });
        setFilteredItems(filtered);
        setCurrentPage(1);
    }, [searchTerm, items, itemTypeFilter, statusFilter]);

    const handleRequestBorrow = async (item) => {
        if (item.status !== 0 || item.quantity <= 0) {
            Swal.fire("ข้อผิดพลาด", "รายการสินค้า/อุปกรณ์ไม่พร้อมใช้งานหรือคงคลังหมด", "error");
            return;
        }

        if (!userID) {
            Swal.fire("ข้อผิดพลาด", "ไม่พบข้อมูลผู้ใช้ กรุณาลงชื่อเข้าใช้ใหม่", "error");
            return;
        }

        const pendingQty = pendingRequests[item.stockID] || 0;
        const availableQty = item.quantity - pendingQty;

        if (availableQty <= 0) {
            Swal.fire("ข้อผิดพลาด", "มีคำขอเบิกค้างอยู่ กรุณารอการอนุมัติ", "error");
            return;
        }

        const today = formatDateForInput(new Date());
        const isProduct = item.itemType === 1;
        const title = isProduct ? `ขอเบิกสินค้า: ${item.itemName}` : `ขอยืมอุปกรณ์: ${item.itemName}`;
        const html = isProduct
            ? `
                <div class="requestBorrow-custom-container">
                    <div class="requestBorrow-custom-input">
                        <label>วันที่ขอเบิก:</label>
                        <input id="requestBorrow-borrow-date" class="requestBorrow-input" type="date" value="${today}" min="${today}">
                    </div>
                    <div class="requestBorrow-custom-input">
                        <label>เหตุผลในการขอเบิก:</label>
                        <textarea id="requestBorrow-reason" class="requestBorrow-textarea" placeholder="ระบุเหตุผลในการขอเบิก"></textarea>
                    </div>
                    <div class="requestBorrow-custom-input">
                        <label>จำนวน:</label>
                        <input id="requestBorrow-quantity" class="requestBorrow-input" type="number" min="1" max="${availableQty}" value="1">
                    </div>
                </div>
            `
            : `
                <div class="requestBorrow-custom-container">
                    <div class="requestBorrow-custom-input">
                        <label>วันที่ขอเบิก:</label>
                        <input id="requestBorrow-borrow-date" class="requestBorrow-input" type="date" value="${today}" min="${today}">
                    </div>
                    <div class="requestBorrow-custom-input">
                        <label>วันที่คาดว่าจะคืน:</label>
                        <input id="requestBorrow-return-date" class="requestBorrow-input" type="date" min="${today}">
                    </div>
                    <div class="requestBorrow-custom-input">
                        <label>เหตุผลในการขอเบิก:</label>
                        <textarea id="requestBorrow-reason" class="requestBorrow-textarea" placeholder="ระบุเหตุผลในการขอเบิก"></textarea>
                    </div>
                    <div class="requestBorrow-custom-input">
                        <label>จำนวน:</label>
                        <input id="requestBorrow-quantity" class="requestBorrow-input" type="number" min="1" max="${availableQty}" value="1">
                    </div>
                </div>
            `;

        const { value: formValues, isConfirmed } = await Swal.fire({
            title,
            html,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "ยืนยันการขอเบิก",
            cancelButtonText: "ยกเลิก",
            customClass: { 
                popup: "requestBorrow-popup",
                title: "requestBorrow-title",
                htmlContainer: "requestBorrow-content",
                confirmButton: "requestBorrow-confirm-btn",
                cancelButton: "requestBorrow-cancel-btn",
            },
            preConfirm: () => {
                const borrowDate = document.getElementById("requestBorrow-borrow-date").value;
                const returnDate = isProduct ? "0001-01-01" : (document.getElementById("requestBorrow-return-date")?.value || "");
                const reason = document.getElementById("requestBorrow-reason").value.trim();
                const quantity = parseInt(document.getElementById("requestBorrow-quantity").value);

                if (!borrowDate || !reason || quantity <= 0) {
                    Swal.showValidationMessage("กรุณากรอกข้อมูลให้ครบถ้วนและระบุจำนวนมากกว่า 0");
                    return false;
                }

                const borrowDateObj = new Date(borrowDate);
                const currentDateObj = new Date(today);
                if (borrowDateObj < currentDateObj) {
                    Swal.showValidationMessage("วันที่ขอเบิกต้องไม่เป็นอดีต");
                    return false;
                }

                if (!isProduct) {
                    if (!returnDate) {
                        Swal.showValidationMessage("กรุณาระบุวันที่คาดว่าจะคืนสำหรับอุปกรณ์");
                        return false;
                    }
                    const returnDateObj = new Date(returnDate);
                    if (returnDateObj <= borrowDateObj) {
                        Swal.showValidationMessage("วันที่คาดว่าจะคืนต้องมากกว่าวันที่ขอเบิก");
                        return false;
                    }
                    const diffTime = returnDateObj - borrowDateObj;
                    const diffDays = diffTime / (1000 * 60 * 60 * 24);
                    if (diffDays > 30) {
                        Swal.showValidationMessage("ระยะเวลาการยืมอุปกรณ์ต้องไม่เกิน 30 วัน");
                        return false;
                    }
                }

                if (reason.length < 10) {
                    Swal.showValidationMessage("เหตุผลในการขอเบิกต้องมีอย่างน้อย 10 ตัวอักษร");
                    return false;
                }
                if (reason.length > 500) {
                    Swal.showValidationMessage("เหตุผลในการขอเบิกยาวเกินไป (สูงสุด 500 ตัวอักษร)");
                    return false;
                }

                if (quantity > availableQty) {
                    Swal.showValidationMessage(`จำนวนที่ขอเบิก (${quantity}) เกินจำนวนที่สามารถขอได้ (${availableQty})`);
                    return false;
                }

                return { borrowDate, returnDate, reason, quantity };
            },
        });

        if (!isConfirmed) return;

        const { borrowDate, returnDate, reason, quantity } = formValues;

        try {
            const requestData = {
                ItemID: item.itemID,
                UserID: userID,
                Quantity: quantity,
                BorrowDate: formatDateForBackend(borrowDate),
                ReturnDate: returnDate === "0001-01-01" ? returnDate : formatDateForBackend(returnDate),
                reason: reason,
                Status: 0,
                BorrowStatus: 0,
                Itemtype: item.itemType,
                StockID: item.stockID,
            };

            const response = await fetch("https://localhost:7294/api/EquipmentBorrow/RequestBorrow", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                const responseText = await response.text();
                throw new Error(`เกิดข้อผิดพลาดในการขอเบิก: ${responseText}`);
            }

            setPendingRequests(prev => ({
                ...prev,
                [item.stockID]: (prev[item.stockID] || 0) + quantity
            }));

            Swal.fire("สำเร็จ", "บันทึกคำขอเบิกเรียบร้อยแล้ว รอการอนุมัติ", "success");

            setFilteredItems(prev => prev.map(i => 
                i.stockID === item.stockID 
                ? { ...i, displayQuantity: (i.quantity - (pendingRequests[i.stockID] || 0) - quantity) }
                : i
            ));
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการส่งคำขอ:", error);
            Swal.fire("ข้อผิดพลาด", `ไม่สามารถบันทึกคำขอเบิกได้: ${error.message}`, "error");
        }
    };

    const getItemTypeLabel = (itemType) => {
        return itemType === 1 ? "สินค้า" : itemType === 2 ? "อุปกรณ์" : "ไม่ระบุประเภท";
    };

    const getCategoryName = (categoryID) => {
        const category = categories.find(cat => cat.categoryID === categoryID);
        return category ? category.categoryName : categoryID;
    };

    const getWarehouseName = (warehouseID) => {
        const warehouse = warehouses.find(wh => wh.warehouseID === warehouseID);
        return warehouse ? warehouse.warehouseName : warehouseID || "-";
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className="request-container">
            <div className="request-content">
                {loading ? (
                    <div className="request-loading">กำลังเรียกข้อมูล...</div>
                ) : (
                    <div className="request-product-section">
                        <h2 className="request-title">รายการสินค้าและอุปกรณ์</h2>
                        <div className="d-flex mb-3">
                            <input
                                type="text"
                                className="request-form-control"
                                placeholder="ค้นหาชื่อรายการสินค้า..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <select
                                className="request-form-control me-2"
                                value={itemTypeFilter}
                                onChange={(e) => setItemTypeFilter(e.target.value)}
                                style={{ width: "150px" }}
                            >
                                <option value="all">ทั้งหมด</option>
                                <option value="1">สินค้า</option>
                                <option value="2">อุปกรณ์</option>
                            </select>
                            <select
                                className="request-form-control"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                style={{ width: "150px" }}
                            >
                                <option value="all">สถานะทั้งหมด</option>
                                <option value="1">พร้อมเบิก</option>
                                <option value="0">ไม่พร้อมเบิก</option>
                            </select>
                        </div>
                        <div className="request-table-wrapper">
                            <table className="request-product-table">
                                <thead>
                                    <tr>
                                        <th>รหัสสินค้า</th>
                                        <th>รูปภาพ</th>
                                        <th>หมายเลขประจำสินค้า</th>
                                        <th>สถานะ</th>
                                        <th>ชื่อรายการ</th>
                                        <th>ประเภทรายการ</th>
                                        <th>หมวดหมู่</th>
                                        <th>คลังสินค้า</th>
                                        <th>จำนวนคงคลัง</th>
                                        <th>หน่วย</th>
                                        <th>การขอเบิก</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((item) => {
                                        const pendingQty = pendingRequests[item.stockID] || 0;
                                        const availableQty = item.quantity - pendingQty;
                                        return (
                                            <tr key={item.stockID}>
                                                <td>{item.itemID}</td>
                                                <td>
                                                    {item.image ? (
                                                        <div className="request-image-container">
                                                            <img
                                                                className="request-product-image"
                                                                src={getImagePath(item.image)}
                                                                alt={item.itemName || "ภาพรายการสินค้า"}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <span>ไม่มีรูปภาพ</span>
                                                    )}
                                                </td>
                                                <td>{item.serialNumber || '-'}</td>
                                                <td className={item.status !== 0 ? "request-badge request-bg-danger" : "request-available"}>
                                                    {item.status === 0 ? "พร้อมใช้งาน" : "ไม่พร้อมใช้งาน"}
                                                </td>
                                                <td>{item.itemName || '-'}</td>
                                                <td>{getItemTypeLabel(item.itemType)}</td>
                                                <td>{getCategoryName(item.categoryID)}</td>
                                                <td>{getWarehouseName(item.warehouseName)}</td>
                                                <td>{item.quantity || 0}</td>
                                                <td>{item.units}</td>
                                                <td>
                                                    <button
                                                        className="request-add-to-cart-btn"
                                                        onClick={() => handleRequestBorrow(item)}
                                                        disabled={item.status !== 0 || availableQty <= 0}
                                                    >
                                                        ขอเบิก
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="request-pagination">
                            <button
                                className="request-pagination-btn"
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                            >
                                ย้อนกลับ
                            </button>
                            <span>หน้า {currentPage} / {totalPages}</span>
                            <button
                                className="request-pagination-btn"
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                            >
                                ถัดไป
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestPage;