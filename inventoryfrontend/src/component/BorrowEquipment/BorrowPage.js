import React, { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import './css/BorrowPage.css';

const getImagePath = (filename) => {
  if (!filename || typeof filename !== 'string' || filename.trim() === '') {
    return '';
  }
  const baseUrl = 'https://localhost:7294';
  return `${baseUrl}${filename}`;
};

const BorrowPage = ({ onShowDetails, isUserView = false }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [borrowData, setBorrowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("รอการอนุมัติ");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("borrowID");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [returnedCount, setReturnedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 15;

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://localhost:7294/api/EquipmentBorrow/GetAllEQMData', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`เกิดข้อผิดพลาด HTTP! สถานะ: ${response.status}`);
      }
      const data = await response.json();
      console.log("ข้อมูลการยืมที่ดึงมา:", data);

      const equipmentOnly = Array.isArray(data)
        ? data.filter(item => item.itemtype === 2)
        : (data.data && Array.isArray(data.data))
          ? data.data.filter(item => item.itemtype === 2)
          : [];

      setBorrowData(equipmentOnly);
      setFilteredData(equipmentOnly);
      updateStatusCounts(equipmentOnly, selectedMonth);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูลการยืม:', error);
      Swal.fire({
        title: "ข้อผิดพลาด",
        text: "ไม่สามารถเรียกข้อมูลการขอเบิกได้ กรุณาดำเนินการใหม่",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        title: "ข้อผิดพลาด",
        text: "กรุณาลงชื่อเข้าใช้ก่อนเข้าถึงหน้าการยืมอุปกรณ์",
        icon: "warning",
        confirmButtonText: "ตกลง",
      });
      return;
    }
    try {
      jwtDecode(token);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการถอดรหัส token:", error);
      Swal.fire({
        title: "ข้อผิดพลาด",
        text: "ข้อมูล token ไม่ถูกต้อง กรุณาลงชื่อเข้าใช้ใหม่",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    fetchData();
  }, []);

  const updateStatusCounts = (data, month) => {
    const pendingItems = data.filter((item) => item.status === 0);
    const approvedItems = data.filter((item) => item.status === 1 && item.borrowStatus !== 2);
    const rejectedItems = data.filter((item) => item.status === 2);
    const returnedItems = data.filter((item) => item.borrowStatus === 2);
    setPendingCount(pendingItems.length);
    setApprovedCount(approvedItems.length);
    setRejectedCount(rejectedItems.length);
    setReturnedCount(returnedItems.length);
  };

  const filterDataByStatusAndMonth = useCallback(() => {
    let filtered = borrowData;

    filtered = filtered.filter((item) => {
      if (selectedStatus === "รอการอนุมัติ") return item.status === 0;
      if (selectedStatus === "อนุมัติ") return item.status === 1 && item.borrowStatus !== 2;
      if (selectedStatus === "ไม่อนุมัติ") return item.status === 2;
      if (selectedStatus === "คืนแล้ว") return item.borrowStatus === 2;
      return true;
    });

    filtered = filtered.filter((item) => {
      if (!item.borrowDate) return true;
      const borrowDate = new Date(item.borrowDate);
      const borrowMonth = borrowDate.toISOString().slice(0, 7);
      return borrowMonth === selectedMonth;
    });

    if (searchTerm) {
      filtered = filtered.filter((item) => {
        const borrowId = item.borrowID?.toString().toLowerCase() || "";
        const itemName = item.itemName?.toLowerCase() || "";
        return (
          borrowId.includes(searchTerm.toLowerCase()) ||
          itemName.includes(searchTerm.toLowerCase())
        );
      });
    }

    filtered.sort((a, b) => {
      let valueA, valueB;
      if (sortKey === "status") {
        const statusOrder = { 0: 1, 1: 2, 2: 3 };
        valueA = statusOrder[a.status] || 0;
        valueB = statusOrder[b.status] || 0;
      } else {
        valueA = a[sortKey]?.toString().toLowerCase() || "";
        valueB = b[sortKey]?.toString().toLowerCase() || "";
      }
      return sortOrder === "asc" ? (valueA > valueB ? 1 : -1) : (valueA < valueB ? 1 : -1);
    });

    setFilteredData(filtered);
    updateStatusCounts(borrowData, selectedMonth);
  }, [borrowData, selectedStatus, selectedMonth, searchTerm, sortKey, sortOrder]);

  useEffect(() => {
    filterDataByStatusAndMonth();
  }, [filterDataByStatusAndMonth]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    const newOrder = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortOrder(newOrder);
    setCurrentPage(1);
  };

  const handleShowDetails = (item) => {
    setSelectedItemDetails(item);
    setShowDetailModal(true);
    if (onShowDetails) onShowDetails(item);
  };

  const handleUpdateStatus = (borrowID, statusText) => {
    if (!borrowID) {
      console.error("ไม่พบ BorrowId:", borrowID);
      Swal.fire({
        title: "ข้อผิดพลาด",
        text: "ไม่พบรหัสการยืม กรุณาตรวจสอบข้อมูล",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    const statusMap = {
      "อนุมัติ": 1,
      "ไม่อนุมัติ": 2,
    };
    const status = statusMap[statusText];

    const payload = {
      BorrowId: borrowID,
      Status: status,
      BorrowStatus: status === 1 ? 1 : 0,
    };

    fetch(`https://localhost:7294/api/EquipmentBorrow/approve/${borrowID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(res => {
        if (!res.ok) {
          return res.text().then(text => { throw new Error(`การปรับปรุงสถานะล้มเหลว สถานะ: ${res.status} - ${text}`); });
        }
        return res.json();
      })
      .then(() => {
        if (statusText === "อนุมัติ") {
          Swal.fire({
            title: "อนุมัติสำเร็จ",
            text: `การยืมอุปกรณ์ได้รับการอนุมัติเรียบร้อยแล้ว`,
            icon: "success",
            confirmButtonText: "ตกลง",
            customClass: {
              popup: "eqmBorrow-popup",
              title: "eqmBorrow-title",
              confirmButton: "eqmBorrow-confirm",
            },
          });
        } else if (statusText === "ไม่อนุมัติ") {
          Swal.fire({
            title: "ปฏิเสธ",
            text: `การยืมอุปกรณ์ได้รับการปฏิเสธเรียบร้อยแล้ว`,
            icon: "error",
            confirmButtonText: "ตกลง",
            customClass: {
              popup: "eqmBorrow-popup",
              title: "eqmBorrow-title",
              confirmButton: "eqmBorrow-cancel",
            },
          });
        }
        fetchData();
        setShowDetailModal(false);
      })
      .catch(err => {
        console.error("เกิดข้อผิดพลาดในการปรับปรุงสถานะ:", err);
        const errorMessage = err.message;
        if (errorMessage.includes("ไม่มีจำนวนเพียงพอ") || errorMessage.includes("ไม่พร้อม")) {
          setAlertMessage("ไม่สามารถอนุมัติได้ เนื่องจากอุปกรณ์นี้มีผู้ยืมไปแล้วหรือจำนวนคงคลังไม่เพียงพอ");
          setShowAlertModal(true);
        } else {
          Swal.fire({
            title: "ข้อผิดพลาด",
            text: errorMessage,
            icon: "error",
            confirmButtonText: "ตกลง",
            customClass: {
              popup: "eqmBorrow-popup",
              title: "eqmBorrow-title",
              confirmButton: "eqmBorrow-confirm",
            },
          });
        }
      });
  };

  const handleReturnEquipment = (borrowID) => {
    Swal.fire({
      title: "ยืนยันการคืน",
      text: "คุณต้องการยืนยันการคืนอุปกรณ์นี้หรือไม่?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://localhost:7294/api/EquipmentBorrow/return/${borrowID}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ BorrowId: borrowID, BorrowStatus: 2 }),
        })
          .then(res => {
            if (!res.ok) {
              throw new Error("การคืนอุปกรณ์ล้มเหลว");
            }
            return res.json();
          })
          .then(() => {
            Swal.fire({
              title: "คืนสำเร็จ",
              text: "อุปกรณ์ได้รับการคืนเรียบร้อยแล้ว",
              icon: "success",
              confirmButtonText: "ตกลง",
            });
            fetchData();
            setShowDetailModal(false);
          })
          .catch(err => {
            console.error("เกิดข้อผิดพลาดในการคืนอุปกรณ์:", err);
            Swal.fire({
              title: "ข้อผิดพลาด",
              text: "ไม่สามารถคืนอุปกรณ์ได้ กรุณาลองใหม่",
              icon: "error",
              confirmButtonText: "ตกลง",
            });
          });
      }
    });
  };

  const isStatusEditable = (status) => {
    return status === 0;
  };

  const formatThaiDate = (date) => {
    if (!date || date === "0001-01-01") return 'ยังไม่ระบุ';
    const localDate = new Date(date);
    const thaiDate = new Date(localDate.getTime() + (7 * 60 * 60 * 1000));
    return thaiDate.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

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

  const getStatusText = (status) => {
    switch (status) {
      case 0: return "รอการอนุมัติ";
      case 1: return "อนุมัติ";
      case 2: return "ไม่อนุมัติ";
      default: return "ไม่ระบุสถานะ";
    }
  };

  const renderTable = (data, title, statusClass) => {
    const { paginatedData, totalPages } = getPaginatedData(data);

    return (
      <div className="bp-table-container">
        <h2 className="bp-table-title">{title}</h2>

        <div className="bp-controls">
          <div className="bp-search">
            <input
              type="text"
              placeholder="ค้นหาด้วยรหัสการยืมหรือชื่ออุปกรณ์..."
              value={searchTerm}
              onChange={handleSearch}
              className="bp-search-input"
            />
          </div>
          <div className="bp-month-filter">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setCurrentPage(1);
                updateStatusCounts(borrowData, e.target.value);
              }}
              className="bp-month-input"
            />
          </div>
          <div className="bp-status-buttons">
            <button
              className={`bp-status-wait ${selectedStatus === "รอการอนุมัติ" ? "active" : ""}`}
              onClick={() => {
                setSelectedStatus("รอการอนุมัติ");
                setCurrentPage(1);
                setSearchTerm("");
              }}
            >
              รอการอนุมัติ {pendingCount > 0 && `(${pendingCount})`}
            </button>
            <button
              className={`bp-status-accpet ${selectedStatus === "อนุมัติ" ? "active" : ""}`}
              onClick={() => {
                setSelectedStatus("อนุมัติ");
                setCurrentPage(1);
                setSearchTerm("");
              }}
            >
              อนุมัติ {approvedCount > 0 && `(${approvedCount})`}
            </button>
            <button
              className={`bp-status-reject ${selectedStatus === "ไม่อนุมัติ" ? "active" : ""}`}
              onClick={() => {
                setSelectedStatus("ไม่อนุมัติ");
                setCurrentPage(1);
                setSearchTerm("");
              }}
            >
              ไม่อนุมัติ {rejectedCount > 0 && `(${rejectedCount})`}
            </button>
            <button
              className={`bp-status-returned ${selectedStatus === "คืนแล้ว" ? "active" : ""}`}
              onClick={() => {
                setSelectedStatus("คืนแล้ว");
                setCurrentPage(1);
                setSearchTerm("");
              }}
            >
              คืนแล้ว {returnedCount > 0 && `(${returnedCount})`}
            </button>
          </div>
          <div className="bp-sort">
            <label>เรียงลำดับตาม: </label>
            <button
              onClick={() => handleSort(sortKey)}
              className="bp-sort-btn"
            >
              {sortOrder === "asc" ? "↑ จากเก่าไปใหม่" : "↓ จากใหม่ไปเก่า"}
            </button>
          </div>
        </div>
        <div className="bp-table-responsive">
          <table className={`bp-table ${statusClass}`}>
            <thead>
              <tr>
                <th>รหัสการยืม</th>
                <th>ผู้ยืม</th>
                <th>วันที่ขอ</th>
                <th>สถานะ</th>
                <th>รายละเอียด</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr key={item.borrowID} className={`bp-table-row ${index % 2 === 0 ? 'bp-table-row-even' : ''}`}>
                    <td>{item.borrowID}</td>
                    <td>{item.firstname ? `${item.firstname} ${item.lastname || ''}` : '-'}</td>
                    <td>{formatThaiDate(item.borrowDate)}</td>
                    <td>
                      <i
                        className={`bi bp-status-check ${item.status === 0
                            ? "bi-question-circle-fill active"
                            : item.status === 1
                              ? "bi-check-circle-fill active"
                              : "bi-x-circle-fill active"
                          }`}
                      ></i>
                    </td>
                    <td>
                      <button
                        className="bp-btn-info"
                        onClick={() => handleShowDetails(item)}
                      >
                        ดูรายละเอียด
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
                    <div className="bp-empty-state">
                      <i className="bi bi-inbox"></i>
                      <p>{searchTerm ? "ไม่พบข้อมูลที่ค้นหา" : "ไม่มีข้อมูลการยืมอุปกรณ์ในสถานะนี้"}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="bp-pagination">
            <button
              className="bp-pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              หน้าที่แล้ว
            </button>
            <span className="bp-pagination-info">
              หน้า {currentPage} จากทั้งหมด {totalPages}
            </span>
            <button
              className="bp-pagination-btn"
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
    switch (selectedStatus) {
      case "รอการอนุมัติ":
        return renderTable(filteredData, "รายการการยืมอุปกรณ์", "bp-table-pending");
      case "อนุมัติ":
        return renderTable(filteredData, "รายการการยืมอุปกรณ์", "bp-table-approved");
      case "ไม่อนุมัติ":
        return renderTable(filteredData, "รายการการยืมอุปกรณ์", "bp-table-cancelled");
      case "คืนแล้ว":
        return renderTable(filteredData, "รายการการยืมอุปกรณ์", "bp-table-returned");
      default:
        return renderTable(filteredData, "รายการการยืมอุปกรณ์", "");
    }
  };

  return (
    <div className="bp-container">
      {showDetailModal && selectedItemDetails && (
        <div className="bp-popup-overlay">
          <div className="bp-popup-dialog" role="document">
            <div className="bp-popup-content">
              <div className="bp-popup-header">
                <h5 className="bp-popup-title">รายละเอียดการยืมอุปกรณ์ (รหัสการยืม: {selectedItemDetails.borrowID})</h5>
                <button type="button" className="bp-btn-close" onClick={() => setShowDetailModal(false)}>
                  <span>×</span>
                </button>
              </div>
              <div className="bp-popup-info">
                <div className="bp-info-item">
                  <strong>รหัสการยืม:</strong> {selectedItemDetails.borrowID}
                </div>
                <div className="bp-info-item">
                  <strong>ผู้ยืม:</strong> {selectedItemDetails.firstname ? `${selectedItemDetails.firstname} ${selectedItemDetails.lastname || ''}` : '-'}
                </div>
                <div className="bp-info-item">
                  <strong>วันที่ขอ:</strong> {formatThaiDate(selectedItemDetails.borrowDate)}
                </div>
                <div className="bp-info-item">
                  <strong>วันที่กำหนดคืน:</strong> {formatThaiDate(selectedItemDetails.returnDate)}
                </div>
                <div className="bp-info-item">
                  <strong>สถานะ:</strong> {getStatusText(selectedItemDetails.status)}
                </div>
                <div className="bp-info-item">
                  <strong>สถานะการยืม:</strong> {selectedItemDetails.borrowStatus === 1 ? "อยู่ระหว่างการยืม" : selectedItemDetails.borrowStatus === 2 ? "คืนแล้ว" : "ยังไม่ได้รับการยืม"}
                </div>
                <div className="bp-info-item">
                  <strong>รูปยืนยันการคืน:</strong>
                  {selectedItemDetails.borrowStatus === 2 && selectedItemDetails.returnimage ? (
                    <img
                      src={getImagePath(selectedItemDetails.returnimage)}
                      alt="รูปยืนยันการคืน"
                      style={{ width: '100px', height: '100px', objectFit: 'contain', marginLeft: '10px' }}
                    />
                  ) : (
                    <span>ยังไม่มีรูป</span>
                  )}
                </div>
                <div className="bp-info-item bp-borrow-description">
                  <strong>เหตุผลในการยืม:</strong> {selectedItemDetails.reason || "ไม่ได้ระบุ"}
                </div>
              </div>
              <div className="bp-popup-subheader">
                <span className="bp-header-image">รูปภาพ</span>
                <span className="bp-header-name">ชื่ออุปกรณ์</span>
                <span className="bp-header-quantity">จำนวน</span>
              </div>
              <div className="bp-popup-body">
                <ul className="bp-details-list">
                  <li className="bp-detail-item">
                    <span className="bp-item-image">
                      {selectedItemDetails.image ? (
                        <img
                          src={getImagePath(selectedItemDetails.image)}
                          alt={selectedItemDetails.itemName || 'ภาพอุปกรณ์'}
                          style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                        />
                      ) : (
                        <span>ไม่มีรูปภาพ</span>
                      )}
                    </span>
                    <span className="bp-item-name">{selectedItemDetails.itemName || '-'}</span>
                    <span className="bp-item-quantity">{selectedItemDetails.quantity || 0}</span>
                  </li>
                </ul>
              </div>
              <div className="bp-popup-footer">
                {!isUserView && isStatusEditable(selectedItemDetails.status) && (
                  <>
                    <button
                      type="button"
                      className="bp-success"
                      onClick={() => handleUpdateStatus(selectedItemDetails.borrowID, "อนุมัติ")}
                    >
                      อนุมัติ
                    </button>
                    <button
                      type="button"
                      className="bp-cancel"
                      onClick={() => handleUpdateStatus(selectedItemDetails.borrowID, "ไม่อนุมัติ")}
                    >
                      ไม่อนุมัติ
                    </button>
                  </>
                )}
                <button type="button" className="bp-btn-secondary" onClick={() => setShowDetailModal(false)}>
                  ปิด
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAlertModal && (
        <div className="bp-popup-overlay">
          <div className="bp-popup-dialog" role="document">
            <div className="bp-popup-content">
              <div className="bp-popup-header">
                <h5 className="bp-popup-title">การแจ้งเตือน</h5>
                <button type="button" className="bp-btn-close" onClick={() => setShowAlertModal(false)}>
                  <span>×</span>
                </button>
              </div>
              <div className="bp-popup-body">
                <p>{alertMessage}</p>
              </div>
              <div className="bp-popup-footer">
                <button type="button" className="bp-btn-secondary" onClick={() => setShowAlertModal(false)}>
                  ตกลง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <p>กำลังเรียกข้อมูล...</p>
      ) : (
        getSelectedTable()
      )}
    </div>
  );
};

export default BorrowPage;