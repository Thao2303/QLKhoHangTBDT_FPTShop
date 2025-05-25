// ✅ FormTaiKhoan.js - Popup chỉnh sửa tài khoản (dùng tenTaiKhoan thay hoTen, fix lỗi API)
import React, { useState, useEffect } from 'react';
import './account-style.css';

const FormTaiKhoan = ({ visible, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        tenTaiKhoan: '',
        email: '',
        matKhau: '',
        idChucVu: '',
        ngayCap: ''
    });

    const [chucVus, setChucVus] = useState([]);

    useEffect(() => {
        fetch("https://qlkhohangtbdt-fptshop-be2.onrender.com/api/chucvu")
            .then((res) => res.json())
            .then((data) => setChucVus(data))
            .catch((err) => console.error("Lỗi lấy chức vụ:", err));
    }, []);

    useEffect(() => {
        if (initialData) {
            setFormData({
                tenTaiKhoan: initialData.tenTaiKhoan || '',
                email: initialData.email || '',
                matKhau: '',
                idChucVu: initialData.idChucVu || '',
                ngayCap: (initialData.ngayCap || '').split("T")[0]
            });
        } else {
            setFormData({
                tenTaiKhoan: '',
                email: '',
                matKhau: '',
                idChucVu: '',
                ngayCap: new Date().toISOString().split("T")[0]
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = {
            ...formData,
            trangThai: true,
            ngayCap: new Date(formData.ngayCap).toISOString().split("T")[0]
        };

        try {
            const response = await fetch(`https://qlkhohangtbdt-fptshop-be2.onrender.com/api/taikhoan${initialData ? '/' + initialData.id : ''}`, {
                method: initialData ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!response.ok) throw new Error('Lỗi khi gửi dữ liệu');
            onSubmit(body);
        } catch (err) {
            alert('Lỗi khi lưu tài khoản');
            console.error(err);
        }
    };

    if (!visible) return null;

    return (
        <div className="popup-overlay">
            <form className="popup-box" onSubmit={handleSubmit}>
                <h2 className="popup-title">{initialData ? 'Chỉnh sửa' : 'Thêm'} tài khoản</h2>

                <label>Tên tài khoản</label>
                <input className="input" name="tenTaiKhoan" value={formData.tenTaiKhoan} onChange={handleChange} required />

                <label>Email</label>
                <input className="input" name="email" type="email" value={formData.email} onChange={handleChange} required />

                {!initialData && (
                    <>
                        <label>Mật khẩu</label>
                        <input className="input" name="matKhau" type="password" value={formData.matKhau} onChange={handleChange} required />
                    </>
                )}

                <label>Chức vụ</label>
                <select className="input" name="idChucVu" value={formData.idChucVu} onChange={handleChange} required>
                    <option value="">-- Chọn chức vụ --</option>
                    {chucVus.map((cv) => (
                        <option key={cv.idChucVu} value={cv.idChucVu}>{cv.tenChucVu}</option>
                    ))}
                </select>

                <label>Ngày cấp</label>
                <input className="input" name="ngayCap" type="date" value={formData.ngayCap} onChange={handleChange} required />

                <div className="popup-actions">
                    <button type="button" className="btn btn-cancel" onClick={onClose}>Huỷ</button>
                    <button type="submit" className="btn btn-primary">Lưu</button>
                </div>
            </form>
        </div>
    );
};

export default FormTaiKhoan;