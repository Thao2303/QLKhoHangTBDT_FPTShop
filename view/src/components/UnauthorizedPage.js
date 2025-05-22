import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const UnauthorizedPage = () => {
    return (
        <div className="login-container" style={{ textAlign: 'center' }}>
            <h2>🚫 Không có quyền truy cập</h2>
            <p>Bạn không được phép truy cập trang này.</p>
            <Link to="/dashboard">
                <button>Quay lại trang chính</button>
            </Link>
        </div>
    );
};

export default UnauthorizedPage;
