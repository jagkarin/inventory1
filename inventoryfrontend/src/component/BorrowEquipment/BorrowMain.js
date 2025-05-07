import React, { useState } from 'react';
import BorrowPage from './BorrowPage.js';
import BorrowStatus from './BorrowStatus.js';
import './css/BorrowMain.css';
import BorrowForm from './BorrowForm.js';

const BorrowMain = () => {
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
        return <BorrowPage onShowDetails={handleShowDetails} isUserView={false} />;
      case 'BorrowStatus':
        return <BorrowStatus onShowDetails={handleShowDetails} isUserView={false} />;
      default:
        return <BorrowPage onShowDetails={handleShowDetails} isUserView={false} />;
    }
  };

  return (
    <div className="borrow-main-container">
      {/* ปุ่มควบคุมหน้า */}
     
      {/* แสดงหน้า */}
      {renderPage()}

      {/* Modal สำหรับฟอร์มเบิกอุปกรณ์ */}
      {showModal && (
        <>
          <div className="borrow-main-modal show d-block" tabIndex="-1" role="dialog">
            <div className="borrow-main-modal-dialog modal-xl" role="document">
              <div className="borrow-main-modal-content">
                <div className="borrow-main-modal-header">
                  <h5 className="borrow-main-modal-title">ฟอร์มการเบิกอุปกรณ์และสินค้า</h5>
                  <button type="button" className="borrow-main-btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="borrow-main-modal-body">
                  <BorrowForm onClose={() => setShowModal(false)} />
                </div>
                <div className="borrow-main-modal-footer">
                  <button type="button" className="borrow-main-btn-secondary" onClick={() => setShowModal(false)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="borrow-main-modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default BorrowMain;