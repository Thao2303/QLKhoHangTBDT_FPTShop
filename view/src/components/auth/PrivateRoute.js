import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.tenChucVu)) {
        return <Navigate to="/unauthorized" />; // hoặc trang báo lỗi quyền truy cập
    }

    return children;
};

export default PrivateRoute;
