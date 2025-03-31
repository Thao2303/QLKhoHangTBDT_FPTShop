import React from "react";
import { FaHome, FaClipboardList, FaHistory, FaMapMarkedAlt, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'; // Thêm import useNavigate
import "./Sidebar.css";
import { Link } from "react-router-dom";
import { Route } from 'react-router-dom';


const Sidebar = () => {
    const user = JSON.parse(localStorage.getItem('user'));  // Lấy thông tin người dùng từ localStorage
    const role = user ? user.tenChucVu : '';  // Lấy vai trò của người dùng từ tenChucVu
    const navigate = useNavigate();  // Khởi tạo useNavigate

    // Hàm xử lý đăng xuất
    const handleLogout = () => {
        localStorage.removeItem('user');  // Xóa dữ liệu người dùng trong localStorage
        navigate('/login');  // Chuyển hướng về trang login
    };

    return (
        <div className="sidebar">
            <div className="logo-container">
                <img src="/img/logo-fpt-shop.png" alt="Logo" className="sidebar-logo" />
            </div>
            <ul>
                {role === 'Nhân viên kho' && (
                    <>
                        <li>Dashboard</li>
                        <li><Link to="/quanlyphieunhap">Quản lý phiếu nhập kho</Link></li>
                        <li><Link to="/quan-ly-tai-khoan">Quản lý tk kho</Link></li>
                        <li>Quản lý xuất kho</li>
                        <li>Lịch sử nhập kho</li>
                        <li>Lịch sử xuất kho</li>
                        <li>Vị trí trống trong kho</li>
                        <li>Sơ đồ kho</li>
                        <li>Tìm kiếm vị trí hàng hóa</li>
                        <li>Kiểm kê hàng hóa</li>
                    </>
                )}

                {role === 'Admin' && <li>Quản lý tài khoản người dùng</li>}
                {role === 'Nhà cung cấp' && <li>Quản lý</li>}
                {role === 'Đại lý bán hàng' && <li>Quản lý</li>}
                {role === 'Thủ kho' && (
                    <>
                        <li>Dashboard</li>
                        <li><Link to="/quanlyphieunhap">Quản lý phiếu nhập kho</Link></li>

                        <li>Quản lý xuất kho</li>
                        <li>Lịch sử nhập kho</li>
                        <li>Lịch sử xuất kho</li>
                        <li><Link to="/quan-ly-tai-khoan">Quản lý tk</Link></li>
                       

                        <li>Sơ đồ kho</li>
                        <li>Tìm kiếm vị trí hàng hóa</li>
                        <li>Kiểm kê hàng hóa</li>
                        <li>Quản lý NCC</li>
                        <li>Quản lý đại lý</li>
                        <li>Quản lý sản phẩm</li>
                        <li>Quản lý danh mục</li>
                        <li>Quản lý vị trí kho</li>
                    </>
                )}

                {/* Các mục khác cho các vai trò khác */}
            </ul>
            <button className="logout-button" onClick={handleLogout}>
                <FaSignOutAlt className="icon" /> Đăng xuất
            </button>
        </div>
    );
};

export default Sidebar;
