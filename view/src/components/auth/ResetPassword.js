import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { Link } from 'react-router-dom';
const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const token = searchParams.get("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!password || !confirmPassword) {
            return setMessage("Vui lòng nhập đầy đủ mật khẩu mới.");
        }

        if (password !== confirmPassword) {
            return setMessage("Mật khẩu xác nhận không khớp.");
        }

        setSubmitting(true);
        try {
            const res = await axios.post('https://qlkhohangtbdt-fptshop-be2.onrender.com/api/taikhoan/dat-lai-mat-khau', {
                token,
                newPassword: password
            });
            setMessage("✅ " + res.data);
        } catch (err) {
            setMessage("❌ " + (err.response?.data || "Lỗi không xác định"));
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
                    <h2>🔐 Đặt lại mật khẩu</h2>
                </div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Mật khẩu mới</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu mới"
                        required
                    />
                </div>
                <div>
                    <label>Xác nhận mật khẩu</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu"
                        required
                    />
                </div>
                {message && <p>{message}</p>}
                    <button type="submit" disabled={submitting}>{submitting ? "Đang xử lý..." : "Cập nhật mật khẩu"}</button>
                    <div className="forgot-password" style={{ marginTop: 20 }}>
                        <Link to="/login">Quay lại trang đăng nhập</Link>
                    </div>
            </form>
            </div>
        </div>
    );
};

export default ResetPassword;