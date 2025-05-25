// 📁 QuanLyYeuCauKiemKe.js
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Pagination from "./Pagination";
import FormYeuCauKiemKePopup from "./FormTaoYeuCauKiemKe";
import "./QuanLyPhieuNhapKho.css";

const QuanLyYeuCauKiemKe = () => {
    const [yeuCaus, setYeuCaus] = useState([]);
    const [popupData, setPopupData] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [editData, setEditData] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [trangThai, setTrangThai] = useState("");
    const [filterTrangThai, setFilterTrangThai] = useState("");

    const navigate = useNavigate();
    const currentUser = (() => {
        const userStr = localStorage.getItem("user");
        if (!userStr) return "";
        try {
            const userObj = JSON.parse(userStr);
            return (userObj.tenTaiKhoan || "").trim().toLowerCase();
        } catch {
            return "";
        }
    })();
    const removeVietnameseTones = (str) => {
        return str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
    };

    const fetchData = () => {
        fetch("https://qlkhohangtbdt-fptshop-be2.onrender.com/api/yeucaukiemke")
            .then(res => res.json())
            .then(data => setYeuCaus(data))
            .catch(() => alert("Lỗi tải dữ liệu"));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = yeuCaus.filter(yc => {
        const matchKeyword = searchKeyword === "" ||
            removeVietnameseTones(yc.mucDich || "").includes(removeVietnameseTones(searchKeyword));

        const matchFrom = !fromDate || new Date(yc.ngayTao) >= new Date(fromDate);
        const matchTo = !toDate || new Date(yc.ngayTao) <= new Date(toDate);
        const matchStatus = filterTrangThai === "" || yc.trangThai?.toString() === filterTrangThai;
        return matchKeyword && matchFrom && matchTo && matchStatus;

    });


    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const openPopup = async (id) => {
        try {
            const res = await fetch(`https://qlkhohangtbdt-fptshop-be2.onrender.com/api/yeucaukiemke/${id}`);
            const data = await res.json();
            setPopupData(data);
        } catch {
            alert("Không thể tải chi tiết yêu cầu kiểm kê.");
        }
    };

    const deleteYeuCau = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xoá yêu cầu này?")) return;
        try {
            await fetch(`https://qlkhohangtbdt-fptshop-be2.onrender.com/api/yeucaukiemke/${id}`, { method: "DELETE" });
            alert("🗑 Đã xoá yêu cầu.");
            fetchData();
        } catch {
            alert("❌ Lỗi khi xoá yêu cầu.");
        }
    };

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <Navbar />
                <div className="container">
                    <h1 className="title">📋 Quản lý yêu cầu kiểm kê</h1>

                    <div className="search-form">
                        <input className="search-input" placeholder="Tìm theo mục đích..." value={searchKeyword} onChange={e => setSearchKeyword(e.target.value)} />
                        <select value={filterTrangThai} onChange={(e) => setFilterTrangThai(e.target.value)} className="filter-select">
                            <option value="">-- Trạng thái --</option>
                            <option value="0">⏳ Chưa thực hiện</option>
                            <option value="1">✅ Đã kiểm</option>
                            <option value="2">⚠️ Có lệch</option>
                            <option value="3">📦 Đã xử lý</option>
                        </select>



                        <div className="date-group">
                            <label>Từ ngày:</label>
                            <input type="date" className="date-input" value={fromDate} onChange={e => setFromDate(e.target.value)} />
                        </div>
                        <div className="date-group">
                            <label>Đến ngày:</label>
                            <input type="date" className="date-input" value={toDate} onChange={e => setToDate(e.target.value)} />
                        </div>
                        <button className="search-button">🔍 Tìm kiếm</button>
                        <button className="reset-button" onClick={() => {
                            setSearchKeyword("");
                            setFromDate("");
                            setToDate("");
                            setFilterTrangThai(""); // ✅ reset thêm lọc trạng thái
                        }}
>🗑 Reset</button>
                    </div>

                    <button className="add-button" onClick={() => { setShowPopup(true); setEditData(null); }}>+ Tạo yêu cầu kiểm kê</button>
                    <p style={{ marginTop: 10 }}>
                        🔍 Tổng kết quả: <strong>{filteredData.length}</strong>
                    </p>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Ngày tạo</th>
                                <th>Mục đích</th>
                                <th>Vị trí</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((yc, idx) => (
                                <tr key={yc.idYeuCauKiemKe}>
                                    <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                                    <td>{new Date(yc.ngayTao).toLocaleDateString()}</td>
                                    <td>{yc.mucDich}</td>
                                    <td>{yc.viTriKiemKe}</td>
                                    <td>{
                                        yc.trangThai === 0 ? "⏳ Chưa thực hiện" :
                                            yc.trangThai === 1 ? "✅ Đã kiểm" :
                                                yc.trangThai === 2 ? "⚠️ Có lệch" : "📦 Đã xử lý"
                                    }</td>
                                    <td>
                                        <button onClick={() => openPopup(yc.idYeuCauKiemKe)}>👁 Xem</button>
                                        <button onClick={async () => {
                                            const res = await fetch(`https://qlkhohangtbdt-fptshop-be2.onrender.com/api/yeucaukiemke/${yc.idYeuCauKiemKe}`);
                                            const data = await res.json();
                                            setEditData(data);
                                            setShowPopup(true);
                                        }}
                                            disabled={yc.trangThai !== 0}
                                            style={yc.trangThai !== 0 ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                                        >✏️ Sửa</button>
                                        <button onClick={() => deleteYeuCau(yc.idYeuCauKiemKe)}
                                            disabled={yc.trangThai !== 0}
                                            style={yc.trangThai !== 0 ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                                        >🗑 Xoá</button>

                                        {yc.trangThai === 0 ? (
                                            currentUser === yc.tenTruongBan || currentUser === yc.tenUyVien1 || currentUser === yc.tenUyVien2 || currentUser === yc.nguoiTao ? (
                                                <button onClick={() => navigate(`/thuc-hien-kiem-ke/${yc.idYeuCauKiemKe}`)}>📝 Kiểm kê</button>
                                            ) : (
                                                <button disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>📝 Không được phân công</button>
                                            )
                                        ) : (
                                            <button onClick={() => navigate(`/xem-phieu-kiem-ke/${yc.idYeuCauKiemKe}`)}>📄 Xem kiểm kê</button>
                                        )}

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    {popupData && (
                        <div className="popup">
                            <div className="popup-inner" style={{ maxHeight: "90vh", overflowY: "auto", position: "relative" }}>
                                <div style={{ position: 'absolute', top: '10px', right: '15px', zIndex: 10 }}>
                                    <button className="close-btn"
                                        onClick={() => setPopupData(null)}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            fontSize: '24px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            color: '#333'
                                        }}
                                        title="Đóng"
                                    >
                                        ×
                                    </button>
                                </div>

                                <h3>📄 Chi tiết yêu cầu kiểm kê #{popupData.idYeuCauKiemKe}</h3>
                                <p><strong>📅 Ngày tạo:</strong> {new Date(popupData.ngayTao).toLocaleString()}</p>
                                <p><strong>🎯 Mục đích:</strong> {popupData.mucDich || "--"}</p>
                                <p><strong>📍 Vị trí kiểm kê:</strong> {popupData.viTriKiemKe || "--"}</p>
                                <p><strong>📝 Ghi chú:</strong> {popupData.ghiChu || "--"}</p>
                                <p><strong>👤 Người tạo:</strong> {popupData.nguoiTao || "--"}</p>
                                <p><strong>👨‍💼 Trưởng ban:</strong> {popupData.tenTruongBan || "--"}</p>
                                <p><strong>👤 Ủy viên 1:</strong> {popupData.tenUyVien1 || "--"}</p>
                                <p><strong>👤 Ủy viên 2:</strong> {popupData.tenUyVien2 || "--"}</p>
                                <p><strong>📊 Trạng thái:</strong> {
                                    popupData.trangThai === 0 ? "⏳ Chưa thực hiện" :
                                        popupData.trangThai === 1 ? "✅ Đã kiểm" :
                                            popupData.trangThai === 2 ? "⚠️ Có lệch" : "📦 Đã xử lý"
                                }</p>

                                <h4>📍 Chi tiết vị trí lưu trữ</h4>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Tên sản phẩm</th>
                                            <th>Vị trí</th>
                                            <th>Số lượng tại vị trí</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(() => {
                                            const grouped = {};
                                            (popupData.viTriSanPham || []).forEach(item => {
                                                if (!grouped[item.tenSanPham]) grouped[item.tenSanPham] = [];
                                                grouped[item.tenSanPham].push(item);
                                            });

                                            return Object.entries(grouped).map(([tenSanPham, items], spIdx) =>
                                                items.map((item, idx) => (
                                                    <tr key={`${spIdx}-${idx}`}>
                                                        {idx === 0 && (
                                                            <>
                                                                <td rowSpan={items.length}>{spIdx + 1}</td>
                                                                <td rowSpan={items.length}>{tenSanPham}</td>
                                                            </>
                                                        )}
                                                        <td>{item.viTri}</td>
                                                        <td>{item.soLuongTaiViTri}</td>
                                                    </tr>
                                                ))
                                            );
                                        })()}
                                    </tbody>
                                </table>

                                <button className="btn-close" onClick={() => setPopupData(null)}>Đóng</button>
                            </div>
                        </div>
                    )}

                    <FormYeuCauKiemKePopup
                        visible={showPopup}
                        onClose={() => {
                            setShowPopup(false);
                            setEditData(null);
                        }}
                        initialData={editData}
                        onSubmit={() => {
                            setShowPopup(false);
                            setEditData(null);
                            fetchData();
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default QuanLyYeuCauKiemKe;