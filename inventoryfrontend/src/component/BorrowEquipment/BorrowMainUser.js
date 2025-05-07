import React, { useState } from 'react';
import BorrowForm from './BorrowForm.js';
import BorrowPage from './BorrowPage.js';
import BorrowStatus from './BorrowStatus.js';
import './BorrowMain.css';

const BorrowMainUser = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedWithdrawDetails, setSelectedWithdrawDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState('BorrowPage');

  const handleShowDetails = (details) => {
    setSelectedWithdrawDetails(details);
    setShowDetailModal(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'BorrowPage':
        return <BorrowPage onShowDetails={handleShowDetails} isUserView={true} />;
      case 'BorrowStatus':
        return <BorrowStatus onShowDetails={handleShowDetails} isUserView={true} />;
      default:
        return <BorrowPage onShowDetails={handleShowDetails} isUserView={true} />;
    }
  };

  return (
    <div>
      {/* ปุ่มควบคุมหน้า */}
      <div className="button-group">
        <button 
          className={`btn-main ${showModal ? 'active' : ''}`} 
          onClick={() => setShowModal(true)}
        >
          เบิกอุปกรณ์
        </button>
        <button 
          className={`btn-main ${currentPage === 'BorrowPage' ? 'active' : ''}`} 
          onClick={() => handlePageChange('BorrowPage')}
        >
          สถานะการอนุมัติ
        </button>
        <button 
          className={`btn-main ${currentPage === 'BorrowStatus' ? 'active' : ''}`} 
          onClick={() => handlePageChange('BorrowStatus')}
        >
          สถานะการคืน
        </button>
      </div>

      {/* แสดงหน้า */}
      {renderPage()}

      {/* Modal สำหรับฟอร์มเบิกอุปกรณ์ */}
      {showModal && (
        <>
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-xl" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">ฟอร์มการเบิกอุปกรณ์และสินค้า</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <BorrowForm onClose={() => setShowModal(false)} />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* Modal สำหรับแสดงรายละเอียด */}
      {showDetailModal && selectedWithdrawDetails && (
        <>
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">รายละเอียดการเบิก</h5>
                  <button type="button" className="btn-close" onClick={() => setShowDetailModal(false)}></button>
                </div>
                <div className="modal-body">
                  <pre>{JSON.stringify(selectedWithdrawDetails, null, 2)}</pre>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>
                    ปิด
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default BorrowMainUser;