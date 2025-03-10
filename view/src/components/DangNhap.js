import React, { useState } from 'react';
import axios from 'axios';

function Login() {
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
            console.log('Đăng nhập thành công:', response.data);
        } catch (error) {
            setError('Thông tin đăng nhập không đúng');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Tên tài khoản</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label>Mật khẩu</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Đăng nhập</button>
            </form>

            {error && <p>{error}</p>}
        </div>
    );
}

export default Login;
