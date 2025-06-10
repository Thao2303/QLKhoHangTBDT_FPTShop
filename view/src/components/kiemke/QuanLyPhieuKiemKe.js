import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from '../common/Navbar/Navbar';
import Sidebar from '../common/Sidebar/Sidebar';
import "./QuanLyPhieuKiemKe.css";
import { useNavigate } from "react-router-dom";

const QuanLyPhieuKiemKe = () => {
    const [dsPhieu, setDsPhieu] = useState([]);
    const [popupPhieu, setPopupPhieu] = useState(null);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const res = await axios.get("https://localhost:5288/api/kiemke")

            setDsPhieu(res.data || []);
        } catch (err) {
            console.error("Lỗi lấy danh sách phiếu kiểm kê:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formatDate = (str) => {
        const d = new Date(str);
        return d.toLocaleDateString("vi-VN") + " " + d.toLocaleTimeString("vi-VN");
    };

    const getTrangThaiLabel = (t) => {
        switch (t) {
            case 0: return "⏳ Chưa kiểm";
            case 1: return "✅ Đã kiểm";
            case 2: return "⚠️ Lệch";
            default: return "--";
        }
    };
    const fetchChiTietPhieu = async (idKiemKe) => {
        try {
            const res = await axios.get(`https://localhost:5288/api/kiemke/${idKiemKe}`);
            setPopupPhieu(res.data);
        } catch (err) {
            alert("Không thể tải chi tiết phiếu kiểm kê");
            console.error(err);
        }
    };

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <Navbar />
                <div className="main-layout">
                    <div className="container">
                    <h2 className="title">📋 Quản lý phiếu kiểm kê hàng hóa</h2>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                           
                            <button className="submit-btn" onClick={() => navigate("/tao-phieu-kiem-ke")}>
                                ➕ Tạo phiếu kiểm kê
                            </button>
                        </div>

                    <table className="table">
                        <thead>
                            <tr>
                                <th>Mã phiếu</th>
                                <th>Ngày kiểm kê</th>
                                <th>Người kiểm</th>
                                <th>Ghi chú</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dsPhieu.map((phieu, idx) => (
                                <tr key={idx}>
                                    <td>{phieu.idKiemKe}</td>

                                    <td>{formatDate(phieu.ngayKiemKe)}</td>
                                    <td>{phieu.nguoiKiemKe || "--"}</td>


                                    <td>{phieu.ghiChu || "--"}</td>
                                    <td><span className={`trangthai tt-${phieu.trangThai}`}>{getTrangThaiLabel(phieu.trangThai)}</span></td>
                                    <td>
                                        <button onClick={() => fetchChiTietPhieu(phieu.idKiemKe)}>👁 Xem</button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {popupPhieu && (
                        <div className="popup">
                            <div className="popup-inner">
                                <h3>📋 Phiếu kiểm kê #{popupPhieu.maPhieu}</h3>
                                <p><strong>Ngày kiểm kê:</strong> {formatDate(popupPhieu.ngayKiemKe)}</p>
                                <p><strong>Người kiểm:</strong> {popupPhieu.nguoiKiemKe}</p>
                                <p><strong>Ghi chú:</strong> {popupPhieu.ghiChu || "--"}</p>
                                <p><strong>Trạng thái:</strong> {getTrangThaiLabel(popupPhieu.trangThai)}</p>

                                <table className="table" style={{ marginTop: 10 }}>
                                        <thead>
                                            <tr>
                                                <th>Sản phẩm</th>
                                                <th>Tồn hệ thống</th>
                                                <th>Thực tế</th>
                                                <th>Chênh lệch</th>
                                                <th>Phẩm chất</th>
                                                <th>Ghi chú</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {(popupPhieu.chiTietPhieuKiemKes || []).map((ct, i) => (
                                                <tr key={i}>
                                                    <td>{ct.tenSanPham || `SP#${ct.idSanPham}`}</td>
                                                    <td>{ct.soLuongHeThong}</td>
                                                    <td>{ct.soLuongThucTe}</td>
                                                    <td className={ct.soLuongThucTe !== ct.soLuongHeThong ? "text-red" : ""}>
                                                        {ct.soLuongThucTe - ct.soLuongHeThong}
                                                    </td>
                                                    <td>{ct.phamChat || "--"}</td>
                                                    <td>{ct.ghiChu || "--"}</td>
                                                </tr>
                                            ))}
                                        </tbody>

                                </table>

                                <button className="btn-close" onClick={() => setPopupPhieu(null)}>Đóng</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            </div>
        </div>
    );
};

export default QuanLyPhieuKiemKe;