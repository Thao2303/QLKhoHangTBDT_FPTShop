// ✅ QUẢN LÝ TÀI KHOẢN - Giao diện giống quản lý phiếu nhập (UI đồng bộ hóa layout, style)
import React, { useEffect, useState } from "react";
import FormTaiKhoan from "./FormTaiKhoan";
import ChiTietTaiKhoan from "./ChiTietTaiKhoan";
import Pagination from "../common/Pagination/Pagination";
import Sidebar from '../common/Sidebar/Sidebar';
import Navbar from '../common/Navbar/Navbar';
import "../nhapkho/QuanLyPhieuNhapKho.css"; 

const QuanLyTaiKhoan = () => {
    const [danhSach, setDanhSach] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [filterChucVu, setFilterChucVu] = useState("");
    const [filterNgayTu, setFilterNgayTu] = useState("");
    const [filterNgayDen, setFilterNgayDen] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedData, setSelectedData] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showDetail, setShowDetail] = useState(false);

    const currentUser = JSON.parse(localStorage.getItem("user"));

    const itemsPerPage = 10;

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("https://qlkhohangtbdt-fptshop-be2.onrender.com/api/taikhoan");
            const data = await res.json();
            setDanhSach(data);
        } catch (error) {
            alert("Lỗi khi tải danh sách tài khoản");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        const roles = currentUser?.tenChucVu?.split(",") || [];

        if (!roles.includes("Admin") && !roles.includes("Thủ kho")) {
            window.location.href = "/not-found"; // Không có quyền
        }
    }, []);


    useEffect(() => {
        fetchData();
    }, []);

    const handleFilter = (item) => {
        const keyword = searchKeyword.toLowerCase();
        const matchKeyword = item.tenTaiKhoan?.toLowerCase().includes(keyword) || item.email?.toLowerCase().includes(keyword);
        const matchChucVu = filterChucVu ? item.tenChucVu === filterChucVu : true;
        const ngay = new Date(item.ngayCap);
        const matchNgay = (!filterNgayTu || ngay >= new Date(filterNgayTu)) && (!filterNgayDen || ngay <= new Date(filterNgayDen));
        return matchKeyword && matchChucVu && matchNgay;
    };

    const handleToggleTrangThai = async (id, isActive) => {
        const msg = isActive ? "Bạn có chắc chắn muốn KHÓA tài khoản này?" : "Bạn có muốn MỞ lại tài khoản này?";
        if (!window.confirm(msg)) return;
        try {
            const res = await fetch(`https://qlkhohangtbdt-fptshop-be2.onrender.com/api/taikhoan/khoataikhoan/${id}`, { method: "PUT" });
            res.ok ? alert("✅ Cập nhật thành công") : alert("❌ Thất bại");
            fetchData();
        } catch {
            alert("Lỗi mạng hoặc server");
        }
    };

    const filteredData = danhSach.filter(handleFilter);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSubmit = () => {
        setShowForm(false);
        setSelectedData(null);
        fetchData();
    };

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <div className="main-layout">
                    <Navbar />
                    <div className="container">
                        <h1 className="title">QUẢN LÝ TÀI KHOẢN</h1>

                        <div className="search-form">
                            <input placeholder="Tài khoản / Email" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} className="search-input" />
                            <select value={filterChucVu} onChange={(e) => setFilterChucVu(e.target.value)} className="filter-select">
                                <option value="">-- Chức vụ --</option>
                                <option value="Admin">Admin</option>
                                <option value="Nhân viên">Nhân viên</option>
                                <option value="Thủ kho">Thủ kho</option>
                                <option value="Kế toán">Kế toán</option>
                            </select>
                            <div className="date-group">
                                <label>Từ ngày:</label>
                                <input type="date" value={filterNgayTu} onChange={(e) => setFilterNgayTu(e.target.value)} className="date-input" />
                            </div>
                            <div className="date-group">
                                <label>Đến ngày:</label>
                                <input type="date" value={filterNgayDen} onChange={(e) => setFilterNgayDen(e.target.value)} className="date-input" />
                            </div>
                            <div style={{ display: "flex", gap: 10 }}>
                                <button className="search-button">🔍 Tìm kiếm</button>
                                <button className="reset-button" onClick={() => { setSearchKeyword(""); setFilterChucVu(""); setFilterNgayTu(""); setFilterNgayDen(""); }}>🗑 Xóa tìm kiếm</button>
                            </div>
                        </div>

                       
                            <button className="add-button" onClick={() => { setShowForm(true); setSelectedData(null); }}>+ Thêm tài khoản</button>
                        

                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tài khoản</th>
                                    <th>Email</th>
                                    <th>Chức vụ</th>
                                    <th>Ngày cấp</th>
                                    <th>Trạng thái</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? <tr><td colSpan={7}>Đang tải...</td></tr> : currentData.length === 0 ? <tr><td colSpan={7}>Không có dữ liệu</td></tr> : currentData.map((tk, i) => (
                                    <tr key={tk.idTaiKhoan}>
                                        <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                                        <td>{tk.tenTaiKhoan}</td>
                                        <td>{tk.email}</td>
                                        <td>{tk.tenChucVu}</td>
                                        <td>{tk.ngayCap}</td>
                                        <td>
                                            <span className={`status-badge ${tk.trangThai ? 'status-approved' : 'status-rejected'}`}>
                                                {tk.trangThai ? 'Hoạt động' : 'Đã khóa'}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="edit-btn" onClick={() => {
                                                setSelectedData(tk);
                                                setShowDetail(true);
                                            }}>👁</button>

                                            {currentUser.chucVu === 'Admin' && <>
                                                <button className="edit-btn" onClick={() => { setSelectedData(tk); setShowForm(true); }}>✏</button>
                                                <button className="delete-btn" onClick={() => handleToggleTrangThai(tk.idTaiKhoan, tk.trangThai)}>
                                                    {tk.trangThai ? '🛑' : '✅'}
                                                </button>
                                            </>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    </div>
                </div>
            </div>

            <FormTaiKhoan visible={showForm} onClose={() => setShowForm(false)} onSubmit={handleSubmit} initialData={selectedData} />
            <ChiTietTaiKhoan
                visible={showDetail}
                onClose={() => {
                    setShowDetail(false);
                    setSelectedData(null);
                }}
                data={selectedData}
            />

        </div>
    );
};

export default QuanLyTaiKhoan;