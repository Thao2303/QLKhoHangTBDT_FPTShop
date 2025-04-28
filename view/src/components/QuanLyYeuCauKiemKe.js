// 📁 QuanLyYeuCauKiemKe.js
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const QuanLyYeuCauKiemKe = () => {
    const [dsYeuCau, setDsYeuCau] = useState([]);
    const [popupData, setPopupData] = useState(null);
    const navigate = useNavigate();
    const API = "https://localhost:5288/api/yeucaukiemke";

    useEffect(() => {
        fetch(API)
            .then(res => res.json())
            .then(setDsYeuCau)
            .catch(console.error);
    }, []);

    const handleDuyet = async (id) => {
        if (!window.confirm("Duyệt yêu cầu này?")) return;
        await fetch(`${API}/duyet/${id}`, { method: "PUT" });
        const res = await fetch(API);
        const data = await res.json();
        setDsYeuCau(data);
    };

    const handleXoa = async (id) => {
        if (!window.confirm("Xoá yêu cầu này?")) return;
        await fetch(`${API}/${id}`, { method: "DELETE" });
        setDsYeuCau(prev => prev.filter(x => x.idYeuCauKiemKe !== id));
    };

    const handlePopup = (item) => setPopupData(item);

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <Navbar />
                <div className="container">
                    <h1>📋 Quản lý yêu cầu kiểm kê</h1>
                    <button onClick={() => navigate("/them-yeu-cau-kiem-ke")}>+ Tạo yêu cầu</button>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã yêu cầu</th>
                                <th>Người tạo</th>
                                <th>Thời gian</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dsYeuCau.map((y, i) => (
                                <tr key={y.idYeuCauKiemKe}>
                                    <td>{i + 1}</td>
                                    <td>{y.idYeuCauKiemKe}</td>
                                    <td>{y.nguoiTao?.tenTaiKhoan || 'Không rõ'}</td>
                                    <td>{new Date(y.thoiGianTao).toLocaleString()}</td>
                                    <td>{y.trangThai === 1 ? '🕒 Chờ duyệt' : '✅ Đã duyệt'}</td>
                                    <td>
                                        <button onClick={() => handlePopup(y)}>👁</button>
                                        <button onClick={() => navigate(`/sua-yeu-cau-kiem-ke/${y.idYeuCauKiemKe}`)}>✏️</button>
                                        <button onClick={() => handleXoa(y.idYeuCauKiemKe)}>🗑</button>
                                        {y.trangThai === 1 && <button onClick={() => handleDuyet(y.idYeuCauKiemKe)}>✔️ Duyệt</button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {popupData && (
                        <div className="popup">
                            <div className="popup-inner">
                                <h3>Chi tiết yêu cầu #{popupData.idYeuCauKiemKe}</h3>
                                <p><strong>Người tạo:</strong> {popupData.nguoiTao?.tenTaiKhoan || 'Không rõ'}</p>
                                <p><strong>Thời gian:</strong> {new Date(popupData.thoiGianTao).toLocaleString()}</p>
                                <p><strong>Ghi chú:</strong> {popupData.ghiChu || 'Không có'}</p>
                                <p><strong>Trạng thái:</strong> {popupData.trangThai === 1 ? 'Chờ duyệt' : 'Đã duyệt'}</p>
                                <button onClick={() => setPopupData(null)}>Đóng</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuanLyYeuCauKiemKe;