import React, { useEffect, useState } from "react";
import "./css/admin.css";

const API_URL = "https://localhost:7294/api/Request";

const AdminApprovalPage = () => {
    const [requests, setRequests] = useState([]);

    // ดึงข้อมูลคำขอเบิกสินค้า
    useEffect(() => {
        fetch(`${API_URL}/GetAllRequests`)
            .then((res) => res.json())
            .then((data) => {
                if (data.responseCode === "200") {
                    setRequests(data.data);
                } else {
                    console.error("Error fetching requests:", data.message);
                }
            })
            .catch((err) => console.error(err));
    }, []);

    // ฟังก์ชันอนุมัติคำขอ
    const handleApprove = (requestId) => {
        fetch(`${API_URL}/ApproveRequest/${requestId}`, {
            method: "POST",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.responseCode === "200") {
                    alert("อนุมัติคำขอเรียบร้อยแล้ว");
                    setRequests((prevRequests) =>
                        prevRequests.filter((req) => req.requestId !== requestId)
                    );
                } else {
                    console.error("Error approving request:", data.message);
                }
            })
            .catch((err) => console.error(err));
    };

    // ฟังก์ชันปฏิเสธคำขอ
    const handleReject = (requestId) => {
        fetch(`${API_URL}/RejectRequest/${requestId}`, {
            method: "POST",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.responseCode === "200") {
                    alert("ปฏิเสธคำขอเรียบร้อยแล้ว");
                    setRequests((prevRequests) =>
                        prevRequests.filter((req) => req.requestId !== requestId)
                    );
                } else {
                    console.error("Error rejecting request:", data.message);
                }
            })
            .catch((err) => console.error(err));
    };

    return (
        <div className="admin-approval-page">
            <h1>ระบบอนุมัติคำขอเบิกสินค้า</h1>

            {requests.length > 0 ? (
                <table className="request-table">
                    <thead>
                        <tr>
                            <th>รหัสคำขอ</th>
                            <th>ชื่อพนักงาน</th>
                            <th>รายการสินค้า</th>
                            <th>จำนวน</th>
                            <th>สถานะ</th>
                            <th>การจัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request) => (
                            <tr key={request.requestId}>
                                <td>{request.requestId}</td>
                                <td>{request.employeeName}</td>
                                <td>{request.productName}</td>
                                <td>{request.quantity}</td>
                                <td>{request.status}</td>
                                <td>
                                    <button
                                        className="btn-approve"
                                        onClick={() =>
                                            handleApprove(request.requestId)
                                        }
                                    >
                                        อนุมัติ
                                    </button>
                                    <button
                                        className="btn-reject"
                                        onClick={() =>
                                            handleReject(request.requestId)
                                        }
                                    >
                                        ปฏิเสธ
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>ไม่มีคำขอเบิกสินค้า</p>
            )}
        </div>
    );
};

export default AdminApprovalPage;
