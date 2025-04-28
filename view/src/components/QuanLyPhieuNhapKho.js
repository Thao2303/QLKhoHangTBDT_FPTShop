// 📁 QuanLyPhieuNhapKho.js
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar.js"
import Sidebar from "./Sidebar.js";
import "./FormTaoPhieuNhap.css";

const removeVietnameseTones = (str) => {
    return str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
};

const QuanLyPhieuNhapKho = () => {
    const [phieuNhaps, setPhieuNhaps] = useState([]);
    const [searchMaPhieu, setSearchMaPhieu] = useState("");
    const [selectedNhaCungCap, setSelectedNhaCungCap] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [popupData, setPopupData] = useState(null);
    const [chiTietSanPham, setChiTietSanPham] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const API_BASE_URL = "https://localhost:5288/api";
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const isThuKho = user?.tenChucVu === "Thủ kho";

    useEffect(() => {
        fetch(`${API_BASE_URL}/phieunhap`)
            .then((res) => res.json())
            .then((data) => setPhieuNhaps(data))
            .catch((error) => console.error("Lỗi lấy dữ liệu:", error));
    }, []);

    const resetSearch = () => {
        setSearchMaPhieu("");
        setSelectedNhaCungCap("");
        setFilterStatus("");
        setFromDate("");
        setToDate("");
    };

    const handleEdit = (id) => navigate(`/sua-phieu-nhap/${id}`);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xoá phiếu nhập này?");
        if (!confirmDelete) return;

        try {
            await fetch(`${API_BASE_URL}/phieunhap/${id}`, { method: 'DELETE' });
            setPhieuNhaps(prev => prev.filter(p => p.idPhieuNhap !== id));
            alert("✅ Đã xoá thành công!");
        } catch (error) {
            console.error("Lỗi khi xoá phiếu nhập:", error);
            alert("❌ Xoá thất bại!");
        }
    };

    const handleDuyet = async (id) => {
        const xacNhan = window.confirm("Bạn có chắc muốn duyệt phiếu này?");
        if (!xacNhan) return;

        try {
            await fetch(`${API_BASE_URL}/phieunhap/duyet/${id}`, { method: "PUT" });
            alert("✅ Đã duyệt!");
            const res = await fetch(`${API_BASE_URL}/phieunhap`);
            const data = await res.json();
            setPhieuNhaps(data);
        } catch (error) {
            alert("❌ Duyệt thất bại!");
        }
    };

    const filteredPhieuNhaps = phieuNhaps.filter((phieu) => {
        const matchMa = phieu.idPhieuNhap.toString().includes(searchMaPhieu);
        const matchNCC = selectedNhaCungCap
            ? removeVietnameseTones(phieu.nhaCungCap?.tenNhaCungCap || "").includes(removeVietnameseTones(selectedNhaCungCap))
            : true;
        const matchStatus = filterStatus ? phieu.trangThai.toString() === filterStatus : true;
        const matchDate =
            (!fromDate || new Date(phieu.ngayNhap) >= new Date(fromDate)) &&
            (!toDate || new Date(phieu.ngayNhap) <= new Date(toDate));

        return matchMa && matchNCC && matchStatus && matchDate;
    });

    const totalPages = Math.ceil(filteredPhieuNhaps.length / itemsPerPage);
    const paginatedData = filteredPhieuNhaps.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePopup = async (phieu) => {
        const res = await fetch(`${API_BASE_URL}/phieunhap/chitiet/${phieu.idPhieuNhap}`);
        const data = await res.json();
        setChiTietSanPham(data);
        setPopupData(phieu);
    };

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <div className="main-layout">
                    <Navbar />
                    <div className="container">
                        <h1 className="title">Quản lý phiếu nhập kho</h1>

                        <div className="search-form">
                            <input type="text" placeholder="Mã phiếu" value={searchMaPhieu} onChange={(e) => setSearchMaPhieu(e.target.value)} className="search-input" />
                            <input type="text" placeholder="Nhà cung cấp" value={selectedNhaCungCap} onChange={(e) => setSelectedNhaCungCap(e.target.value)} className="search-input" />
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
                                <option value="">-- Trạng thái --</option>
                                <option value="1">Chờ duyệt</option>
                                <option value="2">Đã duyệt</option>
                                <option value="3">Từ chối</option>
                                <option value="4">Hoàn hàng</option>
                            </select>
                            <div className="date-group">
                                <label>Từ ngày:</label>
                                <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="date-input" />
                            </div>
                            <div className="date-group">
                                <label>Đến ngày:</label>
                                <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="date-input" />
                            </div>
                            <button className="search-button">🔍 Tìm kiếm</button>
                            <button className="reset-button" onClick={resetSearch}>🗑 Reset</button>
                        </div>

                        <button className="add-button" onClick={() => navigate("/them-phieu-nhap")}>+ Tạo phiếu nhập kho</button>

                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mã phiếu</th>
                                    <th>Nhà cung cấp</th>
                                    <th>Thời gian</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map((phieu, index) => (
                                    <tr key={phieu.idPhieuNhap}>
                                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        <td>{phieu.idPhieuNhap}</td>
                                        <td>{phieu.nhaCungCap?.tenNhaCungCap}</td>
                                        <td>{new Date(phieu.ngayNhap).toLocaleString()}</td>
                                        <td>{phieu.trangThai === 1 ? "⏳ Chờ duyệt" :
                                            phieu.trangThai === 2 ? "✅ Đã duyệt" :
                                                phieu.trangThai === 3 ? "❌ Từ chối" :
                                                    "↩️ Hoàn hàng"}</td>
                                        <td>
                                            <button onClick={() => handlePopup(phieu)}>🔍</button>
                                            <button className="edit-btn" onClick={() => handleEdit(phieu.idPhieuNhap)}>✏️</button>
                                            <button className="delete-btn" onClick={() => handleDelete(phieu.idPhieuNhap)}>🗑</button>
                                            {isThuKho && phieu.trangThai === 1 && (
                                                <button className="approve-btn" onClick={() => handleDuyet(phieu.idPhieuNhap)}>✔️ Duyệt</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="pagination">
                            {[...Array(totalPages).keys()].map(n => (
                                <button
                                    key={n}
                                    className={n + 1 === currentPage ? "active-page" : ""}
                                    onClick={() => setCurrentPage(n + 1)}>{n + 1}</button>
                            ))}
                        </div>

                        {popupData && (
                            <div className="popup">
                                <div className="popup-inner" style={{ maxWidth: "90vw", overflowX: "auto" }}>
                                    <h3>Chi tiết phiếu nhập #{popupData.idPhieuNhap}</h3>
                                    <p><strong>Nhà cung cấp:</strong> {popupData.nhaCungCap?.tenNhaCungCap}</p>
                                    <p><strong>Người tạo:</strong> {popupData.nguoiTao || 'Không rõ'}</p>
                                    <p><strong>Ngày nhập:</strong> {new Date(popupData.ngayNhap).toLocaleString()}</p>
                                    <p><strong>Ghi chú:</strong> {popupData.ghiChu || 'Không có'}</p>
                                    <p><strong>Trạng thái:</strong> {popupData.trangThai === 1 ? 'Chờ duyệt' : popupData.trangThai === 2 ? 'Đã duyệt' : 'Khác'}</p>
                                    <h4>Danh sách sản phẩm:</h4>
                                    <div style={{ overflowX: "auto" }}>
                                        <table className="sub-table">
                                            <thead>
                                                <tr>
                                                    <th>Sản phẩm</th>
                                                    <th>Số lượng chứng từ</th>
                                                    <th>Số lượng thực nhập</th>
                                                    <th>Đơn giá</th>
                                                    <th>Thành tiền</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {chiTietSanPham.map((ct, idx) => (
                                                    <tr key={idx}>
                                                        <td>{ct.sanPham?.tenSanPham}</td>
                                                        <td>{ct.soLuongTheoChungTu}</td>
                                                        <td>{ct.soLuongThucNhap}</td>
                                                        <td>{ct.donGia !== undefined ? Number(ct.donGia).toLocaleString() : 0}</td>
                                                        <td>{ct.tongTien !== undefined ? Number(ct.tongTien).toLocaleString() : 0}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <button onClick={() => setPopupData(null)} className="close-btn">Đóng</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuanLyPhieuNhapKho;