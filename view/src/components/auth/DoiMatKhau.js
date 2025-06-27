import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // dùng lại CSS của ResetPassword
import { Link } from 'react-router-dom';
const DoiMatKhauPage = ({ userId }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!oldPassword || !newPassword || !confirmPassword) {
            return setMessage("Vui lòng điền đầy đủ thông tin.");
        }

        if (newPassword !== confirmPassword) {
            return setMessage("Mật khẩu xác nhận không khớp.");
        }

        setSubmitting(true);
        try {
            const res = await axios.post('https://qlkhohangtbdt-fptshop-be2.onrender.com/api/taikhoan/doi-mat-khau', {
                idTaiKhoan: userId,
                oldPassword,
                newPassword
            });
            setMessage("✅ " + res.data);
            const user = JSON.parse(localStorage.getItem("user"));
            if (user) {
                user.doiMatKhau = false;
                localStorage.setItem("user", JSON.stringify(user));
            }
            setTimeout(() => navigate('/dashboard'), 1500);

        } catch (err) {
            setMessage("❌ " + (err.response?.data || 'Lỗi không xác định'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="login-page"
            style={{
                backgroundImage: `url(${process.env.PUBLIC_URL + "/img/background-login.webp"})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <div className="login-container">
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <img src="/img/logo-fpt-shop.png" alt="FPT Shop" style={{ width: 200, marginBottom: 10 }} />
                    <h2>🔒 Đổi mật khẩu</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Mật khẩu cũ</label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Nhập mật khẩu hiện tại"
                            required
                        />
                    </div>
                    <div>
                        <label>Mật khẩu mới</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Nhập mật khẩu mới"
                            required
                        />
                    </div>
                    <div>
                        <label>Xác nhận mật khẩu mới</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Nhập lại mật khẩu mới"
                            required
                        />
                    </div>
                    {message && <p>{message}</p>}
                    <button type="submit" disabled={submitting}>
                        {submitting ? "Đang xử lý..." : "Cập nhật mật khẩu"}
                    </button>
                    <div className="forgot-password" style={{ marginTop: 20 }}>
                        <Link to="/login">Quay lại trang đăng nhập</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DoiMatKhauPage;
