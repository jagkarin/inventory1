import React, { useEffect, useState } from "react";
import "./css/approveproduct.css";

const getImagePath = (filename) => {
    if (!filename || typeof filename !== "string" || filename.trim() === "") {
        return "";
    }
    const baseUrl = "https://localhost:7294";
    return `${baseUrl}${filename}`;
};

const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return '-';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime()) || date.getFullYear() < 1900) {
            console.warn('วันที่ไม่ถูกต้องหรือไม่สมเหตุสมผล:', dateStr);
            return '-';
        }
        const gmt7Date = new Date(date.getTime() + (7 * 60 * 60 * 1000));
        return gmt7Date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการประมวลผลวันที่:', error, dateStr);
        return '-';
    }
};

const ApproveWithdrawPage = () => {
    const [pendingWithdraws, setPendingWithdraws] = useState([]);
    const [approvedWithdraws, setApprovedWithdraws] = useState([]);
    const [rejectedWithdraws, setRejectedWithdraws] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = () => {
        setLoading(true);
        fetch("https://localhost:7294/api/EquipmentBorrow/GetAllEQMData", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`เกิดข้อผิดพลาด HTTP! สถานะ: ${res.status}`);
                }
                return res.json();
            })
            .then(response => {
                const dataArray = Array.isArray(response.data) ? response.data : [];
                const filteredData = dataArray.filter(item => item.itemtype === 1);
                setPendingWithdraws(filteredData.filter(item => item.status === 0));
                setApprovedWithdraws(filteredData.filter(item => item.status === 1));
                setRejectedWithdraws(filteredData.filter(item => item.status === 2));
                setLoading(false);
            })
            .catch(err => {
                console.error("เกิดข้อผิดพลาดในการเรียกข้อมูล:", err);
                alert("ไม่สามารถเรียกข้อมูลได้: " + err.message);
                setPendingWithdraws([]);
                setApprovedWithdraws([]);
                setRejectedWithdraws([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApproval = (borrowID, status) => {
        const payload = {
            BorrowId: borrowID,
            Status: status,
            BorrowStatus: status === 1 ? 0 : 0
        };
    
        fetch(`https://localhost:7294/api/EquipmentBorrow/approve/${borrowID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
            .then(res => {
                if (!res.ok) {
                    return res.text().then(text => { throw new Error(`การปรับปรุงสถานะล้มเหลว: ${res.status} - ${text}`); });
                }
                return res.json();
            })
            .then(() => fetchData())
            .catch(err => {
                console.error("เกิดข้อผิดพลาดในการปรับปรุงสถานะ:", err);
                alert("เกิดข้อผิดพลาด: " + err.message);
            });
    };

    const handleApproveAllByUser = (fullname) => {
        const userWithdraws = pendingWithdraws.filter(w => `${w.firstname} ${w.lastname}` === fullname);
        const pendingIds = userWithdraws.map(w => w.borrowID);

        Promise.all(
            pendingIds.map(id => 
                fetch(`https://localhost:7294/api/EquipmentBorrow/approve/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        borrowId: id,
                        status: 1,
                        borrowStatus: 1
                    }),
                })
            )
        )
            .then(() => fetchData())
            .catch(err => console.error("เกิดข้อผิดพลาดในการอนุมัติทั้งหมด:", err));
    };

    const groupedPendingWithdraws = pendingWithdraws.reduce((acc, withdraw) => {
        const fullname = `${withdraw.firstname} ${withdraw.lastname}`;
        acc[fullname] = acc[fullname] || [];
        acc[fullname].push(withdraw);
        return acc;
    }, {});

    return (
        <div className="AP-container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    {/* คำขอเบิกที่รอดำเนินการ */}
                    <div className="AP-card shadow-sm mb-4">
                        <div className="AP-card-header">
                            <h4 className="AP-card-title">คำขอเบิกสินค้าที่รอดำเนินการ</h4>
                        </div>
                        <div className="card-body">
                            {loading ? (
                                <div className="text-center py-4">
                                    <div className="AP-spinner-border" role="status">
                                        <span className="visually-hidden">กำลังเรียกข้อมูล...</span>
                                    </div>
                                </div>
                            ) : (
                                Object.keys(groupedPendingWithdraws).length > 0 ? (
                                    Object.entries(groupedPendingWithdraws).map(([fullname, withdraws]) => (
                                        <details key={fullname} className="AP-details mb-3">
                                            <summary className="AP-summary">
                                                {fullname} - จำนวนคำขอ ({withdraws.length} รายการ)
                                            </summary>
                                            <table className="AP-table table-hover mt-2">
                                                <thead>
                                                    <tr>
                                                        <th>รหัสคำขอ</th>
                                                        <th>ชื่อรายการสินค้า</th>
                                                        <th>หมายเลขประจำสินค้า</th>
                                                        <th>รูปภาพ</th>
                                                        <th>จำนวน</th>
                                                        <th>วันที่ขอเบิก</th>
                                                        <th>เหตุผล</th>
                                                        <th>สถานะ</th>
                                                        <th>การดำเนินการ</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {withdraws.map(withdraw => (
                                                        <tr key={withdraw.borrowID}>
                                                            <td>{withdraw.borrowID || '-'}</td>
                                                            <td>{withdraw.itemName || '-'}</td>
                                                            <td>{withdraw.serialNumber || '-'}</td>
                                                            <td>
                                                                <img
                                                                    src={getImagePath(withdraw.image)}
                                                                    alt={withdraw.itemName || 'ภาพสินค้า'}
                                                                    className="AP-product-image"
                                                                    onError={(e) => e.target.src = '/placeholder.jpg'}
                                                                />
                                                            </td>
                                                            <td>{withdraw.quantity || '-'}</td>
                                                            <td>{formatDateForDisplay(withdraw.borrowDate)}</td>
                                                           
                                                            <td>{withdraw.reason || '-'}</td>
                                                            <td><span className="AP-badge AP-bg-warning">รอดำเนินการ</span></td>
                                                            <td>
                                                                <button
                                                                    className="AP-btn AP-btn-success AP-btn-sm me-2"
                                                                    onClick={() => handleApproval(withdraw.borrowID, 1)}
                                                                >
                                                                    อนุมัติ
                                                                </button>
                                                                <button
                                                                    className="AP-btn AP-btn-danger AP-btn-sm"
                                                                    onClick={() => handleApproval(withdraw.borrowID, 2)}
                                                                >
                                                                    ไม่อนุมัติ
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <div className="text-end">
                                                <button
                                                    className="AP-btn AP-btn-primary"
                                                    onClick={() => handleApproveAllByUser(fullname)}
                                                >
                                                    อนุมัติทั้งหมดสำหรับ {fullname}
                                                </button>
                                            </div>
                                        </details>
                                    ))
                                ) : (
                                    <div className="AP-text-muted text-center py-4">ไม่มีคำขอเบิกสินค้าที่รอดำเนินการ</div>
                                )
                            )}
                        </div>
                    </div>

                    {/* คำขอเบิกที่อนุมัติแล้ว */}
                    <div className="AP-card shadow-sm mb-4">
                        <div className="AP-card-header">
                            <h5 className="AP-card-title">คำขอเบิกสินค้าที่ได้รับการอนุมัติ</h5>
                        </div>
                        <div className="card-body">
                            {approvedWithdraws.length > 0 ? (
                                <table className="AP-table table-hover">
                                    <thead>
                                        <tr>
                                            <th>รหัสคำขอ</th>
                                            <th>ชื่อรายการสินค้า</th>
                                            <th>หมายเลขประจำสินค้า</th>
                                            <th>รูปภาพ</th>
                                            <th>จำนวน</th>
                                            <th>ชื่อ-นามสกุล</th>
                                            <th>วันที่ขอเบิก</th>
                                            <th>เหตุผล</th>
                                            <th>สถานะ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {approvedWithdraws.map(withdraw => (
                                            <tr key={withdraw.borrowID}>
                                                <td>{withdraw.borrowID || '-'}</td>
                                                <td>{withdraw.itemName || '-'}</td>
                                                <td>{withdraw.serialNumber || '-'}</td>
                                                <td>
                                                    <img
                                                        src={getImagePath(withdraw.image)}
                                                        alt={withdraw.itemName || 'ภาพสินค้า'}
                                                        className="AP-product-image"
                                                        onError={(e) => e.target.src = '/placeholder.jpg'}
                                                    />
                                                </td>
                                                <td>{withdraw.quantity || '-'}</td>
                                                <td>{`${withdraw.firstname || '-'} ${withdraw.lastname || '-'}`}</td>
                                                <td>{formatDateForDisplay(withdraw.borrowDate)}</td>
                                                <td>{withdraw.reason || '-'}</td>
                                                <td><span className="AP-badge AP-bg-success">ได้รับการอนุมัติ</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="AP-text-muted text-center py-3">ไม่มีคำขอเบิกสินค้าที่ได้รับการอนุมัติ</div>
                            )}
                        </div>
                    </div>

                    {/* คำขอเบิกที่ถูกปฏิเสธ */}
                    <div className="AP-card shadow-sm mb-4">
                        <div className="AP-card-header">
                            <h5 className="AP-card-title">คำขอเบิกสินค้าที่ไม่ได้รับการอนุมัติ</h5>
                        </div>
                        <div className="card-body">
                            {rejectedWithdraws.length > 0 ? (
                                <table className="AP-table table-hover">
                                    <thead>
                                        <tr>
                                            <th>รหัสคำขอ</th>
                                            <th>ชื่อรายการสินค้า</th>
                                            <th>หมายเลขประจำสินค้า</th>
                                            <th>รูปภาพ</th>
                                            <th>จำนวน</th>
                                            <th>ชื่อ-นามสกุล</th>
                                            <th>วันที่ขอเบิก</th>
                                            <th>เหตุผล</th>
                                            <th>สถานะ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rejectedWithdraws.map(withdraw => (
                                            <tr key={withdraw.borrowID}>
                                                <td>{withdraw.borrowID || '-'}</td>
                                                <td>{withdraw.itemName || '-'}</td>
                                                <td>{withdraw.serialNumber || '-'}</td>
                                                <td>
                                                    <img
                                                        src={getImagePath(withdraw.image)}
                                                        alt={withdraw.itemName || 'ภาพสินค้า'}
                                                        className="AP-product-image"
                                                        onError={(e) => e.target.src = '/placeholder.jpg'}
                                                    />
                                                </td>
                                                <td>{withdraw.quantity || '-'}</td>
                                                <td>{`${withdraw.firstname || '-'} ${withdraw.lastname || '-'}`}</td>
                                                <td>{formatDateForDisplay(withdraw.borrowDate)}</td>
                                                <td>{withdraw.reason || '-'}</td>
                                                <td><span className="AP-badge AP-bg-danger">ไม่ได้รับการอนุมัติ</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="AP-text-muted text-center py-3">ไม่มีคำขอเบิกสินค้าที่ไม่ได้รับการอนุมัติ</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApproveWithdrawPage;