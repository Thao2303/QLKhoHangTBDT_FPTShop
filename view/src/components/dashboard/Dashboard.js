import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar/Navbar";
import Sidebar from "../common/Sidebar/Sidebar";

import "./Dashboard.css"; // File CSS riêng

const Dashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    if (!user) return null;

    const { role, tenTaiKhoan } = user;

    const renderContent = () => {
        switch (role) {
            case "Nhân viên":
                return <h2>👷 Xin chào Nhân viên kho {tenTaiKhoan}!</h2>;
            case "Thủ kho":
                return <h2>📦 Xin chào Thủ kho {tenTaiKhoan}!</h2>;
            case "Admin":
                return <h2>🛠️ Giao diện dành cho Admin hệ thống</h2>;
            case "Đại lý bán hàng":
                return <h2>🏪 Xin chào Đại lý bán hàng {tenTaiKhoan}!</h2>;
            case "Giám đốc đại lý":
                return <h2>📊 Xin chào Giám đốc đại lý {tenTaiKhoan}!</h2>;
            default:
                return <h2>👤 Chào mừng bạn đến với website quản lý kho tại FPT Shop!</h2>;
        }
    };

    return (
        <div className="dashboard-container" style={{
            backgroundImage: `url(${process.env.PUBLIC_URL + "/img/background-login.webp"})`,
           
        }}>
            <Sidebar />
            <div className="dashboard-content">
                <Navbar />
                <div className="main-content">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
