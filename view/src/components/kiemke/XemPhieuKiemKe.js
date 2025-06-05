import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { utils, writeFile } from "xlsx";
import '../common/ModalPopup/popup-style.css';

const XemPhieuKiemKe = () => {
    const { idYeuCauKiemKe } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get(`https://localhost:5288/api/kiemke/theo-yeucau/${idYeuCauKiemKe}`)
            .then(res => setData(res.data))
            .catch(() => alert("❌ Không thể tải phiếu kiểm kê."));
    }, [idYeuCauKiemKe]);

    const handlePrint = () => window.print();

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

    const groupByProduct = {};
    (data.viTriSanPham || []).forEach(item => {
        if (!groupByProduct[item.tenSanPham]) groupByProduct[item.tenSanPham] = [];
        groupByProduct[item.tenSanPham].push(item);
    });

    return (
        <div className="popup-overlay">
            <div className="popup-box" style={{ maxWidth: 1200 }}>
                <h1 className="title">📄 Phiếu kiểm kê #{data.idKiemKe}</h1>
                <p><strong>📅 Ngày kiểm kê:</strong> {new Date(data.ngayKiemKe).toLocaleString()}</p>
                <p><strong>👤 Người kiểm:</strong> {data.tenNguoiThucHien || data.nguoiKiemKe || "--"}</p>
                <p><strong>🎯 Mục đích:</strong> {data.mucDich || "--"}</p>
                <p><strong>📍 Vị trí kiểm kê:</strong> {data.viTriKiemKe || "--"}</p>
                <p><strong>📝 Ghi chú:</strong> {data.ghiChu || "--"}</p>
                <p><strong>📊 Trạng thái:</strong> ✅ Đã kiểm</p>

                <div className="table-scroll">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th rowSpan="2">STT</th>
                                <th rowSpan="2">Sản phẩm</th>
                                <th colSpan="2">Vị trí lưu trữ</th>
                                <th rowSpan="2">Tồn hệ thống</th>
                                <th rowSpan="2">Thực tế</th>
                                <th rowSpan="2">Chênh lệch</th>
                                <th rowSpan="2">Phẩm chất</th>
                                <th rowSpan="2">Ghi chú</th>
                            </tr>
                            <tr>
                                <th>Vị trí</th>
                                <th>Số lượng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.chiTietPhieuKiemKes.map((ct, idx) => {
                                const posList = groupByProduct[ct.tenSanPham] || [];
                                return posList.length > 0 ? (
                                    posList.map((pos, i) => (
                                        <tr key={`${idx}-${i}`}>
                                            {i === 0 && (
                                                <>
                                                    <td rowSpan={posList.length}>{idx + 1}</td>
                                                    <td rowSpan={posList.length}>{ct.tenSanPham}</td>
                                                </>
                                            )}
                                            <td>{pos.viTri}</td>
                                            <td>{pos.soLuongTaiViTri}</td>
                                            {i === 0 && (
                                                <>
                                                    <td rowSpan={posList.length}>{ct.soLuongTheoHeThong}</td>
                                                    <td rowSpan={posList.length}>{ct.soLuongThucTe}</td>
                                                    <td rowSpan={posList.length} style={{ color: ct.soLuongThucTe !== ct.soLuongTheoHeThong ? "red" : undefined }}>
                                                        {ct.soLuongThucTe - ct.soLuongTheoHeThong}
                                                    </td>
                                                    <td rowSpan={posList.length}>{ct.phamChat || "--"}</td>
                                                    <td rowSpan={posList.length}>{ct.ghiChu || "--"}</td>
                                                </>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr key={idx}>
                                        <td>{idx + 1}</td>
                                        <td>{ct.tenSanPham}</td>
                                        <td colSpan="2"><em>Không có vị trí</em></td>
                                        <td>{ct.soLuongTheoHeThong}</td>
                                        <td>{ct.soLuongThucTe}</td>
                                        <td style={{ color: "red" }}>{ct.soLuongThucTe - ct.soLuongTheoHeThong}</td>
                                        <td>{ct.phamChat || "--"}</td>
                                        <td>{ct.ghiChu || "--"}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: 16 }}>
                    <button onClick={handlePrint} className="btn">🖨 In</button>
                    <button onClick={handleExport} className="btn">📥 Xuất Excel</button>
                    <button onClick={() => navigate("/quan-ly-yeu-cau-kiem-ke")} className="btn">Đóng</button>
                </div>
            </div>
        </div>
    );
};

export default XemPhieuKiemKe;
