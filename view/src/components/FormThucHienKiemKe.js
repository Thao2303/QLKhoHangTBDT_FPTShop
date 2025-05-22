import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Autocomplete, TextField } from "@mui/material";
import "./popup-kiemke-style.css";

const FormThucHienKiemKe = () => {
    const { idYeuCauKiemKe } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [input, setInput] = useState({});
    const [phamChatOptions] = useState(["Tốt", "Hư hỏng", "Cần kiểm tra", "Mới"]);

    useEffect(() => {
        axios.get(`https://localhost:5288/api/yeucaukiemke/${idYeuCauKiemKe}`)
            .then(res => setData(res.data))
            .catch(() => alert("❌ Không tải được dữ liệu yêu cầu kiểm kê."));
    }, [idYeuCauKiemKe]);

    const handleChange = (idSp, idViTri, field, value) => {
        const key = `${idSp}-${idViTri}`;
        setInput(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                [field]: field === "soLuongThucTe" ? Number(value) : value
            }
        }));
    };

    const handleSubmit = async () => {
        const chiTietMap = new Map();

        Object.entries(input).forEach(([key, value]) => {
            const [idSanPham, idViTri] = key.split("-").map(Number);
            const mapKey = `${idSanPham}-${idViTri}`;

            if (!chiTietMap.has(mapKey)) {
                chiTietMap.set(mapKey, {
                    idSanPham,
                    idViTri,
                    soLuongThucTe: value.soLuongThucTe || 0,
                    phamChat: value.phamChat || ""
                });
            } else {
                const existing = chiTietMap.get(mapKey);
                existing.soLuongThucTe += value.soLuongThucTe || 0;
                if (value.phamChat && !existing.phamChat.includes(value.phamChat)) {
                    existing.phamChat += ", " + value.phamChat;
                }
            }
        });

        const chiTiet = Array.from(chiTietMap.values()).filter(item =>
            !isNaN(item.idSanPham) &&
            !isNaN(item.idViTri) &&
            item.soLuongThucTe > 0
        );

        if (chiTiet.length === 0) {
            alert("⚠️ Vui lòng nhập ít nhất 1 số lượng thực tế để gửi kiểm kê.");
            return;
        }

        const payload = {
            idYeuCauKiemKe: data.idYeuCauKiemKe,
            idNguoiThucHien: 1,
            ngayKiemKe: new Date().toISOString(),
            ghiChu: data.ghiChu,
            chiTiet
        };

        console.log("Payload gửi:", payload);

        if (!window.confirm("Bạn có chắc chắn muốn gửi phiếu kiểm kê?")) return;
        try {
            await axios.post("https://localhost:5288/api/kiemke/tao", payload);
            alert("✅ Gửi phiếu kiểm kê thành công");
            navigate("/quan-ly-yeu-cau-kiem-ke");
        } catch (err) {
            alert("❌ Gửi thất bại");
            console.error(err);
        }
    };

    if (!data || !data.viTriSanPham) return null;

    const grouped = {};
    const validViTri = data.viTriSanPham.filter(v => v.soLuongTaiViTri > 0);

    validViTri.forEach(item => {
        if (!grouped[item.tenSanPham]) grouped[item.tenSanPham] = [];
        grouped[item.tenSanPham].push(item);
    });

    const handlePrint = () => window.print();
    const handleExportExcel = async () => {
        const { utils, writeFile } = await import("xlsx");
        const rows = [];
        Object.entries(grouped).forEach(([tenSp, list], idx) => {
            const idSanPham = list[0].idSanPham;
            const tongKho = data.sanPhamList?.find(sp => sp.idSanPham === idSanPham)?.soLuongHienCon || 0;
            const tongThucTe = list.reduce((sum, sp) => sum + (input[`${sp.idSanPham}-${sp.idViTri}`]?.soLuongThucTe || 0), 0);
            const chenhLech = tongThucTe - tongKho;
            rows.push({
                STT: idx + 1,
                "Sản phẩm": tenSp,
                "Tổng tồn kho": tongKho,
                "Tổng thực tế": tongThucTe,
                "Chênh lệch": chenhLech
            });
        });
        const ws = utils.json_to_sheet(rows);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "KiemKe");
        writeFile(wb, `PhieuKiemKe_YC${idYeuCauKiemKe}.xlsx`);
    };

    return (
        <div className="popup-overlay">
            <button
                onClick={() => navigate("/quan-ly-yeu-cau-kiem-ke")}
                style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    fontSize: "20px",
                    background: "none",
                    border: "none",
                    cursor: "pointer"
                }}
                title="Đóng"
            >
                ×
            </button>

            <div className="popup-box" style={{ maxWidth: 1200 }}>
                <button
                    onClick={() => navigate("/quan-ly-yeu-cau-kiem-ke")}
                    style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        fontSize: "20px",
                        background: "none",
                        border: "none",
                        cursor: "pointer"
                    }}
                    title="Đóng"
                >
                    ×
                </button>

            
                <h1 className="title">📋 Thực hiện kiểm kê chi tiết theo vị trí</h1>
                <div className="table-scroll">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th rowSpan="2">STT</th>
                                <th rowSpan="2">Tên sản phẩm</th>
                                <th colSpan="3">Vị trí</th>
                                <th rowSpan="2">Tổng tồn kho</th>
                                <th rowSpan="2">Tổng thực tế</th>
                                <th rowSpan="2">Chênh lệch</th>
                                <th rowSpan="2">Phẩm chất</th>
                            </tr>
                            <tr>
                                <th>Vị trí</th>
                                <th>Tồn tại vị trí</th>
                                <th>Thực tế</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(grouped).map(([tenSp, list], idx) => {
                                const idSanPham = list[0].idSanPham;
                                const tongKho = data.sanPhamList?.find(sp => sp.idSanPham === idSanPham)?.soLuongHienCon || 0;
                                const tongThucTe = list.reduce((sum, sp) => {
                                    const val = input[`${sp.idSanPham}-${sp.idViTri}`]?.soLuongThucTe;
                                    return sum + (isNaN(val) ? 0 : val);
                                }, 0);
                                const chenhLech = tongThucTe - tongKho;

                                return list.map((sp, i) => {
                                    const key = `${sp.idSanPham}-${sp.idViTri}`;
                                    return (
                                        <tr key={key} style={{ backgroundColor: chenhLech !== 0 && i === 0 ? 'white' : undefined }}>
                                            {i === 0 && (
                                                <>
                                                    <td rowSpan={list.length}>{idx + 1}</td>
                                                    <td rowSpan={list.length}><b>{tenSp}</b></td>
                                                </>
                                            )}
                                            <td>{sp.viTri}</td>
                                            <td>{sp.soLuongTaiViTri}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={input[key]?.soLuongThucTe || ""}
                                                    onChange={e => handleChange(sp.idSanPham, sp.idViTri, "soLuongThucTe", e.target.value)}
                                                />
                                            </td>
                                            {i === 0 && (
                                                <>
                                                    <td rowSpan={list.length}>{tongKho}</td>
                                                    <td rowSpan={list.length}>{tongThucTe}</td>
                                                    <td rowSpan={list.length} style={{ color: chenhLech !== 0 ? "red" : undefined }}>{chenhLech}</td>
                                                    <td rowSpan={list.length}>
                                                        <Autocomplete
                                                            options={phamChatOptions}
                                                            value={input[key]?.phamChat || ""}
                                                            onChange={(e, val) => handleChange(sp.idSanPham, sp.idViTri, "phamChat", val || "")}
                                                            renderInput={(params) => <TextField {...params} variant="standard" label="Chọn phẩm chất" />}
                                                        />
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    );
                                });
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="popup-actions">
                    <button onClick={handleSubmit} className="btn btn-primary">📨 Gửi phiếu kiểm kê</button>
                    <button onClick={() => navigate("/quan-ly-yeu-cau-kiem-ke")}>Huỷ</button>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button onClick={handlePrint} className="btn">🖨 In</button>
                    <button onClick={handleExportExcel} className="btn">📥 Xuất Excel</button>
                </div>
            </div>
        </div>
    );
};

export default FormThucHienKiemKe;
