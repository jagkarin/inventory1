import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './css/Profile.css';
import Swal from 'sweetalert2';
import { API_UPIDUSER } from '../API.js';

const formatDateForInput = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime()) || date.getTime() < 1900) {
      console.warn('วันที่ไม่ถูกต้องหรือไม่สมเหตุสมผล:', dateStr);
      return '';
    }
    const gmt7Date = new Date(date.getTime() + (7 * 60 * 60 * 1000));
    return gmt7Date.toISOString().split('T')[0];
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการประมวลผลวันที่:', error, dateStr);
    return '';
  }
};

const formatDateForBackend = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const utcDate = new Date(date.getTime() - (7 * 60 * 60 * 1000));
  return utcDate.toISOString();
};

const Profile = ({ onLogout }) => {
  const [user, setUser] = useState({
    userID: null,
    username: '',
    firstname: '',
    lastname: '',
    roleName: 'ไม่ระบุตำแหน่ง',
    roleID: '',
    profilePicture: '',
    email: '',
    phonenumber: '',
    dateofbirth: '',
    address: ''
  });
  const [passwords, setPasswords] = useState({
    new: '',
    confirm: '',
    visible: false
  });
  const [file, setFile] = useState({ selected: null, preview: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const getImagePath = (filename) => {
    if (!filename || typeof filename !== "string" || filename.trim() === "") {
      return "";
    }
    const baseUrl = "https://localhost:7294";
    const path = `${baseUrl}${filename}`;
    return path;
  };

  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('[GET] กำลังเรียกข้อมูลโปรไฟล์:', {
        url: `https://localhost:7294/api/User/GetUserbyuserID?userid=${user.userID}`,
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });

      const response = await fetch(`https://localhost:7294/api/User/GetUserbyuserID?userid=${user.userID}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });

      if (!response.ok) throw new Error('ไม่สามารถเรียกข้อมูลโปรไฟล์ได้');

      const data = await response.json();
      console.log('[GET] ได้รับข้อมูลโปรไฟล์:', data);

      const updatedRoleName = data.roleID === '1' ? 'ผู้ดูแลระบบ' : data.roleID === '2' ? 'พนักงาน' : data.roleName || 'ไม่ระบุตำแหน่ง';
      setUser(prev => ({
        ...prev,
        ...data,
        roleName: updatedRoleName,
        profilePicture: getImagePath(data.profilePicture || prev.profilePicture),
        email: data.email || prev.email,
        phonenumber: data.phonenumber || prev.phonenumber,
        firstname: data.firstname || prev.firstname,
        lastname: data.lastname || prev.lastname,
        dateofbirth: data.dateofbirth || prev.dateofbirth,
        address: data.address || prev.address
      }));
    } catch (error) {
      console.error('[GET] เกิดข้อผิดพลาดในการเรียกข้อมูลโปรไฟล์:', error);
      setUser(prev => ({ ...prev, roleName: 'ไม่ระบุตำแหน่ง' }));
    }
  }, [user.userID]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const roleIdFromToken = decoded.roleId || decoded.roleID || '';
        const roleName = roleIdFromToken === '1' ? 'ผู้ดูแลระบบ' : roleIdFromToken === '2' ? 'พนักงาน' : 'ไม่ระบุตำแหน่ง';

        setUser(prev => ({
          ...prev,
          userID: decoded.userId,
          username: decoded.username || '',
          firstname: decoded.firstname || '',
          lastname: decoded.lastname || '',
          roleID: roleIdFromToken,
          roleName: roleName,
          profilePicture: getImagePath(decoded.profilePicture || ''),
          email: decoded.email || '',
          phonenumber: decoded.phonenumber || '',
          dateofbirth: decoded.dateofbirth || '',
          address: decoded.address || ''
        }));
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการถอดรหัส token:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (!user.userID) return;
    fetchProfile();
  }, [fetchProfile, user.userID]);

  const handleImageChange = (e) => {
    const selected = e.target.files[0];
    if (selected && ['image/png', 'image/jpeg'].includes(selected.type)) {
      setFile({ selected, preview: URL.createObjectURL(selected) });
      setErrors(prev => ({ ...prev, image: '' }));
    } else {
      setFile({ selected: null, preview: '' });
      setErrors(prev => ({ ...prev, image: 'กรุณาเลือกไฟล์ภาพที่ถูกต้อง (.png หรือ .jpg)' }));
    }
  };

  const handleInputChange = (field) => (e) => {
    if (field === 'dateofbirth') {
      setUser(prev => ({ ...prev, [field]: formatDateForBackend(e.target.value) }));
    } else {
      setUser(prev => ({ ...prev, [field]: e.target.value }));
    }
  };

  const handlePasswordChange = (field) => (e) => {
    const value = e.target.value;
    setPasswords(prev => {
      const updated = { ...prev, [field]: value };
      setErrors(prevErrors => ({
        ...prevErrors,
        confirm: updated.new !== updated.confirm ? 'รหัสผ่านใหม่ไม่ตรงกัน' : ''
      }));
      return updated;
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
  
    if (file.selected) {
      formData.append('ProfilePicture', file.selected);
    } else if (user.profilePicture) {
      formData.append('ProfilePicture', user.profilePicture.split('/').pop());
    }
  
    formData.append('Email', user.email);
    formData.append('Phonenumber', user.phonenumber);
    formData.append('Firstname', user.firstname);
    formData.append('Lastname', user.lastname);
    formData.append('Dateofbirth', user.dateofbirth || '');
    formData.append('Address', user.address || '');
    formData.append('UpdatedAt', new Date().toISOString());
  
    const formDataEntries = {};
    for (let [key, value] of formData.entries()) {
      formDataEntries[key] = value instanceof File ? `[File: ${value.name}]` : value;
    }
  
    const updateUrl = `${API_UPIDUSER}/${user.userID}`;
    console.log('[PUT] กำลังปรับปรุงข้อมูลโปรไฟล์:', {
      url: updateUrl,
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: formDataEntries
    });
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(updateUrl, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
  
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
  
      console.log('[PUT] การตอบกลับจากการปรับปรุงโปรไฟล์:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });
  
      if (response.ok) {
        await Swal.fire({
          icon: 'success',
          title: 'บันทึกข้อมูลสำเร็จ',
          showConfirmButton: false,
          timer: 2000
        });
        await fetchProfile();
        setFile({ selected: null, preview: '' });
  
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else if (response.status === 405) {
        setErrors(prev => ({
          ...prev,
          profile: 'เซิร์ฟเวอร์ไม่อนุญาตให้ใช้เมธอด PUT กรุณาตรวจสอบการกำหนดค่า API'
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          profile: data.error || `ไม่สามารถปรับปรุงข้อมูลโปรไฟล์ได้! สถานะ: ${response.status}`
        }));
      }
    } catch (error) {
      console.error('[PUT] เกิดข้อผิดพลาดในการปรับปรุงโปรไฟล์:', error);
      setErrors(prev => ({ ...prev, profile: 'ข้อผิดพลาด: ' + error.message }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const { new: newPass, confirm } = passwords;
    if (!newPass || !confirm) {
      setErrors(prev => ({ ...prev, password: 'กรุณาระบุรหัสผ่านใหม่และยืนยันรหัสผ่าน' }));
      return;
    }
    if (newPass !== confirm) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = `https://localhost:7294/api/reset-password?username=${encodeURIComponent(user.username)}&newPassword=${encodeURIComponent(newPass)}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('การรีเซ็ตรหัสผ่านสำเร็จ');
        setPasswords({ new: '', confirm: '', visible: false });
        setErrors(prev => ({ ...prev, password: '', confirm: '' }));
        setTimeout(() => setMessage(''), 3000);
      } else {
        setErrors(prev => ({ ...prev, password: data.error || 'ไม่สามารถรีเซ็ตรหัสผ่านได้' }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, password: 'ข้อผิดพลาด: ' + error.message }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    const colors = {
      confirmButton: "#ff4d4d",
      cancelButton: "#00b7d1",
      backdrop: "rgba(0, 0, 0, 0.4)",
      successBackground: "linear-gradient(135deg, #e6fff0 0%, #f0fff7 100%)",
      textGray800: "#1f2937",
      textGray600: "#4b5563",
      textGray400: "#9ca3af",
      textGreen700: "#15803d",
      textGreen600: "#16a34a",
      textGreen500: "#22c55e",
    };

    const sharedClasses = {
      popup: "logout-popup rounded-xl border-0",
      title: "text-lg font-semibold tracking-wide",
      htmlContainer: "text-sm mt-1",
      icon: "border-0 mb-3",
    };

    Swal.fire({
      icon: "question",
      title: "ท่านแน่ใจหรือไม่?",
      text: "ท่านต้องการออกจากระบบหรือไม่?",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: colors.confirmButton,
      cancelButtonColor: colors.cancelButton,
      reverseButtons: false,
      backdrop: colors.backdrop,
      padding: "2rem",
      width: "20rem",
      buttonsStyling: false,
      focusCancel: true,
      customClass: {
        popup: sharedClasses.popup,
        title: `logout-title ${sharedClasses.title} text-[${colors.textGray800}]`,
        htmlContainer: `logout-text ${sharedClasses.htmlContainer} text-[${colors.textGray600}]`,
        confirmButton: `logout-confirm-btn rounded-lg px-5 py-2 font-medium shadow-md hover:shadow-lg transition-all duration-300`,
        cancelButton: `logout-cancel-btn rounded-lg px-5 py-2 font-medium shadow-md hover:shadow-lg transition-all duration-300`,
        icon: `logout-icon ${sharedClasses.icon} text-[${colors.textGray400}]`,
        actions: "mt-4 gap-2",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          onLogout();
          navigate("/login", { replace: true });
          Swal.fire({
            icon: "success",
            title: "การออกจากระบบสำเร็จ",
            text: "ท่านได้ออกจากระบบเรียบร้อยแล้ว",
            timer: 1800,
            showConfirmButton: false,
            background: colors.successBackground,
            padding: "1.5rem",
            width: "20rem",
            customClass: {
              popup: sharedClasses.popup,
              title: `logout-title ${sharedClasses.title} text-[${colors.textGreen700}]`,
              htmlContainer: `logout-text ${sharedClasses.htmlContainer} text-[${colors.textGreen600}]`,
              icon: `logout-icon ${sharedClasses.icon} text-[${colors.textGreen500}]`,
            },
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถออกจากระบบได้ กรุณาดำเนินการใหม่",
            confirmButtonText: "ตกลง",
            confirmButtonColor: colors.confirmButton,
            padding: "1.5rem",
            width: "20rem",
            customClass: {
              popup: sharedClasses.popup,
              title: `logout-title ${sharedClasses.title} text-[${colors.textGray800}]`,
              htmlContainer: `logout-text ${sharedClasses.htmlContainer} text-[${colors.textGray600}]`,
              confirmButton: `logout-confirm-btn rounded-lg px-5 py-2 font-medium shadow-md hover:shadow-lg transition-all duration-300`,
            },
          });
        }
      }
    });
  };

  return (
    <div>
      <div className="pf-profile-container">
        <h1 className="pf-h1">ข้อมูลส่วนตัว</h1>
        <div className="pf-profile-content">
          <div className="pf-image-upload-container">
            <div onClick={() => fileInputRef.current.click()} className="pf-profile-icon">
              {file.preview || user.profilePicture ? (
                <img
                  src={file.preview || user.profilePicture}
                  alt="ภาพประจำตัว"
                  style={{ borderRadius: '50%', width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                />
              ) : (
                <span style={{ fontSize: '70px', cursor: 'pointer' }}>👤</span>
              )}
            </div>
            {errors.image && <p className="pf-error-message">{errors.image}</p>}
            <input type="file" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} accept="image/png, image/jpeg" />
            <button onClick={() => fileInputRef.current.click()} className="pf-custom-upload-button">อัปโหลดภาพประจำตัว</button>
            <button
              type="button"
              className="pf-reset-password-button"
              onClick={() => setPasswords(prev => ({ ...prev, visible: true }))}
            >
              เปลี่ยนรหัสผ่าน
            </button>
          </div>

          <form onSubmit={handleUpdateProfile} className="pf-profile-form">
            <div className="pf-form-group">
              <label>ชื่อผู้ใช้:</label>
              <input type="text" value={user.username} disabled />
            </div>
            <div className="pf-form-group">
              <label>ชื่อ:</label>
              <input
                type="text"
                value={user.firstname}
                onChange={handleInputChange('firstname')}
                placeholder="ระบุชื่อจริง"
              />
            </div>
            <div className="pf-form-group">
              <label>นามสกุล:</label>
              <input
                type="text"
                value={user.lastname}
                onChange={handleInputChange('lastname')}
                placeholder="ระบุนามสกุล"
              />
            </div>
            <div className="pf-form-group">
              <label>อีเมล:</label>
              <input
                type="email"
                value={user.email}
                onChange={handleInputChange('email')}
                placeholder="ระบุอีเมล"
              />
            </div>
            <div className="pf-form-group">
              <label>หมายเลขโทรศัพท์:</label>
              <input
                type="text"
                value={user.phonenumber}
                onChange={handleInputChange('phonenumber')}
                placeholder="ระบุหมายเลขโทรศัพท์"
              />
            </div>
            <div className="pf-form-group">
              <label>วันเกิด:</label>
              <input
                type="date"
                value={formatDateForInput(user.dateofbirth)}
                onChange={handleInputChange('dateofbirth')}
              />
            </div>
            <div className="pf-form-group">
              <label>ที่อยู่:</label>
              <input
                type="text"
                value={user.address}
                onChange={handleInputChange('address')}
                placeholder="ระบุที่อยู่"
              />
            </div>
            <div className="pf-form-group">
              <label>ตำแหน่ง:</label>
              <input type="text" value={user.roleName} disabled />
            </div>
            {errors.profile && <p className="pf-error-message">{errors.profile}</p>}
            <div className="pf-button-container" style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', marginTop: '20px' }}>
              <button type="submit" className="pf-save-button" disabled={isLoading}>
                {isLoading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
              </button>
              <button
                type="button"
                className="pf-logout-button"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-2"></i> ออกจากระบบ
              </button>
            </div>
          </form>
        </div>
        {message && <p style={{ color: 'green', fontWeight: 'bold', textAlign: 'center', marginTop: '20px' }}>{message}</p>}
      </div>

      {passwords.visible && (
        <div className="pf-reset-full-overlay">
          <div className="pf-reset-full-popup">
            <h2 className="pf-popup-title">เปลี่ยนรหัสผ่าน</h2>
            <form onSubmit={handleResetPassword} className="pf-popup-form">
              <div className="pf-form-group">
                <label>รหัสผ่านใหม่:</label>
                <input
                  type="password"
                  value={passwords.new}
                  onChange={handlePasswordChange('new')}
                  placeholder="ระบุรหัสผ่านใหม่"
                />
              </div>
              <div className="pf-form-group">
                <label>ยืนยันรหัสผ่านใหม่:</label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={handlePasswordChange('confirm')}
                  placeholder="ยืนยันรหัสผ่านใหม่"
                />
              </div>
              {(errors.password || errors.confirm) && (
                <p className="pf-error-message">{errors.password || errors.confirm}</p>
              )}
              <div className="pf-popup-buttons">
                <button type="submit" className="pf-save-button" disabled={isLoading}>
                  {isLoading ? 'กำลังดำเนินการ...' : 'บันทึกการเปลี่ยนรหัสผ่าน'}
                </button>
                <button
                  type="button"
                  className="pf-cancel-button"
                  onClick={() => setPasswords({ new: '', confirm: '', visible: false })}
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;