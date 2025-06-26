// ForgotPassword.js
import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { Link } from 'react-router-dom';
const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);
        try {
            const res = await axios.post(
                'https://localhost:5288/api/TaiKhoan/yeu-cau-reset-mat-khau',
                email,
                { headers: { 'Content-Type': 'application/json' } }
            );
            setMessage(res.data.message);
        } catch (err) {
            setMessage('❌ Email không hợp lệ hoặc không tồn tại');
        } finally {
            setLoading(false);
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
                    <img src="/img/logo-fpt-shop.png" alt="FPT Shop" style={{ width: 200, marginBottom: 20 }} />
                    <h2>Quên mật khẩu</h2>
                </div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email đã đăng ký</label>
                    <input
                        type="email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <button type="submit" disabled={loading}>{loading ? 'Đang xử lý...' : 'Lấy lại mật khẩu'}</button>
                    {message && <p style={{ marginTop: 12 }}>{message}</p>}
                    <div className="forgot-password" style={{  marginTop: 20 }}>
                        <Link to="/login">Quay lại trang đăng nhập</Link>
                    </div>
            </form>
            </div>
        </div>
    );
};

export default ForgotPassword;