import React from "react";
import { FaSearch, FaBell, FaEnvelope } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
    // Lấy thông tin người dùng từ localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const username = user ? user.tenTaiKhoan : 'Người dùng'; // Nếu không có người dùng, hiển thị 'Người dùng'

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input type="text" placeholder="Tìm kiếm sản phẩm, phiếu nhập,..." />
                </div>
            </div>

            <div className="navbar-right">
                <FaBell className="icon" />
                <FaEnvelope className="icon" />
                <div className="user-info">
                    {/* Hiển thị tên người dùng */}
                    <span>{username}</span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
