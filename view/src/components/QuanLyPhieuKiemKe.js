// 📁 QuanLyPhieuKiemKe.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const QuanLyPhieuKiemKe = () => {
    const [data, setData] = useState([]);
    const [popup, setPopup] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("https://localhost:5288/api/kiemke")
            .then(res => res.json())
            .then(setData)
            .catch(console.error);
    }, []);

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <Navbar />
                <div className="container">
                    <h1>📋 Quản lý phiếu kiểm kê</h1>
                    <button onClick={() => navigate("/thuc-hien-kiem-ke")}>+ Thực hiện kiểm kê</button>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã phiếu</th>
                                <th>Yêu cầu kiểm kê</th>
                                <th>Người thực hiện</th>
                                <th>Ngày kiểm kê</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((p, i) => (
                                <tr key={p.idKiemKe}>
                                    <td>{i + 1}</td>
                                    <td>{p.idKiemKe}</td>
                                    <td>{p.idYeuCauKiemKe}</td>
                                    <td>{p.nguoiThucHien?.tenTaiKhoan || "-"}</td>
                                    <td>{new Date(p.ngayKiemKe).toLocaleDateString()}</td>
                                    <td>
                                        <button onClick={() => setPopup(p)}>👁 Xem</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {popup && (
                        <div className="popup">
                            <div className="popup-inner">
                                <h3>📝 Phiếu kiểm kê #{popup.idKiemKe}</h3>
                                <p><strong>Người thực hiện:</strong> {popup.nguoiThucHien?.tenTaiKhoan}</p>
                                <p><strong>Ngày kiểm kê:</strong> {new Date(popup.ngayKiemKe).toLocaleString()}</p>
                                <p><strong>Ghi chú:</strong> {popup.ghiChu || "Không có"}</p>
                                <p><strong>Yêu cầu kiểm kê:</strong> #{popup.idYeuCauKiemKe}</p>
                                <hr />
                                <h4>Chi tiết sản phẩm</h4>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Sản phẩm</th>
                                            <th>Hệ thống</th>
                                            <th>Thực tế</th>
                                            <th>Chênh lệch</th>
                                            <th>Phẩm chất</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {popup.chiTietKiemKe?.map((ct, idx) => (
                                            <tr key={idx}>
                                                <td>{ct.sanPham?.tenSanPham || ct.idSanPham}</td>
                                                <td>{ct.soLuongTheoHeThong}</td>
                                                <td>{ct.soLuongThucTe}</td>
                                                <td>{ct.soLuongThucTe - ct.soLuongTheoHeThong}</td>
                                                <td>{ct.phamChat}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button onClick={() => setPopup(null)}>Đóng</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuanLyPhieuKiemKe;
