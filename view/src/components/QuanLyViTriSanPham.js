import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./FormTaoPhieuNhap.css";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination";

const removeVietnameseTones = (str) => {
    return str.normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/đ/g, "d").replace(/Đ/g, "D")
        .toLowerCase();
};

const QuanLyViTriSanPham = () => {
    const [danhSach, setDanhSach] = useState([]);
    const [tuKhoa, setTuKhoa] = useState("");
    const [maSanPham, setMaSanPham] = useState("");
    const [dayLoc, setDayLoc] = useState("");
    const [cotLoc, setCotLoc] = useState("");
    const [tangLoc, setTangLoc] = useState("");
    const [popup, setPopup] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("https://localhost:5288/api/ChiTietLuuTru")
            .then(res => setDanhSach(res.data))
            .catch(err => console.error("Lỗi tải danh sách vị trí:", err));
    }, []);

    const handleReset = () => {
        setTuKhoa("");
        setMaSanPham("");
        setDayLoc("");
        setCotLoc("");
        setTangLoc("");
        setCurrentPage(1);
    };

    const danhSachLoc = danhSach.filter(item => {
        const keyword = removeVietnameseTones(tuKhoa.trim());
        const itemTen = removeVietnameseTones(item.tenSanPham || "");
        const matchKeyword = !keyword || itemTen.includes(keyword);

        const matchMa = !maSanPham || item.idSanPham?.toString().includes(maSanPham);
        const matchDay = !dayLoc || item.day?.toString() === dayLoc;
        const matchCot = !cotLoc || item.cot?.toString() === cotLoc;
        const matchTang = !tangLoc || item.tang?.toString() === tangLoc;

        return matchKeyword && matchMa && matchDay && matchCot && matchTang;
    });

    const handleXem = (item) => setPopup(item);

    const handleXoa = async (idViTri, idSanPham) => {
        if (!window.confirm("Xoá sản phẩm khỏi vị trí này?")) return;
        try {
            await axios.delete(`https://localhost:5288/api/ChiTietLuuTru/${idViTri}/${idSanPham}`);
            setDanhSach(prev => prev.filter(i => !(i.idViTri === idViTri && i.idSanPham === idSanPham)));
            alert("✅ Đã xoá khỏi vị trí");
        } catch (err) {
            alert("❌ Lỗi khi xoá");
        }
    };

    const handleChuyen = (idSanPham) => {
        navigate("/chuyen-vi-tri-san-pham", {
            state: {
                idSanPham,
                preselect: true
            }
        });
    };

    const groupedData = danhSachLoc.reduce((acc, item) => {
        const key = item.idSanPham;
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});

    const flattenedData = Object.values(groupedData).flat();
    const totalPages = Math.ceil(flattenedData.length / itemsPerPage);
    const paginatedGroups = Object.values(groupedData).reduce((acc, group) => {
        const filteredGroup = group.filter((_, index) => {
            const globalIndex = flattenedData.findIndex(
                (item, i) => item.idSanPham === group[0].idSanPham && item.idViTri === group[index].idViTri
            );
            return globalIndex >= (currentPage - 1) * itemsPerPage && globalIndex < currentPage * itemsPerPage;
        });
        if (filteredGroup.length > 0) acc.push(filteredGroup);
        return acc;
    }, []);

    let stt = (currentPage - 1) * itemsPerPage + 1;

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">

                <Navbar />
                <div className="container">
                    <h2>📦 Quản lý vị trí sản phẩm</h2>

                    <div className="search-form">
                        <input type="text" placeholder="Tìm theo tên sản phẩm" value={tuKhoa} onChange={(e) => setTuKhoa(e.target.value)} className="search-input" />
                        <input type="text" placeholder="Mã sản phẩm" value={maSanPham} onChange={(e) => setMaSanPham(e.target.value)} className="search-input" />
                        <input type="text" placeholder="Dãy" value={dayLoc} onChange={(e) => setDayLoc(e.target.value)} className="search-input" />
                        <input type="text" placeholder="Cột" value={cotLoc} onChange={(e) => setCotLoc(e.target.value)} className="search-input" />
                        <input type="text" placeholder="Tầng" value={tangLoc} onChange={(e) => setTangLoc(e.target.value)} className="search-input" />
                        <button onClick={handleReset} className="reset-button">🔄 Reset bộ lọc</button>
                    </div>

                    <p style={{ marginTop: 10 }}>🔍 Tổng kết quả: <strong>{danhSachLoc.length}</strong></p>

                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã SP</th>
                                <th>Tên SP</th>
                                <th>Vị trí</th>
                                <th>SL tại vị trí</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedGroups.map((group) => (
                                group.map((item, idx) => (
                                    <tr key={`${item.idViTri}-${item.idSanPham}`}>
                                        <td>{idx === 0 ? stt++ : ""}</td>
                                        <td>{idx === 0 ? item.idSanPham : ""}</td>
                                        <td>{idx === 0 ? item.tenSanPham : ""}</td>
                                        <td>Dãy {item.day} - Cột {item.cot} - Tầng {item.tang}</td>
                                        <td>{item.soLuong}</td>
                                        <td>
                                            <button onClick={() => handleXem(item)}>🔍</button>
                                            <button onClick={() => handleChuyen(item.idSanPham)}>✏️</button>
                                            <button onClick={() => handleXoa(item.idViTri, item.idSanPham)}>🗑</button>
                                        </td>
                                    </tr>
                                ))
                            ))}
                        </tbody>
                    </table>

                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

                    {popup && (
                        <div className="popup">
                            <div className="popup-inner">
                                <h3>📍 Chi tiết vị trí</h3>
                                <p><strong>Sản phẩm:</strong> {popup.tenSanPham}</p>
                                <p><strong>Mã SP:</strong> {popup.idSanPham}</p>
                                <p><strong>Số lượng:</strong> {popup.soLuong}</p>
                                <p><strong>Vị trí:</strong> Dãy {popup.day} - Cột {popup.cot} - Tầng {popup.tang}</p>
                                <button onClick={() => setPopup(null)} className="close-btn">Đóng</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuanLyViTriSanPham;
