import React, { useEffect, useState } from "react";
import axios from "axios";
import DanhSachViTri from "./DanhSachViTri";
import FormViTri from "./FormViTri";
import ChiTietSanPhamViTri from "./ChiTietSanPhamViTri";
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Pagination from './Pagination';
import "./QuanLyPhieuNhapKho.css";
import "./popup-style.css";

const QuanLyViTri = () => {
    const [danhSach, setDanhSach] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedViTri, setSelectedViTri] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [sanPhamChiTiet, setSanPhamChiTiet] = useState([]);
    const [xemChiTietId, setXemChiTietId] = useState(null);
    const [isChiTietOpen, setIsChiTietOpen] = useState(false);
    const [viTriChiTiet, setViTriChiTiet] = useState(null);

    const [searchMaViTri, setSearchMaViTri] = useState("");
    const [filterTrangThai, setFilterTrangThai] = useState("");
    const [filterDay, setFilterDay] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("https://localhost:5288/api/vitri");
            const processed = res.data.map(vt => ({
                ...vt,
                idKhuVuc: vt.khuVuc?.idKhuVuc || ""
            }));
            setDanhSach(processed);

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
            const [spRes, vtRes] = await Promise.all([
                axios.get(`https://localhost:5288/api/chitietluutru/chitietluutru/vitri/${idViTri}`),
                axios.get(`https://localhost:5288/api/vitri/${idViTri}`)
            ]);
            setSanPhamChiTiet(spRes.data);
            setViTriChiTiet(vtRes.data);
        } catch (err) {
            console.error("Lỗi khi lấy chi tiết vị trí hoặc sản phẩm:", err);
            setSanPhamChiTiet([]);
            setViTriChiTiet(null);
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

    const danhSachDay = [...new Set(danhSach.map(x => x.day))].sort();

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
                            <select value={filterDay} onChange={(e) => setFilterDay(e.target.value)} className="filter-select">
                                <option value="">-- Dãy --</option>
                                {danhSachDay.map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                            <div style={{ display: "flex", gap: 10 }}>
                                <button className="search-button">🔍 Tìm kiếm</button>
                                <button className="reset-button" onClick={() => { setSearchMaViTri(""); setFilterTrangThai(""); setFilterDay(""); }}>🗑 Xóa lọc</button>
                            </div>
                        </div>

                        <button className="add-button" onClick={() => { setSelectedViTri(null); setIsFormOpen(true); }}>+ Thêm vị trí</button>

                        <DanhSachViTri
                            danhSach={currentData}
                            handleEdit={async (vt) => {
                                try {
                                    const res = await axios.get(`https://localhost:5288/api/vitri/${vt.idViTri}`);
                                    const full = res.data;
                                    const idKhuVuc = full.khuVuc?.idKhuVuc || "";
                                    setSelectedViTri({ ...full, idKhuVuc });

                                    setSelectedViTri(full);
                                    setIsFormOpen(true);
                                } catch (err) {
                                    console.error("Không lấy được chi tiết vị trí:", err);
                                }
                            }}

                            setConfirmDelete={setConfirmDelete}
                            isLoading={isLoading}
                            onXemChiTiet={onXemChiTiet}
                            renderStatus={(item) => {
                                const tinhTrang = item.trangThai === 0
                                    ? "Đã khoá"
                                    : item.daDung >= item.sucChua
                                        ? "Đã đầy"
                                        : "Còn trống";
                                const colorClass = tinhTrang === "Còn trống" ? "status-approved" : tinhTrang === "Đã đầy" ? "status-rejected" : "status-pending";
                                return <span className={`status-badge ${colorClass}`}>{tinhTrang}</span>;
                            }}
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
                        <div className="popup-box" style={{ margin: "auto" }}>
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
                   
                        <ChiTietSanPhamViTri danhSach={sanPhamChiTiet} viTri={viTriChiTiet} onClose={() => setIsChiTietOpen(false)} />

                        </div>
                 
                )}
            </div>
        </div>
    );
};

export default QuanLyViTri;
