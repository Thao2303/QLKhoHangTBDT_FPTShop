import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from '../common/Sidebar/Sidebar';
import Navbar from '../common/Navbar/Navbar';
import "../nhapkho/FormTaoPhieuNhap.css";
import { useNavigate } from "react-router-dom";
import Pagination from "../common/Pagination/Pagination";
import ChiTietSanPhamViTri from "./ChiTietSanPhamViTri";

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
  
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const navigate = useNavigate();
    const [viTriSanPhamList, setViTriSanPhamList] = useState([]);
    const [viTri, setViTri] = useState(null);
    const [sanPhamDangChon, setSanPhamDangChon] = useState(null);
    const [showChiTiet, setShowChiTiet] = useState(false); // dùng để toggle popup

    useEffect(() => {
        axios.get("https://qlkhohangtbdt-fptshop-be2.onrender.com/api/ChiTietLuuTru")
            .then(res => {
                const gopViTri = {};
                res.data.forEach(item => {
                    const key = `${item.idSanPham}-${item.idViTri}`;
                    if (!gopViTri[key]) {
                        gopViTri[key] = { ...item };
                    } else {
                        gopViTri[key].soLuong += item.soLuong;
                    }
                });
                setDanhSach(Object.values(gopViTri));
            })
            .catch(() => alert("❌ Lỗi khi tải dữ liệu chi tiết lưu trữ"));

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
        const hasSoLuong = item.soLuong > 0;

        return matchKeyword && matchMa && matchDay && matchCot && matchTang && hasSoLuong;
    });


    

    const handleXoa = async (idViTri, idSanPham) => {
        if (!window.confirm("Xoá sản phẩm khỏi vị trí này?")) return;
        try {
            await axios.delete(`https://qlkhohangtbdt-fptshop-be2.onrender.com/api/ChiTietLuuTru/${idViTri}/${idSanPham}`);
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
                    <h1 className="title">📦 QUẢN LÝ VỊ TRÍ SẢN PHẨM</h1>

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
                                <th>Tổng số lượng</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedGroups.map((group, index) => {
                                const firstItem = group[0];
                                const viTriText = group.map((item, idx) => (
                                    <div key={idx}>
                                        Dãy {item.day} - Cột {item.cot} - Tầng {item.tang} (SL: {item.soLuong})
                                    </div>
                                ));


                                return (
                                    <tr key={`group-${firstItem.idSanPham}`}>
                                        <td>{stt++}</td>
                                        <td>{firstItem.idSanPham}</td>
                                        <td>{firstItem.tenSanPham}</td>
                                        <td>{viTriText}</td>

                                        <td>{group.reduce((sum, item) => sum + item.soLuong, 0)}</td>
                                        <td>
                                            <button onClick={() => {
                                                setSanPhamDangChon(firstItem);
                                                setViTriSanPhamList(group);
                                                setViTri(group[0]);  // 👈 lấy vị trí đầu tiên để hiển thị
                                                setShowChiTiet(true);
                                            }}>
                                                🔍
                                            </button>


                                            <button onClick={() => handleChuyen(firstItem.idSanPham)}>✏️</button>
                                            {/*    <button onClick={() => handleXoa(firstItem.idViTri, firstItem.idSanPham)}>🗑</button> */}    
                                        </td>

                                    </tr>
                                );
                            })}
                        </tbody>


                    </table>

                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

                    {showChiTiet && (
                        <div className="popup">
                            <ChiTietSanPhamViTri
                                danhSach={viTriSanPhamList}
                                idSanPham={sanPhamDangChon?.idSanPham}
                                onClose={() => setShowChiTiet(false)}
                            />

                        </div>
                    )}


                </div>
            </div>
        </div>
    );
};

export default QuanLyViTriSanPham;
