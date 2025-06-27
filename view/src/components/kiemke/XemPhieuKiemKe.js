import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { utils, writeFile } from "xlsx";
import Sidebar from "../common/Sidebar/Sidebar";
import Navbar from "../common/Navbar/Navbar";
import "../nhapkho/FormTaoPhieuNhap.css";
import { FaHome, FaClipboardList } from "react-icons/fa";

const XemPhieuKiemKe = () => {
    const { idYeuCauKiemKe } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get(`https://qlkhohangtbdt-fptshop-be2.onrender.com/api/kiemke/theo-yeucau/${idYeuCauKiemKe}`)
            .then(res => {
                const merged = res.data.chiTietPhieuKiemKes.map(ct => {
                    const vt = res.data.viTriSanPham.find(v => v.idSanPham === ct.idSanPham && v.idViTri === ct.idViTri);
                    return {
                        ...ct,
                        viTri: vt?.viTri || "--",
                        soLuongTaiViTri: vt?.soLuongTaiViTri || "--"
                    };
                });
                setData({ ...res.data, chiTietPhieuKiemKes: merged });
            })
            .catch(() => alert("❌ Không thể tải phiếu kiểm kê."));
    }, [idYeuCauKiemKe]);

    const handleExport = () => {
        if (!data) return;
        const rows = data.chiTietPhieuKiemKes.map((ct, idx) => ({
            STT: idx + 1,
            "Sản phẩm": ct.tenSanPham,
            "Tồn kho hệ thống": ct.soLuongTheoHeThong,
            "Thực tế": ct.soLuongThucTe,
            "Chênh lệch": ct.soLuongThucTe - ct.soLuongTheoHeThong,
            "Phẩm chất": ct.phamChat || "--",
            "Ghi chú": ct.ghiChu || "--"
        }));
        const ws = utils.json_to_sheet(rows);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "PhieuKiemKe");
        writeFile(wb, `PhieuKiemKe_${idYeuCauKiemKe}.xlsx`);
    };

    if (!data) return null;
    const groupBy = (arr, key) =>
        arr.reduce((acc, obj) => {
            const groupKey = obj[key];
            if (!acc[groupKey]) acc[groupKey] = [];
            acc[groupKey].push(obj);
            return acc;
        }, {});


    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <Navbar />

                <div className="breadcrumb">
                    <Link to="/dashboard"><FaHome className="breadcrumb-icon" /> Trang chủ</Link>
                    <span>/</span>
                    <Link to="/quan-ly-yeu-cau-kiem-ke"><FaClipboardList className="breadcrumb-icon" /> Phiếu kiểm kê</Link>
                    <span>/</span>
                    <span>Xem chi tiết</span>
                </div>

                <div className="form-container">
                    <h1 className="title">📋 CHI TIẾT PHIẾU KIỂM KÊ #{data.idKiemKe}</h1>

                    <div className="form-section">👤 Người kiểm: {data.tenNguoiThucHien || data.nguoiKiemKe || "--"}</div>
                    <div className="form-section">📅 Ngày kiểm kê: {new Date(data.ngayKiemKe).toLocaleString()}</div>
                    <div className="form-section">🎯 Mục đích:{data.mucDich || "--"}</div>
                    <div className="form-section">📍 Vị trí kiểm kê: {data.viTriKiemKe || "--"}</div>
                    <div className="form-section">📝 Ghi chú: {data.ghiChu || "--"}</div>
                    <div className="form-section">📊 Trạng thái:✅ Đã kiểm</div>

                    <h3>📦 Danh sách sản phẩm kiểm kê</h3>
                    <div className="added-products">
                        <table className="sub-table">
                            <thead>
                                <tr>
                                    <th>Sản phẩm</th>
                                    <th>Vị trí</th>
                                    
                                    <th>Tồn hệ thống</th>
                                    <th>Thực tế</th>
                                    <th>Chênh lệch</th>
                                    <th>Phẩm chất</th>
                                    <th>Ghi chú</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(groupBy(data.chiTietPhieuKiemKes, 'tenSanPham')).map(([tenSanPham, items], groupIdx) => {
                                    const rowSpan = items.length;
                                    const phamChat = items[0].phamChat || "--";
                                    const ghiChu = items[0].ghiChu || "--";

                                    return items.map((item, i) => {
                                        const chenhLech = item.soLuongThucTe - item.soLuongTheoHeThong;

                                        return (
                                            <tr key={`${tenSanPham}-${i}`} style={chenhLech !== 0 ? { backgroundColor: "#ffe6e6" } : {}}>
                                                {i === 0 && (
                                                    <td rowSpan={rowSpan} style={{ textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold' }}>
                                                        {tenSanPham}
                                                    </td>
                                                )}
                                                <td>{item.viTri}</td>
                                                <td>{item.soLuongTheoHeThong}</td>
                                                <td>{item.soLuongThucTe}</td>
                                                <td style={{ color: chenhLech !== 0 ? 'red' : undefined }}>{chenhLech}</td>
                                                {i === 0 && (
                                                    <>
                                                        <td rowSpan={rowSpan} style={{ textAlign: 'center', verticalAlign: 'middle' }}>{phamChat}</td>
                                                        <td rowSpan={rowSpan} style={{ textAlign: 'center', verticalAlign: 'middle' }}>{ghiChu}</td>
                                                    </>
                                                )}
                                            </tr>
                                        );
                                    });
                                })}
                            </tbody>


                        </table>
                    </div>

                    <div className="center-btn">
                        <button className="btn-export excel" onClick={handleExport}>📥 Xuất Excel</button>
                        <button className="btn-export close" onClick={() => navigate("/quan-ly-yeu-cau-kiem-ke")}>⬅ Quay lại</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default XemPhieuKiemKe;
