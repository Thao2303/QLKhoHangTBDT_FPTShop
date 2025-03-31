import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import "./Dashboard.css"; // Thêm file CSS mới

const Dashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    if (!user) return null;

    const { role } = user;

    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="dashboard-content">
                <Navbar />
                <div className="main-content">
                    {role === 'Nhân viên' && (
                        <div>
                            <h2>Giao diện cho Nhân viên kho</h2>
                        </div>
                    )}

                    {role === 'Thủ kho' && (
                        <div>
                            <h2>Giao diện cho Thủ kho</h2>
                        </div>
                    )}

                    {role === 'Admin' && (
                        <div>
                            <h2>Giao diện cho Admin</h2>
                        </div>
                    )}

                    {role === 'Đại lý bán hàng' && (
                        <div>
                            <h2>Giao diện cho Đại lý bán hàng</h2>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
