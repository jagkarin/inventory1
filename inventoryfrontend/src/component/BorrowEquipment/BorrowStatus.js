import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import './css/BorrowStatus.css';

const getImagePath = (filename) => {
    if (!filename || typeof filename !== "string" || filename.trim() === "") {
        return "";
    }
    const baseUrl = "https://localhost:7294";
    return `${baseUrl}${filename}`;
};

const BorrowStatus = ({ onShowDetails, isUserView = false }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [userID, setUserID] = useState(null);
  const [borrowData, setBorrowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedBorrowDetails, setSelectedBorrowDetails] = useState(null);
  const [selectedBorrowStatus, setSelectedBorrowStatus] = useState("ยืม");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("borrowDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedMonthYear, setSelectedMonthYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedBorrowId, setSelectedBorrowId] = useState(null);
  const itemsPerPage = 15;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId || decodedToken.UserId || decodedToken.id;
        if (!userId) throw new Error("ไม่พบรหัสผู้ใช้ใน token");
        setUserID(parseInt(userId));
        console.log("รหัสผู้ใช้ที่ถอดรหัส:", userId);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการถอดรหัส token:", error);
        setError("ไม่สามารถถอดรหัสข้อมูลการยืนยันตัวตนได้");
        setLoading(false);
      }
    } else {
      console.warn("ไม่พบ token ใน localStorage");
      setError("กรุณาลงชื่อเข้าใช้เพื่อดูข้อมูล");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchBorrowData = async () => {
      if (!userID) return;

      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`https://localhost:7294/api/EquipmentBorrow/user/${userID}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          const equipmentData = Array.isArray(data)
            ? data.filter(item => item.itemtype === 2)
            : (data.data && Array.isArray(data.data))
              ? data.data.filter(item => item.itemtype === 2)
              : [];

          const validatedData = equipmentData.filter((item) => {
            if (!item.borrowDate || !item.returnDate) {
              console.warn(`ข้อมูลไม่สมบูรณ์: borrowID ${item.borrowID} ขาดวันที่ยืมหรือวันที่กำหนดคืน`);
              return false;
            }
            const borrowDate = new Date(item.borrowDate);
            const returnDate = new Date(item.returnDate);
            if (isNaN(borrowDate.getTime()) || isNaN(returnDate.getTime())) {
              console.warn(`วันที่ไม่ถูกต้อง: borrowID ${item.borrowID}`);
              return false;
            }
            if (borrowDate > returnDate) {
              console.warn(`วันที่ยืมมากกว่าวันที่กำหนดคืน: borrowID ${item.borrowID}`);
              return false;
            }
            return true;
          });

          // Debug: ตรวจสอบข้อมูล returnimage
          console.log("ข้อมูลจาก API:", validatedData);
          setBorrowData(validatedData);

          const filtered = validatedData.filter((borrow) => {
            const borrowDate = new Date(borrow.borrowDate);
            if (!selectedMonthYear) return borrow.status === 1;
            const borrowMonthYear = borrowDate.toISOString().slice(0, 7);
            return borrowMonthYear === selectedMonthYear && borrow.status === 1;
          });

          setFilteredData(filtered);
          checkOverdueItems(filtered);
        } else {
          const errorText = await response.text();
          setError(`ไม่สามารถเรียกข้อมูลได้: ${response.status} - ${errorText}`);
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
        setError("เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบ API");
      } finally {
        setLoading(false);
      }
    };

    if (userID) fetchBorrowData();
  }, [userID, selectedMonthYear]);

  const checkOverdueItems = (data) => {
    const overdueItems = data.filter((borrow) =>
      borrow.borrowStatus === 1 && isOverdueReturn(borrow.returnDate, borrow.borrowStatus, borrow.actualReturnDate)
    );
    if (overdueItems.length > 0) {
      setAlertMessage(`มีรายการยืมที่เกินกำหนดคืน ${overdueItems.length} รายการ`);
      setShowAlertModal(true);
    }
  };

  const handleMonthYearChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue) {
      const selectedDate = new Date(selectedValue);
      const currentDate = new Date();
      if (selectedDate > currentDate) {
        setAlertMessage("ไม่สามารถเลือกเดือนในอนาคตได้");
        setShowAlertModal(true);
        return;
      }
    }
    setSelectedMonthYear(selectedValue);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    if (term.length > 50) {
      setAlertMessage("คำค้นหายาวเกินไป กรุณาใช้คำค้นหาที่สั้นกว่านี้");
      setShowAlertModal(true);
      return;
    }
    setSearchTerm(term);
    setCurrentPage(1);

    const filtered = borrowData.filter((borrow) => {
      const borrowId = borrow.borrowID?.toString().toLowerCase() || "";
      const fullName = `${borrow.firstname || ''} ${borrow.lastname || ''}`.toLowerCase();
      const matchesSearch = borrowId.includes(term) || fullName.includes(term);
      if (!borrow.borrowDate) return false;
      const borrowDate = new Date(borrow.borrowDate);
      if (isNaN(borrowDate.getTime())) return false;
      if (!selectedMonthYear) return matchesSearch && borrow.status === 1;
      const borrowMonthYear = borrowDate.toISOString().slice(0, 7);
      return matchesSearch && borrowMonthYear === selectedMonthYear && borrow.status === 1;
    });

    setFilteredData(filtered);
  };

  const handleSort = (key) => {
    const newOrder = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortOrder(newOrder);
    setCurrentPage(1);

    const sorted = [...filteredData].sort((a, b) => {
      let valueA, valueB;
      if (key === "borrowDate" || key === "returnDate" || key === "actualReturnDate") {
        valueA = new Date(a[key] || 0);
        valueB = new Date(b[key] || 0);
      } else {
        valueA = a[key]?.toString().toLowerCase() || "";
        valueB = b[key]?.toString().toLowerCase() || "";
      }

      return newOrder === "asc" ? (valueA > valueB ? 1 : -1) : (valueA < valueB ? 1 : -1);
    });

    setFilteredData(sorted);
  };

  const handleShowDetails = (borrow) => {
    console.log("รายละเอียดที่เลือก:", borrow); // Debug: ตรวจสอบ returnimage
    setSelectedBorrowDetails(borrow);
    setShowDetailModal(true);
    if (onShowDetails) onShowDetails(borrow);
  };

  const handleReturnEquipment = (borrowID) => {
    if (!borrowID) {
      setAlertMessage("ไม่พบรหัสการยืม กรุณาตรวจสอบข้อมูล");
      setShowAlertModal(true);
      return;
    }

    const selectedBorrow = borrowData.find(borrow => borrow.borrowID === borrowID);
    if (!selectedBorrow) {
      setAlertMessage("ไม่พบข้อมูลการยืมนี้ในระบบ");
      setShowAlertModal(true);
      return;
    }

    if (selectedBorrow.borrowStatus !== 1) {
      setAlertMessage("รายการนี้ถูกคืนไปแล้ว ไม่สามารถดำเนินการคืนซ้ำได้");
      setShowAlertModal(true);
      return;
    }

    const borrowDate = new Date(selectedBorrow.borrowDate);
    const returnDate = new Date(selectedBorrow.returnDate);
    const currentDate = new Date();
    if (borrowDate > currentDate) {
      setAlertMessage("วันที่ยืมอยู่ในอนาคต ไม่สามารถคืนอุปกรณ์ได้");
      setShowAlertModal(true);
      return;
    }
    if (returnDate < borrowDate) {
      setAlertMessage("วันที่กำหนดคืนไม่ถูกต้อง (ก่อนวันที่ยืม)");
      setShowAlertModal(true);
      return;
    }

    setSelectedBorrowId(borrowID);
    setShowUploadModal(true);
  };

  const handleConfirmReturn = async () => {
    if (!selectedImage) {
      setAlertMessage("กรุณาเลือกไฟล์รูปภาพเพื่อยืนยันการคืน");
      setShowAlertModal(true);
      return;
    }

    const selectedBorrow = borrowData.find(borrow => borrow.borrowID === selectedBorrowId);
    const isOverdue = new Date() > new Date(selectedBorrow.returnDate);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("BorrowId", selectedBorrowId);
      formData.append("BorrowStatus", 2);
      formData.append("ReturnImage", selectedImage);

      const response = await fetch(`https://localhost:7294/api/EquipmentBorrow/return/${selectedBorrowId}`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        const returnImagePath = responseData.returnimage || `/return/${selectedBorrowId}.jpg`; // ใช้ returnimage จาก API
        console.log("returnimage จาก API:", returnImagePath); // Debug
        const currentDate = new Date();
        setBorrowData((prevData) =>
          prevData.map((borrow) =>
            borrow.borrowID === selectedBorrowId
              ? { ...borrow, borrowStatus: 2, actualReturnDate: currentDate.toISOString(), returnimage: returnImagePath }
              : borrow
          )
        );
        setFilteredData((prevData) =>
          prevData.map((borrow) =>
            borrow.borrowID === selectedBorrowId
              ? { ...borrow, borrowStatus: 2, actualReturnDate: currentDate.toISOString(), returnimage: returnImagePath }
              : borrow
          )
        );
        setShowDetailModal(false);
        setShowUploadModal(false);
        setSelectedImage(null);
        setSelectedBorrowId(null);

        if (isOverdue) {
          setAlertMessage("คืนอุปกรณ์เรียบร้อยแล้ว แต่เกินกำหนดคืน!");
        } else {
          setAlertMessage("คืนอุปกรณ์เรียบร้อยแล้ว");
        }
        setShowAlertModal(true);
      } else {
        const errorData = await response.json();
        setAlertMessage(`ไม่สามารถดำเนินการคืนอุปกรณ์ได้: ${errorData.error || response.statusText}`);
        setShowAlertModal(true);
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการคืนอุปกรณ์:', error);
      setAlertMessage("เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบ API");
      setShowAlertModal(true);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log('Selected File:', file);
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setSelectedImage(file);
      console.log('Image URL:', URL.createObjectURL(file));
    } else {
      setAlertMessage("กรุณาเลือกไฟล์รูปภาพที่มีนามสกุล .jpg หรือ .png");
      setShowAlertModal(true);
      setSelectedImage(null);
    }
  };

  const isBorrowStatusEditable = (borrowStatus) => borrowStatus === 1;

  const isOverdueReturn = (returnDate, borrowStatus, actualReturnDate) => {
    if (borrowStatus === 1) {
      const expectedDate = new Date(returnDate);
      const currentDate = new Date();
      return expectedDate < currentDate;
    } else if (borrowStatus === 2 && actualReturnDate) {
      const expectedDate = new Date(returnDate);
      const actualDate = new Date(actualReturnDate);
      return actualDate > expectedDate;
    }
    return false;
  };

  const formatThaiDate = (date) => {
    if (!date || date === "0001-01-01") return 'ยังไม่ระบุ';
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime())
      ? 'วันที่ไม่ถูกต้อง'
      : parsedDate.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
  };

  const borrowedData = filteredData.filter((borrow) => borrow.borrowStatus === 1);
  const returnedData = filteredData.filter((borrow) => borrow.borrowStatus === 2);
  const overdueCount = borrowedData.filter((borrow) =>
    isOverdueReturn(borrow.returnDate, borrow.borrowStatus, borrow.actualReturnDate)
  ).length;

  const getPaginatedData = (data) => {
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      paginatedData: data.slice(startIndex, endIndex),
      totalPages,
    };
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderTable = (data, title, statusClass) => {
    const { paginatedData, totalPages } = getPaginatedData(data);
    const updatedTitle = title === "ยืม" ? "รายการที่อยู่ระหว่างการยืม" : "รายการที่คืนแล้ว";
    const statusColumnHeader = title === "ยืม" ? "สถานะการยืม" : "สถานะการคืน";

    return (
      <div className="bs-table-container">
        <h2 className="bs-table-title">{updatedTitle}</h2>
        <div className="bs-controls">
          <div className="bs-search">
            <input
              type="text"
              placeholder="ค้นหาด้วยรหัสการยืมหรือชื่อผู้ยืม..."
              value={searchTerm}
              onChange={handleSearch}
              className="bs-search-input"
            />
          </div>
          <div className="bs-month-filter">
            <input
              type="month"
              value={selectedMonthYear}
              onChange={handleMonthYearChange}
              className="bs-month-input"
              placeholder="เลือกเดือน"
            />
          </div>
          <div className="bs-status-buttons">
            <button
              className={`bs-status-wait ${selectedBorrowStatus === "ยืม" ? "active" : ""}`}
              onClick={() => {
                setSelectedBorrowStatus("ยืม");
                setCurrentPage(1);
                setSearchTerm("");
                const filtered = borrowData.filter((borrow) => {
                  if (!borrow.borrowDate) return false;
                  const borrowDate = new Date(borrow.borrowDate);
                  if (isNaN(borrowDate.getTime())) return false;
                  if (!selectedMonthYear) return borrow.status === 1;
                  const borrowMonthYear = borrowDate.toISOString().slice(0, 7);
                  return borrowMonthYear === selectedMonthYear && borrow.status === 1;
                });
                setFilteredData(filtered);
                checkOverdueItems(filtered);
              }}
            >
              อยู่ระหว่างการยืม ({borrowedData.length})
              {overdueCount > 0 && (
                <span className="bs-overdue-text"> ({overdueCount} เกินกำหนด)</span>
              )}
            </button>
            <button
              className={`bs-status-accpet ${selectedBorrowStatus === "คืน" ? "active" : ""}`}
              onClick={() => {
                setSelectedBorrowStatus("คืน");
                setCurrentPage(1);
                setSearchTerm("");
                const filtered = borrowData.filter((borrow) => {
                  if (!borrow.borrowDate) return false;
                  const borrowDate = new Date(borrow.borrowDate);
                  if (isNaN(borrowDate.getTime())) return false;
                  if (!selectedMonthYear) return borrow.status === 1;
                  const borrowMonthYear = borrowDate.toISOString().slice(0, 7);
                  return borrowMonthYear === selectedMonthYear && borrow.status === 1;
                });
                setFilteredData(filtered);
              }}
            >
              คืนแล้ว ({returnedData.length})
            </button>
          </div>
          <div className="bs-sort">
            <label>เรียงลำดับตาม: </label>
            <select
              value={sortKey}
              onChange={(e) => handleSort(e.target.value)}
              className="bs-sort-select"
            >
              <option value="borrowID">รหัสการยืม</option>
              <option value="borrowDate">วันที่ขอ</option>
              <option value="returnDate">วันที่กำหนดคืน</option>
            </select>
            <button onClick={() => handleSort(sortKey)} className="bs-sort-btn">
              {sortOrder === "asc" ? "↑ เก่าที่สุด" : "↓ ใหม่ที่สุด"}
            </button>
          </div>
        </div>
        <div className="bs-table-responsive">
          {loading ? (
            <div className="bs-loading">กำลังเรียกข้อมูล...</div>
          ) : error ? (
            <div className="bs-error">{error}</div>
          ) : (
            <table className={`bs-table ${statusClass}`}>
              <thead>
                <tr>
                  <th>รหัสการยืม</th>
                  <th>ผู้ยืม</th>
                  <th>วันที่ขอ</th>
                  <th>วันที่กำหนดคืน</th>
                  <th>{statusColumnHeader}</th>
                  <th>รายละเอียด</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((borrow) => (
                    <tr key={borrow.borrowID} className="bs-table-row">
                      <td>{borrow.borrowID || "ไม่ระบุ"}</td>
                      <td>{borrow.firstname || "ไม่ระบุ"} {borrow.lastname || ""}</td>
                      <td>{formatThaiDate(borrow.borrowDate)}</td>
                      <td>{formatThaiDate(borrow.returnDate)}</td>
                      <td>
                        {borrow.borrowStatus === 1 ? (
                          <>
                            <i className="bi bs-status-check bi-arrow-right-circle-fill active-borrowed"></i>
                            {isOverdueReturn(borrow.returnDate, borrow.borrowStatus, borrow.actualReturnDate) && (
                              <span className="bs-overdue-text"> (เกินกำหนด)</span>
                            )}
                          </>
                        ) : (
                          <>
                            <i className="bi bs-status-check bi-check-circle-fill active-returned"></i>
                            {isOverdueReturn(borrow.returnDate, borrow.borrowStatus, borrow.actualReturnDate) && (
                              <span className="bs-overdue-text"> (คืนเกินกำหนด)</span>
                            )}
                          </>
                        )}
                      </td>
                      <td>
                        <button className="bs-btn-info" onClick={() => handleShowDetails(borrow)}>
                          ดูรายละเอียด
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">
                      <div className="bs-empty-state">
                        <i className="bi bi-inbox"></i>
                        <p>{searchTerm ? "ไม่พบข้อมูลที่ค้นหา" : "ไม่มีข้อมูลในสถานะนี้"}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {!loading && !error && totalPages > 1 && (
          <div className="bs-pagination">
            <button
              className="bs-pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              หน้าก่อนหน้า
            </button>
            <span className="bs-pagination-info">
              หน้า {currentPage} จาก {totalPages}
            </span>
            <button
              className="bs-pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              หน้าถัดไป
            </button>
          </div>
        )}
      </div>
    );
  };

  const getSelectedTable = () => {
    switch (selectedBorrowStatus) {
      case "ยืม":
        return renderTable(borrowedData, "ยืม", "bs-table-borrowed");
      case "คืน":
        return renderTable(returnedData, "คืน", "bs-table-returned");
      default:
        return null;
    }
  };

  return (
    <div className="bs-container">
      {showDetailModal && selectedBorrowDetails && (
        <div className="bs-popup-overlay">
          <div className="bs-popup-dialog" role="document">
            <div className="bs-popup-content">
              <div className="bs-popup-header">
                <h5 className="bs-popup-title">
                  รายละเอียดการยืม (รหัสการยืม: {selectedBorrowDetails.borrowID || ""})
                </h5>
                <button type="button" className="bs-btn-close" onClick={() => setShowDetailModal(false)}>
                  <span>×</span>
                </button>
              </div>
              <div className="bs-popup-info">
                <div className="bs-info-item">
                  <span className="bs-info-icon">
                    <i className="bi bi-person-fill"></i>
                  </span>
                  <strong>ผู้ยืม:</strong> {selectedBorrowDetails.firstname || "ไม่ระบุ"}{" "}
                  {selectedBorrowDetails.lastname || ""}
                </div>
                <div className="bs-info-item">
                  <span className="bs-info-icon">
                    <i className="bi bi-calendar3"></i>
                  </span>
                  <strong>วันที่ยืม:</strong> {formatThaiDate(selectedBorrowDetails.borrowDate)}
                </div>
                <div className="bs-info-item">
                  <span className="bs-info-icon">
                    <i className="bi bi-calendar-check"></i>
                  </span>
                  <strong>วันที่กำหนดคืน:</strong> {formatThaiDate(selectedBorrowDetails.returnDate)}
                </div>
                {selectedBorrowDetails.borrowStatus === 2 && (
                  <div className="bs-info-item bs-return-image">
                    <span className="bs-info-icon">
                      <i className="bi bi-image-fill"></i>
                    </span>
                    <strong>รูปยืนยันการคืน:</strong>
                    {selectedBorrowDetails.returnimage ? (
                      <div className="bs-image-preview-container">
                        <img
                          src={getImagePath(selectedBorrowDetails.returnimage)}
                          alt="รูปยืนยันการคืน"
                          className="bs-image-preview"
                          onError={() => {
                            setAlertMessage("ไม่สามารถโหลดรูปภาพยืนยันการคืนได้");
                            setShowAlertModal(true);
                          }}
                        />
                      </div>
                    ) : (
                      <span className="bs-no-image">ไม่มีรูปภาพยืนยัน</span>
                    )}
                  </div>
                )}
                {isOverdueReturn(selectedBorrowDetails.returnDate, selectedBorrowDetails.borrowStatus, selectedBorrowDetails.actualReturnDate) && (
                  <div className="bs-info-item bs-overdue-warning">
                    <span className="bs-info-icon">
                      <i className="bi bi-exclamation-triangle-fill"></i>
                    </span>
                    <strong>แจ้งเตือน:</strong> {selectedBorrowDetails.borrowStatus === 1 ? "รายการนี้เกินกำหนดคืนแล้ว!" : "คืนอุปกรณ์เกินกำหนด!"}
                  </div>
                )}
                <div className="bs-info-item bs-borrow-description">
                  <span className="bs-info-icon">
                    <i className="bi bi-chat-left-text-fill"></i>
                  </span>
                  <strong>วัตถุประสงค์การยืม:</strong> {selectedBorrowDetails.reason || "ไม่ได้ระบุ"}
                </div>
              </div>
              <div className="bs-popup-subheader">
                <span className="bs-header-item">รายการอุปกรณ์</span>
                <span className="bs-header-quantity">จำนวน</span>
              </div>
              <div className="bs-popup-body">
                <ul className="bs-details-list">
                  <li className="bs-detail-item">
                    <span className="bs-item-name">{selectedBorrowDetails.itemName || "ไม่ระบุ"}</span>
                    <span className="bs-item-quantity">{selectedBorrowDetails.quantity || 0}</span>
                  </li>
                </ul>
              </div>
              <div className="bs-popup-footer">
                {!isUserView && isBorrowStatusEditable(selectedBorrowDetails.borrowStatus) && (
                  <button
                    type="button"
                    className="bs-btn-return"
                    onClick={() => handleReturnEquipment(selectedBorrowDetails.borrowID)}
                  >
                    <i className="bi bi-check-circle-fill"></i> บันทึกการคืน
                  </button>
                )}
                <button type="button" className="bs-btn-secondary" onClick={() => setShowDetailModal(false)}>
                  <i className="bi bi-x-lg"></i> ปิด
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showUploadModal && (
        <div className="bs-popup-overlay">
          <div className="bs-popup-dialog">
            <div className="bs-popup-content">
              <div className="bs-popup-header">
                <h5 className="bs-popup-title">โปรดใส่รูปเพื่อยืนยันการคืน</h5>
                <button type="button" className="bs-btn-close" onClick={() => setShowUploadModal(false)}>
                  <span>×</span>
                </button>
              </div>
              <div className="bs-popup-body">
                <p className="bs-upload-text">กรุณาเลือกไฟล์รูปภาพ (.jpg หรือ .png) เพื่อยืนยันการคืนอุปกรณ์</p>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleImageChange}
                  className="bs-upload-input"
                />
                {selectedImage && (
                  <div className="bs-image-preview-container">
                    <p className="bs-image-name"></p>
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="ตัวอย่างรูปภาพ"
                      className="bs-image-preview"
                    />
                  </div>
                )}
              </div>
              <div className="bs-popup-footer">
                <button
                  type="button"
                  className="bs-btn-return"
                  onClick={handleConfirmReturn}
                  disabled={!selectedImage}
                >
                  <i className="bi bi-check-circle-fill"></i> ยืนยันการคืน
                </button>
                <button
                  type="button"
                  className="bs-btn-secondary"
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedImage(null);
                    setSelectedBorrowId(null);
                  }}
                >
                  <i className="bi bi-x-lg"></i> ยกเลิก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAlertModal && (
        <div className="bs-popup-overlay">
          <div className="bs-popup-dialog" role="document">
            <div className="bs-popup-content">
              <div className="bs-popup-header">
                <h5 className="bs-popup-title">การแจ้งเตือน</h5>
                <button type="button" className="bs-btn-close" onClick={() => setShowAlertModal(false)}>
                  <span>×</span>
                </button>
              </div>
              <div className="bs-popup-body">
                <p>{alertMessage}</p>
              </div>
              <div className="bs-popup-footer">
                <button type="button" className="bs-btn-secondary" onClick={() => setShowAlertModal(false)}>
                  ตกลง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {getSelectedTable()}
    </div>
  );
};

export default BorrowStatus;