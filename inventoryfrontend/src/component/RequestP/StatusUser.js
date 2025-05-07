import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import "./css/statusUser.css";

const getImagePath = (filename) => {
    if (!filename || typeof filename !== "string" || filename.trim() === "") {
        return "";
    }
    const baseUrl = "https://localhost:7294";
    return `${baseUrl}${filename}`;
};

const StatusUser = () => {
    const [pendingItems, setPendingItems] = useState([]);
    const [approvedItems, setApprovedItems] = useState([]);
    const [rejectedItems, setRejectedItems] = useState([]);
    const [userID, setUserID] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pendingPage, setPendingPage] = useState(1);
    const [approvedPage, setApprovedPage] = useState(1);
    const [rejectedPage, setRejectedPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const userId =
                    decodedToken.userId || decodedToken.UserId || decodedToken.id;
                if (!userId) {
                    throw new Error("ไม่พบรหัสผู้ใช้ใน token");
                }
                setUserID(parseInt(userId));
            } catch (error) {
                setError("ไม่สามารถถอดรหัสข้อมูลการยืนยันตัวตนได้");
                setLoading(false);
            }
        } else {
            setError("กรุณาลงชื่อเข้าใช้เพื่อดูข้อมูล");
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!userID) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    `https://localhost:7294/api/EquipmentBorrow/user/${userID}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    console.log("Raw data from API:", data);

                    // กรองเฉพาะ itemtype === 1
                    const itemData = data.filter((item) => {
                        const itemType = Number(item.itemtype);
                        console.log(`Item: ${JSON.stringify(item)}, itemType: ${itemType}`);
                        return itemType === 1;
                    });

                    if (itemData.length === 0) {
                        console.log("ไม่มีข้อมูลที่ itemtype === 1");
                        setError("ไม่มีข้อมูลสำหรับ itemType = 1");
                    }

                    // แปลง status เป็น number และกรองตามสถานะ
                    const parsedData = itemData.map((item) => ({
                        ...item,
                        status: Number(item.status),
                    }));

                    const pending = parsedData.filter((item) => item.status === 0);
                    const approved = parsedData.filter((item) => item.status === 1);
                    const rejected = parsedData.filter((item) => item.status === 2);

                    console.log("Pending Items (status 0):", pending);
                    console.log("Approved Items (status 1):", approved);
                    console.log("Rejected Items (status 2):", rejected);

                    setPendingItems(pending);
                    setApprovedItems(approved);
                    setRejectedItems(rejected);

                    setPendingPage(1);
                    setApprovedPage(1);
                    setRejectedPage(1);
                } else {
                    const errorText = await response.text();
                    setError(`ไม่สามารถเรียกข้อมูลได้: ${response.status} - ${errorText}`);
                }
            } catch (error) {
                console.error("Fetch error:", error);
                setError("เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบ API");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userID]);

    const getPaginatedData = (data, page) => {
        const totalItems = data.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return {
            paginatedData: data.slice(startIndex, endIndex),
            totalPages,
        };
    };

    const handlePageChange = (setPage, currentPage, totalPages, newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const formatThaiDate = (date) => {
        if (!date || date === "0001-01-01") return "ยังไม่ระบุ";
        const parsedDate = new Date(date);
        return isNaN(parsedDate.getTime())
            ? "วันที่ไม่ถูกต้อง"
            : parsedDate.toLocaleString("th-TH", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
              });
    };

    const renderTable = (data, title, statusClass, currentPage, setPage) => {
        const { paginatedData, totalPages } = getPaginatedData(data, currentPage);
        console.log(`Rendering ${title}:`, paginatedData);

        return (
            <div className="stu-table-container">
                <h2 className="stu-table-title">
                    <i
                        className={`bi ${
                            statusClass === "stu-table-pending"
                                ? "bi-hourglass-split"
                                : statusClass === "stu-table-approved"
                                ? "bi-check-circle-fill"
                                : "bi-x-circle-fill"
                        } me-2`}
                    ></i>
                    {title}
                </h2>
                <div className="stu-table-responsive">
                    {loading ? (
                        <div className="stu-loading">
                            <i className="bi bi-arrow-repeat me-2"></i>
                            กำลังเรียกข้อมูล...
                        </div>
                    ) : error ? (
                        <div className="stu-error">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            {error}
                        </div>
                    ) : paginatedData.length > 0 ? (
                        <table className={`stu-table ${statusClass}`}>
                            <thead>
                                <tr>
                                    <th>รหัส</th>
                                    <th>รูปภาพ</th>
                                    <th>ชื่อสินค้า</th>
                                    <th>จำนวน</th>
                                    <th>หน่วยนับ</th> {/* Added Unit column */}
                                    <th>วันที่ขอเบิก</th>
                                    <th>เหตุผล</th>
                                    <th>สถานะ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map((item) => (
                                    <tr key={item.borrowID}>
                                        <td>{item.borrowID || "ไม่ระบุ"}</td>
                                        <td>
                                            <img
                                                src={getImagePath(item.image)}
                                                alt={item.itemName || "ภาพสินค้า"}
                                                className="AP-product-image"
                                                onError={(e) => (e.target.src = "/placeholder.jpg")}
                                            />
                                        </td>
                                        <td>{item.itemName || "-"}</td>
                                        <td>{item.quantity || "-"}</td>
                                        <td>{item.unit || "-"}</td> {/* Added Unit data */}
                                        <td>{formatThaiDate(item.borrowDate)}</td>
                                        <td>{item.reason || "-"}</td>
                                        <td>
                                            {item.status === 0 ? (
                                                <span className="stu-status-wait">
                                                    <i className="bi bi-hourglass-split me-1"></i>
                                                    รอการอนุมัติ
                                                </span>
                                            ) : item.status === 1 ? (
                                                <span className="stu-status-accept">
                                                    <i className="bi bi-check-circle-fill me-1"></i>
                                                    อนุมัติแล้ว
                                                </span>
                                            ) : (
                                                <span className="stu-status-reject">
                                                    <i className="bi bi-x-circle-fill me-1"></i>
                                                    ถูกปฏิเสธ
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="stu-empty-state">
                            <i className="bi bi-inbox"></i>
                            <p>ไม่มีข้อมูลในสถานะนี้</p>
                        </div>
                    )}
                </div>

                {!loading && !error && totalPages > 1 && (
                    <div className="stu-pagination">
                        <button
                            className="stu-pagination-btn"
                            onClick={() =>
                                handlePageChange(setPage, currentPage, totalPages, currentPage - 1)
                            }
                            disabled={currentPage === 1}
                        >
                            <i className="bi bi-chevron-left me-1"></i>
                            หน้าก่อนหน้า
                        </button>
                        <span className="stu-pagination-info">
                            หน้า {currentPage} จาก {totalPages}
                        </span>
                        <button
                            className="stu-pagination-btn"
                            onClick={() =>
                                handlePageChange(setPage, currentPage, totalPages, currentPage + 1)
                            }
                            disabled={currentPage === totalPages}
                        >
                            หน้าถัดไป
                            <i className="bi bi-chevron-right ms-1"></i>
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="stu-container">
            {renderTable(
                pendingItems,
                "สถานะสินค้า: รอการอนุมัติ",
                "stu-table-pending",
                pendingPage,
                setPendingPage
            )}
            {renderTable(
                approvedItems,
                "สถานะสินค้า: อนุมัติแล้ว",
                "stu-table-approved",
                approvedPage,
                setApprovedPage
            )}
            {renderTable(
                rejectedItems,
                "สถานะสินค้า: ถูกปฏิเสธ",
                "stu-table-rejected",
                rejectedPage,
                setRejectedPage
            )}
        </div>
    );
};

export default StatusUser;