import React from "react";
import { FaSearch, FaBell, FaEnvelope } from "react-icons/fa";
import "./Navbar.css"; // Import CSS riêng cho Navbar

const Navbar = () => {
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
                    <img src="/user.png" alt="User" className="user-avatar" />
                    <span>NV Nhập kho</span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
