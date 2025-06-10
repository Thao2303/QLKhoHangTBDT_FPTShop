import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { utils, writeFile } from "xlsx";
import "../nhapkho/QuanLyPhieuNhapKho.css";

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

    const groupedSanPham = data.chiTietPhieuKiemKes.reduce((acc, curr) => {
        const id = curr.idSanPham;
        if (!acc[id]) {
            acc[id] = {
                idSanPham: id,
                tenSanPham: curr.tenSanPham,
                tongThucTe: 0,
                tongHeThong: 0,
                phamChat: [],
                ghiChu: []
            };
        }
        acc[id].tongThucTe += curr.soLuongThucTe || 0;
        acc[id].tongHeThong += curr.soLuongTheoHeThong || 0;
        if (curr.phamChat) acc[id].phamChat.push(curr.phamChat);
        if (curr.ghiChu) acc[id].ghiChu.push(curr.ghiChu);
        return acc;
    }, {});

    return (
        <div className="popup" style={{
            zIndex: 9999,
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <div className="popup-inner" style={{
                background: "#fff",
                padding: 24,
                borderRadius: 8,
                width: "90%",
                maxWidth: 1000,
                maxHeight: "90vh",
                overflowY: "auto"
            }}>
                <h3 style={{
                    fontSize: 20,
                    fontWeight: 600,
                    borderBottom: "2px solid #ccc",
                    paddingBottom: 6,
                    marginBottom: 16
                }}>📋 CHI TIẾT PHIẾU KIỂM KÊ #{data.idKiemKe}</h3>

                <div className="info-row"><label>👤 Người kiểm:</label> {data.tenNguoiThucHien || data.nguoiKiemKe || "--"}</div>
                <div className="info-row"><label>📅 Ngày kiểm kê:</label> {new Date(data.ngayKiemKe).toLocaleString()}</div>
                <div className="info-row"><label>🎯 Mục đích:</label> {data.mucDich || "--"}</div>
                <div className="info-row"><label>📍 Vị trí kiểm kê:</label> {data.viTriKiemKe || "--"}</div>
                <div className="info-row"><label>📝 Ghi chú:</label> {data.ghiChu || "--"}</div>
                <div className="info-row"><label>📊 Trạng thái:</label> ✅ Đã kiểm</div>

                <h4 style={{ color: "#c0392b", marginTop: 16 }}>📦 Danh sách sản phẩm kiểm kê:</h4>

                <table className="sub-table">
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th>Vị trí</th>
                            <th>Số lượng tại vị trí</th>
                            <th>Tồn hệ thống</th>
                            <th>Thực tế</th>
                            <th>Chênh lệch</th>
                            <th>Phẩm chất</th>
                            <th>Ghi chú</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(groupedSanPham).map((ct) => {
                            const posList = (data.viTriSanPham || []).filter(v => v.idSanPham === ct.idSanPham);
                            return (
                                <React.Fragment key={ct.idSanPham}>
                                    {posList.length > 0 ? (
                                        posList.map((pos, i) => (
                                            <tr key={`${ct.idSanPham}-${i}`}>
                                                {i === 0 && <td rowSpan={posList.length}>{ct.tenSanPham}</td>}
                                                <td>{pos.viTri}</td>
                                                <td>{pos.soLuongTaiViTri}</td>
                                                {i === 0 && (
                                                    <>
                                                        <td rowSpan={posList.length}>{ct.tongHeThong}</td>
                                                        <td rowSpan={posList.length}>{ct.tongThucTe}</td>
                                                        <td rowSpan={posList.length} style={{ color: ct.tongThucTe !== ct.tongHeThong ? "red" : undefined }}>
                                                            {ct.tongThucTe - ct.tongHeThong}
                                                        </td>
                                                        <td rowSpan={posList.length}>{ct.phamChat.join(", ") || "--"}</td>
                                                        <td rowSpan={posList.length}>{ct.ghiChu.join(" | ") || "--"}</td>
                                                    </>
                                                )}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td>{ct.tenSanPham}</td>
                                            <td colSpan={2}><em>Không có vị trí</em></td>
                                            <td>{ct.tongHeThong}</td>
                                            <td>{ct.tongThucTe}</td>
                                            <td style={{ color: "red" }}>{ct.tongThucTe - ct.tongHeThong}</td>
                                            <td>{ct.phamChat.join(", ") || "--"}</td>
                                            <td>{ct.ghiChu.join(" | ") || "--"}</td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>

                <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                    <button onClick={handlePrint} className="search-button">🖨 In</button>
                    <button onClick={handleExport} className="reset-button">📥 Xuất Excel</button>
                    <button onClick={() => navigate("/quan-ly-yeu-cau-kiem-ke")} className="reset-button">Đóng</button>
                </div>
            </div>
        </div>
    );
};

export default XemPhieuKiemKe;
