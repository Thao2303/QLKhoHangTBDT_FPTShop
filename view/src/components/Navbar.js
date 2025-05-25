import React, { useEffect, useState, useRef } from "react";
import { FaSearch, FaBell, FaEnvelope, FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { connectSignalR, stopSignalR } from "./signalrClient";

const Navbar = () => {
    const [thongBaoList, setThongBaoList] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [filter, setFilter] = useState("tatca");
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));
    const username = user ? user.tenTaiKhoan : "Người dùng";

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        if (showDropdown) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showDropdown]);

    useEffect(() => {
        if (!user) return;
        axios.get(`https://qlkhohangtbdt-fptshop-be2.onrender.com/api/thongbao/nguoi-nhan/${user.idTaiKhoan}`)
            .then(res => setThongBaoList(res.data))
            .catch(() => { });

        connectSignalR((message) => {
            const newNoti = {
                idThongBao: message.idThongBao || Date.now(),
                noiDung: message.noiDung || "📭 Không có nội dung",
                ngayTao: new Date(message.ngayTao || Date.now()),
                daXem: false
            };
            setThongBaoList(prev => prev.some(tb => tb.noiDung === newNoti.noiDung) ? prev : [newNoti, ...prev]);
        });
        return () => stopSignalR();
    }, []);

    const markAsRead = async (idThongBao, noiDung) => {
        if (idThongBao < 1000000000) {
            await axios.put(`https://qlkhohangtbdt-fptshop-be2.onrender.com/api/thongbao/danh-dau-da-doc/${idThongBao}`);
        }

        setThongBaoList(prev =>
            prev.map(tb => tb.idThongBao === idThongBao ? { ...tb, daXem: true } : tb)
        );

        if (typeof noiDung !== "string") return;

        if (noiDung.includes("phiếu nhập")) {
            navigate("/quanlyphieunhap");
        } else if (noiDung.includes("phiếu xuất")) {
            navigate("/quanlyphieuxuat");
        } else if (noiDung.includes("tồn kho")) {
            navigate("/quan-ly-ton-kho");
        } else if (noiDung.toLowerCase().includes("yêu cầu xuất kho")) {
            const match = noiDung.match(/#(\d+)/);
            if (match) {
                navigate("/quanlyyeucauxuat", {
                    state: { moPopupYeuCauId: parseInt(match[1]) }
                });
            }
        }
    };

    const markAllAsRead = async () => {
        const ids = thongBaoList.filter(tb => !tb.daXem && tb.idThongBao < 1000000000).map(tb => tb.idThongBao);
        await Promise.all(ids.map(id => axios.put(`https://qlkhohangtbdt-fptshop-be2.onrender.com/api/thongbao/danh-dau-da-doc/${id}`)));
        setThongBaoList(prev => prev.map(tb => ({ ...tb, daXem: true })));
    };

    const getIcon = (text) => {
        if (!text || typeof text !== "string") return <FaBell className="noti-icon" />;
        if (text.includes("⚠️")) return <FaExclamationTriangle className="noti-icon warning" />;
        if (text.includes("✅")) return <FaCheckCircle className="noti-icon success" />;
        if (text.includes("❌")) return <FaTimesCircle className="noti-icon danger" />;
        return <FaBell className="noti-icon" />;
    };

    const unreadCount = thongBaoList.filter(tb => !tb.daXem).length;
    const filtered = thongBaoList.filter(tb => {
        if (filter === "chuadoc") return !tb.daXem;
        if (filter === "canhbao") return tb.noiDung?.includes("⚠️");
        return true;
    });

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input type="text" placeholder="Nhập từ khóa tìm kiếm..." />
                </div>
            </div>

            <div className="navbar-right">
                <div className="notification-wrapper">
                    <div className="icon" onClick={() => setShowDropdown(!showDropdown)} style={{ position: 'relative', cursor: 'pointer' }}>
                        <FaBell />
                        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                    </div>

                    {showDropdown && (
                        <div className="notification-dropdown styled-dropdown" ref={dropdownRef}>
                            <h4>Thông báo</h4>
                            <div className="tab-filter">
                                <button onClick={() => setFilter("tatca")}>Tất cả</button>
                                <button onClick={() => setFilter("chuadoc")}>Chưa đọc</button>
                                <button onClick={() => setFilter("canhbao")}>Cảnh báo ⚠️</button>
                                <button onClick={markAllAsRead}>Đánh dấu tất cả đã đọc</button>
                            </div>
                            {filtered.length === 0 && <p className="no-thongbao">Không có thông báo</p>}
                            <ul className="noti-list">
                                {filtered.map(tb => (
                                    <li
                                        key={tb.idThongBao}
                                        className={`noti-item ${tb.daXem ? "read" : "unread"}`}
                                        onClick={() => markAsRead(tb.idThongBao, tb.noiDung)}
                                    >
                                        <div className="noti-content">
                                            <span className="noti-text">{getIcon(tb.noiDung)} {tb.noiDung}</span>
                                            <small className="noti-time">{new Date(tb.ngayTao).toLocaleString()}</small>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

              
                <div className="user-info">
                    <span>{username}</span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
