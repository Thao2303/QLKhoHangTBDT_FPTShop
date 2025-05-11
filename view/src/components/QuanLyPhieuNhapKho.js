import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar.js"
import Sidebar from "./Sidebar.js";
import "./FormTaoPhieuNhap.css";
import Pagination from './Pagination';

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

    const getTongThanhTien = () => {
        return chiTietSanPham.reduce((sum, ct) => sum + (Number(ct.tongTien) || 0), 0);
    };

    const handleTuChoi = async (id) => {
        const xacNhan = window.confirm("Bạn có chắc muốn từ chối phiếu này?");
        if (!xacNhan) return;

        try {
            await fetch(`${API_BASE_URL}/phieunhap/tuchoi/${id}`, { method: "PUT" });
            alert("❌ Đã từ chối!");
            const res = await fetch(`${API_BASE_URL}/phieunhap`);
            const data = await res.json();
            setPhieuNhaps(data);
        } catch (error) {
            alert("❌ Từ chối thất bại!");
        }
    };

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <div className="main-layout">
                    <Navbar />
                    <div className="container">
                        <h1 className="title">✉️ Quản lý phiếu nhập kho</h1>

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
                                                phieu.trangThai === 3 ? "❌ Từ chối" : "↩️ Hoàn hàng"}</td>
                                        <td>
                                            <button onClick={() => handlePopup(phieu)}>🔍</button>
                                            {phieu.trangThai === 1 && (
                                                <>
                                                    <button className="edit-btn" onClick={() => handleEdit(phieu.idPhieuNhap)}>✏️</button>
                                                    <button className="delete-btn" onClick={() => handleDelete(phieu.idPhieuNhap)}>🗑</button>
                                                </>
                                            )}
                                            {isThuKho && phieu.trangThai === 1 && (
                                                <>
                                                    <button className="approve-btn" onClick={() => handleDuyet(phieu.idPhieuNhap)}>✔️ Duyệt</button>
                                                    <button className="reject-btn" onClick={() => handleTuChoi(phieu.idPhieuNhap)}>❌ Từ chối</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />

                        {popupData && (
                            <div className="popup">
                                <div className="popup-inner">
                                    <h3>📦 Chi tiết phiếu nhập #{popupData.idPhieuNhap}</h3>
                                

                                    <div className="info-row"><label>🏢 Nhà cung cấp:</label> {popupData.nhaCungCap?.tenNhaCungCap}</div>
                                    <div className="info-row"><label>👤 Người tạo:</label> {popupData.nguoiTao || 'Không rõ'}</div>
                                    <div className="info-row"><label>📅 Ngày nhập:</label> {new Date(popupData.ngayNhap).toLocaleString()}</div>
                                    <div className="info-row"><label>📝 Ghi chú:</label> {popupData.ghiChu || 'Không có'}</div>
                                    <div className="info-row"><label>📌 Trạng thái:</label> {
                                        popupData.trangThai === 1 ? '⏳ Chờ duyệt' :
                                            popupData.trangThai === 2 ? '✅ Đã duyệt' :
                                                popupData.trangThai === 3 ? '❌ Từ chối' : '↩️ Hoàn hàng'
                                    }</div>

                                    <h4 style={{ marginTop: 16 }}>🧾 Danh sách sản phẩm:</h4>
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
                                                        <td style={{ textAlign: 'left' }}>{ct.sanPham?.tenSanPham}</td>
                                                        <td>{ct.soLuongTheoChungTu}</td>
                                                        <td>{ct.soLuongThucNhap}</td>
                                                        <td>{Number(ct.donGia || 0).toLocaleString()}</td>
                                                        <td>{Number(ct.tongTien || 0).toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colSpan="4" style={{ textAlign: 'right', fontWeight: 'bold' }}>Tổng thành tiền:</td>
                                                    <td style={{ fontWeight: 'bold' }}>{getTongThanhTien().toLocaleString()}</td>
                                                </tr>
                                            </tfoot>

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