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
                                {data.chiTietPhieuKiemKes.map((ct, idx) => (
                                    <tr key={idx} style={ct.soLuongThucTe !== ct.soLuongTheoHeThong ? { backgroundColor: "#ffe6e6" } : {}}>
                                        <td>{ct.tenSanPham}</td>
                                        <td>{ct.viTri || "--"}</td>
                                      
                                        <td>{ct.soLuongTheoHeThong}</td>
                                        <td>{ct.soLuongThucTe}</td>
                                        <td style={{ color: ct.soLuongThucTe !== ct.soLuongTheoHeThong ? "red" : undefined }}>
                                            {ct.soLuongThucTe - ct.soLuongTheoHeThong}
                                        </td>
                                        <td>{ct.phamChat || "--"}</td>
                                        <td>{ct.ghiChu || "--"}</td>
                                    </tr>
                                ))}
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
