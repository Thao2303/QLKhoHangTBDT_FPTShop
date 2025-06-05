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

const MenuItemWithSub = ({ icon, label, children, isCollapsed }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <li className="sidebar-item">
            <div
                className="menu-link"
                data-tooltip={isCollapsed ? label : ""}
                onClick={() => setIsOpen(!isOpen)}
                style={{ cursor: "pointer" }}
            >
                <div className="icon">{icon}</div>
                {!isCollapsed && (
                    <>
                        <span className="label" style={{ flex: 1 }}>{label}</span>
                       <span style={{
    display: "inline-block",
    transition: "transform 0.3s ease",
    transform: isOpen ? "rotate(90deg)" : "rotate(0deg)"
}}>

                            ▶
                        </span>
                    </>
                )}
            </div>
            {!isCollapsed && isOpen && (
                <ul style={{ paddingLeft: 0 }}>
                    {children}
                </ul>
            )}
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
                            <MenuItemWithSub icon={<FaHome />} label="Dashboard" isCollapsed={isCollapsed}>
                                <MenuItem to="/dashboard-phieu-nhap" icon={<FaClipboardList />} label="Phiếu nhập" isCollapsed={isCollapsed} />
                                <MenuItem to="/dashboard-phieu-xuat" icon={<FaBoxOpen />} label="Phiếu xuất" isCollapsed={isCollapsed} />
                                <MenuItem to="/dashboard-yeu-cau-xuat-kho" icon={<FaList />} label="Yêu cầu xuất kho" isCollapsed={isCollapsed} />
                                <MenuItem to="/dashboard-san-pham" icon={<FaWarehouse />} label="Sản phẩm" isCollapsed={isCollapsed} />
                            </MenuItemWithSub>

                            <MenuItem to="/quanlyphieunhap" icon={<FaClipboardList />} label="Quản lý nhập kho" isCollapsed={isCollapsed} />
                            <MenuItem to="/quanlyyeucauxuat" icon={<FaClipboardList />} label="Quản lý YC xuất kho" isCollapsed={isCollapsed} />
                            <MenuItem to="/quanlyphieuxuat" icon={<FaBoxOpen />} label="Quản lý phiếu xuất" isCollapsed={isCollapsed} />
                            <MenuItem to="/sodokho" icon={<FaMapMarkedAlt />} label="Sơ đồ kho" isCollapsed={isCollapsed} />
                            <MenuItem to="/timkiem" icon={<FaSearch />} label="Tìm kiếm vị trí SP" isCollapsed={isCollapsed} />
                            <MenuItem to="/quan-ly-yeu-cau-kiem-ke" icon={<FaClipboardList />} label="Quản lý kiểm kê" isCollapsed={isCollapsed} />
                            <MenuItem to="/quan-ly-ton-kho" icon={<FaWarehouse />} label="Tồn kho" isCollapsed={isCollapsed} />
                            <MenuItem to="/quan-ly-vi-tri-san-pham" icon={<FaWarehouse />} label="Quản lý vị trí sản phẩm" isCollapsed={isCollapsed} />
                            <MenuItem to="/quan-ly-tai-khoan" icon={<FaUsers />} label="Quản lý tài khoản" isCollapsed={isCollapsed} />
                            <MenuItem to="/quanlyvitri" icon={<FaBoxes />} label="Quản lý vị trí" isCollapsed={isCollapsed} />
                            <MenuItem to="/quan-ly-ncc" icon={<FaUsers />} label="Quản lý nhà cung cấp" isCollapsed={isCollapsed} />
                            <MenuItem to="/quan-ly-dai-ly" icon={<FaUsers />} label="Quản lý đại lý" isCollapsed={isCollapsed} />
                            <MenuItem to="/quan-ly-san-pham" icon={<FaBoxOpen />} label="Quản lý sản phẩm" isCollapsed={isCollapsed} />
                            <MenuItem to="/quan-ly-danh-muc" icon={<FaList />} label="Quản lý danh mục SP" isCollapsed={isCollapsed} />
                        </>
                    )}

                    {role === "Nhân viên" && (
                        <>
                            <MenuItem to="/dashboard" icon={<FaHome />} label="Dashboard" isCollapsed={isCollapsed} />
                            <MenuItem to="/quanlyphieunhap" icon={<FaClipboardList />} label="Phiếu nhập" isCollapsed={isCollapsed} />
                            <MenuItem to="/quanlyyeucauxuat" icon={<FaBoxOpen />} label="Quản lý phiếu xuất" isCollapsed={isCollapsed} />
                            <MenuItem to="/lichsunhap" icon={<FaHistory />} label="Lịch sử nhập" isCollapsed={isCollapsed} />
                            <MenuItem to="/lichsuxuat" icon={<FaHistory />} label="Lịch sử xuất" isCollapsed={isCollapsed} />
                            <MenuItem to="/vitritrong" icon={<FaBoxes />} label="Vị trí trống" isCollapsed={isCollapsed} />
                            <MenuItem to="/sodokho" icon={<FaMapMarkedAlt />} label="Sơ đồ kho" isCollapsed={isCollapsed} />
                            <MenuItem to="/timkiem" icon={<FaSearch />} label="Tìm kiếm" isCollapsed={isCollapsed} />
                            <MenuItem to="/quan-ly-yeu-cau-kiem-ke" icon={<FaClipboardList />} label="Quản lý kiểm kê" isCollapsed={isCollapsed} />
                        </>
                    )}

                    {role === "Admin" && (
                        <MenuItem to="/admin/quanlytaikhoan" icon={<FaUsers />} label="QL tài khoản" isCollapsed={isCollapsed} />
                    )}

                    {role === "Nhà cung cấp" && (
                        <MenuItem to="/ncc/quanly" icon={<FaClipboardList />} label="Quản lý NCC" isCollapsed={isCollapsed} />
                    )}

                    {role === "Đại lý bán hàng" && (
                        <>
                            <MenuItem to="/tao-yeu-cau-xuat-kho" icon={<FaClipboardList />} label="Gửi YC xuất kho" isCollapsed={isCollapsed} />
                            <MenuItem to="/quanlyyeucauxuat" icon={<FaBoxOpen />} label="Quản lý phiếu xuất" isCollapsed={isCollapsed} />
                        </>
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
