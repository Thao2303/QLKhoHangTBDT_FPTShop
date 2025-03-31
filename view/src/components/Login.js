import React, { useState } from 'react';
import axios from 'axios';

import "./Login.css";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://localhost:5288/api/TaiKhoan/login', {
                Username: username,
                Password: password
            });

            // Lưu thông tin người dùng và vai trò vào localStorage
            localStorage.setItem('user', JSON.stringify(response.data));

            // Chuyển hướng đến dashboard
            window.location.href = '/dashboard';
        } catch (error) {
            setError('Thông tin đăng nhập không đúng');
        }
    };




    return (
        <div className="login-container">
            <h2>Đăng nhập</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Tên tài khoản</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Nhập tên tài khoản"
                    />
                </div>
                <div>
                    <label>Mật khẩu</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu"
                    />
                </div>
                {error && <p>{error}</p>}
                <button type="submit">Đăng nhập</button>
            </form>
        </div>
    );
};

export default Login;
