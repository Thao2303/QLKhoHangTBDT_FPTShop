import React, { useEffect, useState, useRef } from "react";
import { FaSearch, FaBell, FaEnvelope, FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { connectSignalR, stopSignalR } from '../signalrClient';

const Navbar = () => {
    const [thongBaoList, setThongBaoList] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [filter, setFilter] = useState("tatca");
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const hasConnectedRef = useRef(false);
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user ? user.tenTaiKhoan : "Người dùng";
    const [showUserMenu, setShowUserMenu] = useState(false);

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

      

        const fetchDataAndConnect = async () => {
            try {
                const res = await axios.get(`https://localhost:5288/api/thongbao/nguoi-nhan/${user.idTaiKhoan}`);
                setThongBaoList(res.data);
            } catch (error) {
                console.error("❌ Lỗi lấy thông báo:", error);
            }

            if (!hasConnectedRef.current) {
                connectSignalR((message) => {
                    if (!message || !message.noiDung) return;

                    if (!message.idThongBao) return; // Bỏ qua nếu không có ID thật

                    const newNoti = {
                        idThongBao: message.idThongBao,
                        noiDung: message.noiDung,
                        ngayTao: new Date(message.ngayTao || Date.now()),
                        lienKet: message.lienKet || "",
                        daXem: false
                    };


                    setThongBaoList(prev => {
                        const exists = prev.some(tb => tb.idThongBao === newNoti.idThongBao);
                        if (exists) return prev;
                        const updated = [newNoti, ...prev];
                        return [...updated];  // buộc tạo array mới
                    });
                });
                hasConnectedRef.current = true;
            }
        };

        fetchDataAndConnect();

        return () => {
            stopSignalR();
            hasConnectedRef.current = false;
        };

    }, []);

    const markAsRead = async (idThongBao, noiDung, lienKet) => {
        setThongBaoList(prev =>
            prev.map(tb => tb.idThongBao === idThongBao ? { ...tb, daXem: true } : tb)
        );
        if (idThongBao < 1000000000) {
            await axios.put(`https://localhost:5288/api/thongbao/danh-dau-da-doc/${idThongBao}`).catch(err => console.error(err));
        }

        

        // ⚠️ Ưu tiên dùng liên kết nếu có
        if (lienKet && typeof lienKet === "string") {
            navigate(lienKet);
            return;
        }

        // Trường hợp fallback
        if (typeof noiDung !== "string") return;

        if (noiDung.includes("phiếu nhập")) {
            const match = noiDung.match(/#(\d+)/);
            if (match) {
                navigate("/quanlyphieunhap", {
                    state: { moPopupPhieuNhapId: match[1] }
                });
            } else {
                navigate("/quanlyphieunhap");
            }
        

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
        else if (noiDung.toLowerCase().includes("kiểm kê")) {
            const match = noiDung.match(/#?(\d+)/); // nếu có mã ID
            if (match) {
                navigate("/thuc-hien-kiem-ke/" + match[1]); // hoặc đường dẫn của bạn
            } else {
                navigate("/quan-ly-yeu-cau-kiem-ke"); // fallback nếu không có id
            }
        }

    };


    const markAllAsRead = async () => {
        const ids = thongBaoList.filter(tb => !tb.daXem && tb.idThongBao < 1000000000).map(tb => tb.idThongBao);
        await Promise.all(ids.map(id => axios.put(`https://localhost:5288/api/thongbao/danh-dau-da-doc/${id}`)));
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
                                        onClick={() => markAsRead(tb.idThongBao, tb.noiDung, tb.lienKet)}

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

              
                <div className="user-info" onClick={() => setShowUserMenu(!showUserMenu)}>
                    <span>{username} <span className="arrow">&#9662;</span></span>
                    {showUserMenu && (
                        <div className="user-menu">
                            <button onClick={() => navigate("/doi-mat-khau")}>Đổi mật khẩu</button>
                            <button onClick={() => {
                                localStorage.removeItem("user");
                                navigate("/login");
                            }}>Đăng xuất</button>
                        </div>
                    )}
                </div>

            </div>
        </nav>
    );
};

export default Navbar;
