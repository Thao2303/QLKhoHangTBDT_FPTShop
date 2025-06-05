// ✅ ChiTietTaiKhoan.js - Popup hiển thị thông tin tài khoản
import React from 'react';
import './account-style.css';

const ChiTietTaiKhoan = ({ visible, onClose, data }) => {
    if (!visible || !data) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-box">
                <h2 className="popup-title">Thông tin tài khoản</h2>
                <p><strong>Họ tên:</strong> {data.hoTen}</p>
                <p><strong>Email:</strong> {data.email}</p>
                <p><strong>Chức vụ:</strong> {data.chucVu}</p>
                <p><strong>Ngày cấp:</strong> {data.ngayCap}</p>

                <div className="popup-actions" style={{ textAlign: 'right' }}>
                    <button className="btn btn-cancel" onClick={onClose}>Đóng</button>
                </div>
            </div>
        </div>
    );
};

export default ChiTietTaiKhoan;