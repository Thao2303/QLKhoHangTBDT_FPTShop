import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./Login.css";
import { Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            window.location.href = "/dashboard";
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axios.post('https://localhost:5288/api/TaiKhoan/login', {
                Username: username,
                Password: password
            });

            const userData = response.data;

            if (!userData) {
                setError("Tài khoản không hợp lệ.");
                setLoading(false);
                return;
            }

            localStorage.setItem('user', JSON.stringify(userData));

            if (userData.doiMatKhau) {
                window.location.href = "/doi-mat-khau";
            } else {
                window.location.href = "/dashboard";
            }

        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError(err.response.data);
            } else {
                setError("Lỗi khi đăng nhập. Vui lòng thử lại sau.");
            }
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
                    <img src="/img/logo-fpt-shop.png" alt="FPT Shop" style={{ width: 200, marginBottom: 10 }} />
                    <h2>Đăng nhập hệ thống</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Tên tài khoản</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Nhập tên tài khoản"
                            required
                        />
                    </div>

                    <div>
                        <label>Mật khẩu</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Nhập mật khẩu"
                                required
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="toggle-password"
                            >
                                {showPassword ? "👁️" : "👁️‍🗨️"}
                            </span>
                        </div>
                    </div>

                    <div className="forgot-password">
                        <Link to="/forgot-password">🔑 Quên mật khẩu?</Link>
                    </div>

                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button type="submit" disabled={loading}>
                        {loading ? "Đang xử lý..." : "Đăng nhập"}
                    </button>
                </form>
            </div>
        </div>
    );


};

export default Login;
