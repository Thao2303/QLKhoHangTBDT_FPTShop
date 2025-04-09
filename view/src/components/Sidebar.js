import React, { useState } from "react";
import {
    FaHome, FaClipboardList, FaHistory, FaMapMarkedAlt, FaSignOutAlt,
    FaBoxes, FaSearch, FaWarehouse, FaUsers, FaBoxOpen, FaList, FaBars
} from "react-icons/fa";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./Sidebar.css";

const MenuItem = ({ to, icon, label, isCollapsed }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <li className={`sidebar-item ${isActive ? "active" : ""}`}>
            <Link
                to={to}
                className="menu-link"
                data-tooltip={isCollapsed ? label : ""}
            >
                <div className="icon">{icon}</div>
                {!isCollapsed && <span className="label">{label}</span>}
            </Link>
        </li>
    );
};

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user ? user.tenChucVu : "";
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    return (
        <div className={`sidebar-wrapper ${isCollapsed ? "collapsed" : ""}`}>
            <div className="sidebar">
                <div className="top-section">
                    <div className="logo">
                        <img
                            src="/img/logo-fpt-shop.png"
                            alt="Logo"
                            className={`sidebar-logo ${isCollapsed ? "collapsed" : ""}`}
                        />
                    </div>
                    <button className="toggle-btn" onClick={toggleSidebar}>
                        <FaBars />
                    </button>
                </div>

                <ul className="sidebar-menu">
                    {role === "Thủ kho" && (
                        <>
                            <MenuItem to="/dashboard" icon={<FaHome />} label="Dashboard" isCollapsed={isCollapsed} />
                            <MenuItem to="/quanlyphieunhap" icon={<FaClipboardList />} label="Phiếu nhập" isCollapsed={isCollapsed} />
                            <MenuItem to="/xuatkho" icon={<FaBoxOpen />} label="Xuất kho" isCollapsed={isCollapsed} />
                            <MenuItem to="/lichsunhap" icon={<FaHistory />} label="Lịch sử nhập" isCollapsed={isCollapsed} />
                            <MenuItem to="/lichsuxuat" icon={<FaHistory />} label="Lịch sử xuất" isCollapsed={isCollapsed} />
                            <MenuItem to="/quan-ly-tai-khoan" icon={<FaUsers />} label="Tài khoản" isCollapsed={isCollapsed} />
                            <MenuItem to="/quanlyvitri" icon={<FaBoxes />} label="Vị trí hàng" isCollapsed={isCollapsed} />
                            <MenuItem to="/sodokho" icon={<FaMapMarkedAlt />} label="Sơ đồ kho" isCollapsed={isCollapsed} />
                            <MenuItem to="/timkiem" icon={<FaSearch />} label="Tìm kiếm" isCollapsed={isCollapsed} />
                            <MenuItem to="/kiemke" icon={<FaWarehouse />} label="Kiểm kê" isCollapsed={isCollapsed} />
                            <MenuItem to="/quanlyncc" icon={<FaUsers />} label="Nhà cung cấp" isCollapsed={isCollapsed} />
                            <MenuItem to="/quanlydaily" icon={<FaUsers />} label="Đại lý" isCollapsed={isCollapsed} />
                            <MenuItem to="/quanlysanpham" icon={<FaBoxOpen />} label="Sản phẩm" isCollapsed={isCollapsed} />
                            <MenuItem to="/quanlydanhmuc" icon={<FaList />} label="Danh mục" isCollapsed={isCollapsed} />
                            <MenuItem to="/quanlyvitri-kho" icon={<FaWarehouse />} label="Vị trí kho" isCollapsed={isCollapsed} />
                        </>
                    )}

                    {role === "Nhân viên kho" && (
                        <>
                            <MenuItem to="/dashboard" icon={<FaHome />} label="Dashboard" isCollapsed={isCollapsed} />
                            <MenuItem to="/quanlyphieunhap" icon={<FaClipboardList />} label="Phiếu nhập" isCollapsed={isCollapsed} />
                            <MenuItem to="/quan-ly-tai-khoan" icon={<FaUsers />} label="Tài khoản kho" isCollapsed={isCollapsed} />
                            <MenuItem to="/xuatkho" icon={<FaBoxOpen />} label="Xuất kho" isCollapsed={isCollapsed} />
                            <MenuItem to="/lichsunhap" icon={<FaHistory />} label="Lịch sử nhập" isCollapsed={isCollapsed} />
                            <MenuItem to="/lichsuxuat" icon={<FaHistory />} label="Lịch sử xuất" isCollapsed={isCollapsed} />
                            <MenuItem to="/vitritrong" icon={<FaBoxes />} label="Vị trí trống" isCollapsed={isCollapsed} />
                            <MenuItem to="/sodokho" icon={<FaMapMarkedAlt />} label="Sơ đồ kho" isCollapsed={isCollapsed} />
                            <MenuItem to="/timkiem" icon={<FaSearch />} label="Tìm kiếm" isCollapsed={isCollapsed} />
                            <MenuItem to="/kiemke" icon={<FaWarehouse />} label="Kiểm kê" isCollapsed={isCollapsed} />
                        </>
                    )}

                    {role === "Admin" && (
                        <MenuItem to="/admin/quanlytaikhoan" icon={<FaUsers />} label="QL tài khoản" isCollapsed={isCollapsed} />
                    )}

                    {role === "Nhà cung cấp" && (
                        <MenuItem to="/ncc/quanly" icon={<FaClipboardList />} label="Quản lý NCC" isCollapsed={isCollapsed} />
                    )}

                    {role === "Đại lý bán hàng" && (
                        <MenuItem to="/daily/quanly" icon={<FaClipboardList />} label="Quản lý đại lý" isCollapsed={isCollapsed} />
                    )}
                </ul>

                <button className="logout-button" onClick={handleLogout}>
                    <FaSignOutAlt className="icon" />
                    {!isCollapsed && "Đăng xuất"}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
