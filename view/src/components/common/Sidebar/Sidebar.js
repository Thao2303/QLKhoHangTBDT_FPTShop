import React, { useState } from "react";
import {
    FaHome, FaClipboardList, FaHistory, FaMapMarkedAlt, FaSignOutAlt,
    FaBoxes, FaSearch, FaWarehouse, FaUsers, FaBoxOpen, FaList, FaBars
} from "react-icons/fa";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./Sidebar.css";
import { FaChevronRight } from "react-icons/fa";
import {
    Home, ClipboardList, History, Map, LogOut,
    Boxes, Search, Warehouse, Users, PackageOpen, List, Menu, ChevronRight
} from "lucide-react";
import {
    HiOutlineDocumentAdd,
    HiArrowDownTray,
    HiArrowUpTray,
    HiMap,
    HiUsers,
    HiOutlineClipboardDocument,
    HiOutlineBuildingStorefront,
    HiOutlineBuildingLibrary,
    HiOutlineMapPin,
    HiArchiveBox,
    HiCube,
    HiOutlineArrowLeftOnRectangle
} from "react-icons/hi2";

import {
    LuLayoutDashboard,
    LuPackageOpen,
    LuListTodo,
    LuBoxes
} from "react-icons/lu";

import { FiSearch } from "react-icons/fi";
import { BsListNested } from "react-icons/bs";
import { MdReceiptLong, MdLocationOn } from "react-icons/md";

const MenuItem = ({ to, icon, label, isCollapsed }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
  

    return (
        <li className={`sidebar-item ${isActive ? "active" : ""}`}>
            <Link
                to={to}
                className="menu-link"
                data-tooltip={isCollapsed ? label : ""}
                onClick={(e) => e.stopPropagation()} // ✅ Thêm dòng này
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
                onClick={(e) => {
                    e.stopPropagation(); // ✅ NGĂN CLICK LAN RA
                    setIsOpen(!isOpen);
                }}
                style={{ cursor: "pointer" }}
            >

                <div className="icon">{icon}</div>
                {!isCollapsed && (
                    <>
                        <span className="label" style={{ flex: 1 }}>{label}</span>
                        <FaChevronRight style={{
                            transition: "transform 0.3s ease",
                            transform: isOpen ? "rotate(90deg)" : "rotate(0deg)"
                        }} />

                    </>
                )}
            </div>
            {!isCollapsed && isOpen && (
                <ul className="sidebar-submenu">
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
    const [openMenus, setOpenMenus] = useState({});
    const toggleMenu = (label) => {
        setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
    };
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
                            <MenuItemWithSub icon={<LuLayoutDashboard />} label="Dashboard" isCollapsed={isCollapsed}>
                                <MenuItem to="/dashboard-phieu-nhap" icon={<HiArrowDownTray />} label="Phiếu nhập" isCollapsed={isCollapsed} />
                                <MenuItem to="/dashboard-phieu-xuat" icon={<LuPackageOpen />} label="Phiếu xuất" isCollapsed={isCollapsed} />
                                <MenuItem to="/dashboard-yeu-cau-xuat-kho" icon={<LuListTodo />} label="Yêu cầu xuất kho" isCollapsed={isCollapsed} />
                                <MenuItem to="/dashboard-san-pham" icon={<LuBoxes />} label="Sản phẩm" isCollapsed={isCollapsed} />
                            </MenuItemWithSub>

                            <MenuItem to="/quanlyphieunhap" icon={<HiArrowDownTray />} label="Quản lý nhập kho" isCollapsed={isCollapsed} />
                            <MenuItem to="/quanlyyeucauxuat" icon={<HiArrowUpTray />} label="Quản lý YC xuất kho" isCollapsed={isCollapsed} />
                            <MenuItem to="/quanlyphieuxuat" icon={<MdReceiptLong />} label="Quản lý phiếu xuất" isCollapsed={isCollapsed} />
                            <MenuItem to="/sodokho" icon={<HiMap />} label="Sơ đồ kho" isCollapsed={isCollapsed} />
                            <MenuItem to="/timkiem" icon={<FiSearch />} label="Tìm kiếm vị trí SP" isCollapsed={isCollapsed} />
                            <MenuItem to="/quan-ly-yeu-cau-kiem-ke" icon={<HiOutlineClipboardDocument />} label="Kiểm kê" isCollapsed={isCollapsed} />
                            <MenuItem to="/quan-ly-ton-kho" icon={<HiArchiveBox />} label="Tồn kho" isCollapsed={isCollapsed} />
                            <MenuItem to="/quan-ly-vi-tri-san-pham" icon={<MdLocationOn />} label="Quản lý vị trí sản phẩm" isCollapsed={isCollapsed} />
                            <MenuItemWithSub icon={<LuLayoutDashboard />} label="Quản lý chung" isCollapsed={isCollapsed}>
                                <MenuItem to="/quan-ly-tai-khoan" icon={<HiUsers />} label="Quản lý tài khoản" isCollapsed={isCollapsed} />
                                <MenuItem to="/quanlyvitri" icon={<HiOutlineMapPin />} label="Quản lý vị trí" isCollapsed={isCollapsed} />
                                <MenuItem to="/quan-ly-ncc" icon={<HiOutlineBuildingStorefront />} label="Quản lý nhà cung cấp" isCollapsed={isCollapsed} />
                                <MenuItem to="/quan-ly-dai-ly" icon={<HiOutlineBuildingLibrary />} label="Quản lý đại lý" isCollapsed={isCollapsed} />
                                <MenuItem to="/quan-ly-san-pham" icon={<HiCube />} label="Quản lý sản phẩm" isCollapsed={isCollapsed} />
                                <MenuItem to="/quan-ly-danh-muc" icon={<BsListNested />} label="Quản lý danh mục SP" isCollapsed={isCollapsed} />
                            </MenuItemWithSub>
                            
                        </>
                    )}

                    {role === "Nhân viên" && (
                        <>
                            <MenuItemWithSub icon={<LuLayoutDashboard />} label="Dashboard" isCollapsed={isCollapsed}>
                                <MenuItem to="/dashboard-phieu-nhap" icon={<HiArrowDownTray />} label="Phiếu nhập" isCollapsed={isCollapsed} />
                                <MenuItem to="/dashboard-phieu-xuat" icon={<LuPackageOpen />} label="Phiếu xuất" isCollapsed={isCollapsed} />
                                <MenuItem to="/dashboard-yeu-cau-xuat-kho" icon={<LuListTodo />} label="Yêu cầu xuất kho" isCollapsed={isCollapsed} />
                                <MenuItem to="/dashboard-san-pham" icon={<LuBoxes />} label="Sản phẩm" isCollapsed={isCollapsed} />
                            </MenuItemWithSub>

                            <MenuItem to="/quanlyphieunhap" icon={<HiArrowDownTray />} label="Quản lý nhập kho" isCollapsed={isCollapsed} />
                            <MenuItem to="/quanlyyeucauxuat" icon={<HiArrowUpTray />} label="Quản lý YC xuất kho" isCollapsed={isCollapsed} />
                            <MenuItem to="/quanlyphieuxuat" icon={<MdReceiptLong />} label="Quản lý phiếu xuất" isCollapsed={isCollapsed} />
                            <MenuItem to="/sodokho" icon={<HiMap />} label="Sơ đồ kho" isCollapsed={isCollapsed} />
                            <MenuItem to="/timkiem" icon={<FiSearch />} label="Tìm kiếm vị trí SP" isCollapsed={isCollapsed} />
                            <MenuItem to="/quan-ly-yeu-cau-kiem-ke" icon={<HiOutlineClipboardDocument />} label="Kiểm kê" isCollapsed={isCollapsed} />
                            <MenuItem to="/quan-ly-ton-kho" icon={<HiArchiveBox />} label="Tồn kho" isCollapsed={isCollapsed} />
                            <MenuItem to="/quan-ly-vi-tri-san-pham" icon={<MdLocationOn />} label="Quản lý vị trí sản phẩm" isCollapsed={isCollapsed} />
                            <MenuItemWithSub icon={<LuLayoutDashboard />} label="Quản lý chung" isCollapsed={isCollapsed}>
                               
                                <MenuItem to="/quanlyvitri" icon={<HiOutlineMapPin />} label="Quản lý vị trí" isCollapsed={isCollapsed} />
                            
                             
                                <MenuItem to="/quan-ly-san-pham" icon={<HiCube />} label="Quản lý sản phẩm" isCollapsed={isCollapsed} />
                                <MenuItem to="/quan-ly-danh-muc" icon={<BsListNested />} label="Quản lý danh mục SP" isCollapsed={isCollapsed} />
                            </MenuItemWithSub>
                        </>
                    )}

                    {role === "Admin" && (
                        <MenuItem to="/quan-ly-tai-khoan" icon={<HiUsers />} label="Quản lý tài khoản" isCollapsed={isCollapsed} />
                    )}

                    {role === "Giám đốc đại lý" && (
                        <>
                            <MenuItem to="/dashboard-yeu-cau-xuat-kho" icon={<LuListTodo />} label="Dashboard" isCollapsed={isCollapsed} />
                            <MenuItem to="/quanlyyeucauxuat" icon={<FaBoxOpen />} label="Quản lý YC xuất kho" isCollapsed={isCollapsed} />
                        </>
                    )}

                    {role === "Đại lý bán hàng" && (
                        <>
                            <MenuItem to="/dashboard-dai-ly" icon={<LuListTodo />} label="Dashboard" isCollapsed={isCollapsed} />
                            <MenuItem to="/quanlyyeucauxuat" icon={<FaBoxOpen />} label="Quản lý YC xuất kho" isCollapsed={isCollapsed} />
                        </>
                    )}
                </ul>

                <button className="logout-button" onClick={handleLogout}>
                    <HiOutlineArrowLeftOnRectangle className="icon" />
                    {!isCollapsed && "Đăng xuất"}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
