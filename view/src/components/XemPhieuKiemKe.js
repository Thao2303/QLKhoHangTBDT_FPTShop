import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { utils, writeFile } from "xlsx";
import "./FormKiemKe.css";
import "./print.css";

const XemPhieuKiemKe = () => {
    const { idYeuCauKiemKe } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get(`https://localhost:5288/api/kiemke/theo-yeucau/${idYeuCauKiemKe}`)
            .then(res => setData(res.data))
            .catch(() => alert("❌ Không thể tải phiếu kiểm kê."));
    }, [idYeuCauKiemKe]);

    const handleIn = () => window.print();

    const handleXuatExcel = () => {
        if (!data) return;

        const rows = data.chiTietPhieuKiemKes.map((ct, idx) => ({
            STT: idx + 1,
            "Sản phẩm": ct.tenSanPham,
            "Tồn kho hệ thống": ct.soLuongTheoHeThong,
            "Thực tế": ct.soLuongThucTe,
            "Chênh lệch": ct.soLuongThucTe - ct.soLuongTheoHeThong,
            "Phẩm chất": ct.phamChat || "--"
        }));

        const worksheet = utils.json_to_sheet(rows);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, "PhieuKiemKe");

        writeFile(workbook, `PhieuKiemKe_${idYeuCauKiemKe}.xlsx`);
    };

    if (!data) return <p>Đang tải phiếu kiểm kê...</p>;

    // Gom nhóm vị trí lưu trữ nếu có
    const groupByProduct = {};
    (data.viTriSanPham || []).forEach(item => {
        if (!groupByProduct[item.tenSanPham]) groupByProduct[item.tenSanPham] = [];
        groupByProduct[item.tenSanPham].push(item);
    });

    return (
        <div className="kiemke-wrapper">
            <h2>📋 Phiếu kiểm kê #{data.idKiemKe}</h2>
            <p><strong>📅 Ngày kiểm kê:</strong> {new Date(data.ngayKiemKe).toLocaleString()}</p>
            <p><strong>👤 Người kiểm:</strong> {data.nguoiKiemKe}</p>
            <p><strong>📝 Ghi chú:</strong> {data.ghiChu}</p>
            <p><strong>📊 Trạng thái:</strong> ✅ Đã kiểm</p>

            <h3>📦 Chi tiết sản phẩm kiểm kê</h3>
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
                                            <td rowSpan={posList.length} style={{ color: "red" }}>
                                                {(ct.soLuongThucTe ?? 0) - (ct.soLuongTheoHeThong ?? 0)}
                                            </td>
                                            <td rowSpan={posList.length}>{ct.phamChat || "--"}</td>
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
                                <td style={{ color: "red" }}>
                                    {(ct.soLuongThucTe ?? 0) - (ct.soLuongTheoHeThong ?? 0)}
                                </td>
                                <td>{ct.phamChat || "--"}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }} className="print-hide">
                <button onClick={handleIn} className="submit-btn">🖨 In</button>
                <button onClick={handleXuatExcel} className="submit-btn">📥 Xuất Excel</button>
            </div>
        </div>
    );
};

export default XemPhieuKiemKe;