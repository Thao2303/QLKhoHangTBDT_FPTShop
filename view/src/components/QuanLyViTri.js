// ✅ QUẢN LÝ VỊ TRÍ - Giao diện đồng bộ như Quản lý phiếu nhập / tài khoản
import React, { useEffect, useState } from "react";
import axios from "axios";
import DanhSachViTri from "./DanhSachViTri";
import FormViTri from "./FormViTri";
import ChiTietSanPhamViTri from "./ChiTietSanPhamViTri";
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Pagination from './Pagination';
import "./QuanLyPhieuNhapKho.css";

const QuanLyViTri = () => {
    const [danhSach, setDanhSach] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedViTri, setSelectedViTri] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [sanPhamChiTiet, setSanPhamChiTiet] = useState([]);
    const [xemChiTietId, setXemChiTietId] = useState(null);
    const [isChiTietOpen, setIsChiTietOpen] = useState(false);

    const [searchMaViTri, setSearchMaViTri] = useState("");
    const [filterTrangThai, setFilterTrangThai] = useState("");
    const [filterDay, setFilterDay] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("https://localhost:5288/api/vitri");
            setDanhSach(res.data);
        } catch (err) {
            console.error("Lỗi tải vị trí:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLuu = async (data) => {
        try {
            if (data.idViTri) {
                await axios.put(`https://localhost:5288/api/vitri/${data.idViTri}`, data);
            } else {
                await axios.post("https://localhost:5288/api/vitri", data);
            }
            setIsFormOpen(false);
            setSelectedViTri(null);
            fetchData();
        } catch (err) {
            console.error("Lỗi lưu vị trí:", err);
        }
    };

    const handleXoa = async () => {
        try {
            await axios.delete(`https://localhost:5288/api/vitri/${confirmDelete.idViTri}`);
            setConfirmDelete(null);
            fetchData();
        } catch (err) {
            console.error("Lỗi xoá vị trí:", err);
        }
    };

    const onXemChiTiet = async (idViTri) => {
        setXemChiTietId(idViTri);
        setIsChiTietOpen(true);
        try {
            const res = await axios.get(`https://localhost:5288/api/luutru/chitietluutru/vitri/${idViTri}`);
            setSanPhamChiTiet(res.data);
        } catch (err) {
            console.error("Lỗi khi lấy sản phẩm trong vị trí:", err);
            setSanPhamChiTiet([]);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = danhSach.filter((item) => {
        const tinhTrang = item.trangThai === 0
            ? "Đã khoá"
            : item.daDung >= item.sucChua
                ? "Đã đầy"
                : "Còn trống";

        const matchMaViTri = item.idViTri.toString().includes(searchMaViTri);
        const matchTrangThai = filterTrangThai ? tinhTrang === filterTrangThai : true;
        const matchDay = filterDay ? item.day?.toLowerCase().includes(filterDay.toLowerCase()) : true;
        return matchMaViTri && matchTrangThai && matchDay;
    });

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentData = filteredData.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <div className="main-layout">
                    <Navbar />
                    <div className="container">
                        <h1 className="title">Quản lý vị trí trong kho</h1>

                        <div className="search-form">
                            <input placeholder="Tìm mã vị trí" value={searchMaViTri} onChange={(e) => setSearchMaViTri(e.target.value)} className="search-input" />
                            <select value={filterTrangThai} onChange={(e) => setFilterTrangThai(e.target.value)} className="filter-select">
                                <option value="">-- Trạng thái --</option>
                                <option value="Còn trống">Còn trống</option>
                                <option value="Đã đầy">Đã đầy</option>
                                <option value="Đã khoá">Đã khoá</option>
                            </select>
                            <input placeholder="Dãy (A, B...)" value={filterDay} onChange={(e) => setFilterDay(e.target.value)} className="filter-select" />
                            <div style={{ display: "flex", gap: 10 }}>
                                <button className="search-button">🔍 Tìm kiếm</button>
                                <button className="reset-button" onClick={() => { setSearchMaViTri(""); setFilterTrangThai(""); setFilterDay(""); }}>🗑 Xóa lọc</button>
                            </div>
                        </div>

                        <button className="add-button" onClick={() => { setSelectedViTri(null); setIsFormOpen(true); }}>+ Thêm vị trí</button>

                        <DanhSachViTri
                            danhSach={currentData}
                            handleEdit={(vt) => { setSelectedViTri(vt); setIsFormOpen(true); }}
                            setConfirmDelete={setConfirmDelete}
                            isLoading={isLoading}
                            onXemChiTiet={onXemChiTiet}
                        />

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>

                {isFormOpen && (
                    <FormViTri
                        visible={isFormOpen}
                        onClose={() => { setIsFormOpen(false); setSelectedViTri(null); }}
                        onSubmit={handleLuu}
                        initialData={selectedViTri}
                    />
                )}

                {confirmDelete && (
                    <div className="popup-overlay">
                        <div className="popup-box">
                            <p>Bạn có chắc chắn muốn xoá vị trí này?</p>
                            <div className="mt-4 flex justify-end gap-2">
                                <button className="btn btn-cancel" onClick={() => setConfirmDelete(null)}>Huỷ</button>
                                <button className="btn btn-delete" onClick={handleXoa}>Xoá</button>
                            </div>
                        </div>
                    </div>
                )}

                {isChiTietOpen && (
                    <div className="popup-overlay">
                        <div className="popup-box">
                            <h2 className="text-xl font-semibold mb-4">📦 Sản phẩm trong vị trí #{xemChiTietId}</h2>
                            <ChiTietSanPhamViTri danhSach={sanPhamChiTiet} />
                            <div className="mt-4 text-right">
                                <button onClick={() => setIsChiTietOpen(false)} className="btn btn-cancel">Đóng</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuanLyViTri;