import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Autocomplete, TextField } from "@mui/material";
import Navbar from '../common/Navbar/Navbar';
import Sidebar from '../common/Sidebar/Sidebar';
import { FaHome, FaFileAlt, FaClipboardCheck } from "react-icons/fa";
import '../common/ModalPopup/popup-kiemke-style.css';

const FormThucHienKiemKe = () => {
    const { idYeuCauKiemKe } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [input, setInput] = useState({});
    const [phamChatOptions] = useState(["Tốt", "Hư hỏng", "Cần kiểm tra", "Mới"]);
    const nguoiDung = JSON.parse(localStorage.getItem("user"));
    const idNguoiThucHien = nguoiDung?.idTaiKhoan;

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await axios.get(`https://localhost:5288/api/yeucaukiemke/${idYeuCauKiemKe}`);
                const ycData = res.data;

                try {
                    const res2 = await axios.get(`https://localhost:5288/api/kiemke/theo-yeucau/${idYeuCauKiemKe}`);
                    const chiTiet = res2.data?.chiTietPhieuKiemKes || [];
                    const viTri = res2.data?.viTriSanPham || [];

                    // Tạo map input từ chi tiết kiểm kê
                    const inputMap = {};
                    chiTiet.forEach(ct => {
                        const key = `${ct.idSanPham}-${ct.idViTri}`;
                        inputMap[key] = {
                            soLuongThucTe: ct.soLuongThucTe,
                            phamChat: ct.phamChat,
                            ghiChu: ct.ghiChu,
                            touched: true // ✅ để biết đã từng nhập, kể cả là 0
                        };


                    });

                    // Kết hợp tất cả vị trí (gốc + nháp)
                    const keySet = new Set([
                        ...viTri.map(v => `${v.idSanPham}-${v.idViTri}`),
                        ...chiTiet.map(ct => `${ct.idSanPham}-${ct.idViTri}`)
                    ]);

                    const viTriSanPhamFull = Array.from(keySet).map(key => {
                        const [idSanPham, idViTri] = key.split("-").map(Number);
                        const goc = viTri.find(v => v.idSanPham === idSanPham && v.idViTri === idViTri);
                        const ct = chiTiet.find(c => c.idSanPham === idSanPham && c.idViTri === idViTri);

                        return {
                            idSanPham,
                            idViTri,
                            tenSanPham: goc?.tenSanPham || ct?.tenSanPham || "❓",
                            viTri: goc?.viTri || "❓",
                            soLuongTaiViTri: goc?.soLuongTaiViTri ?? 0
                        };
                    });

                    setData({
                        ...ycData,
                        viTriSanPham: viTriSanPhamFull,
                        sanPhamList: res2.data.sanPhamList
                    });
                    setInput(inputMap);
                } catch {
                    console.info("⏳ Không có dữ liệu kiểm kê nháp.");
                    setData(ycData);
                }
            } catch {
                alert("❌ Không tải được dữ liệu yêu cầu kiểm kê.");
            }
        };

        fetchAll();
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
                    phamChat: value.phamChat || "",
                    ghiChu: value.ghiChu || ""
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

    const handleSaveDraft = async () => {
        const chiTiet = data.viTriSanPham.map(v => {
            const key = `${v.idSanPham}-${v.idViTri}`;
            const value = input[key] || {};

            return {
                idSanPham: v.idSanPham,
                idViTri: v.idViTri,
                // 👇 chỉ thêm nếu người dùng đã nhập
                soLuongThucTe: typeof value.soLuongThucTe === "number" ? value.soLuongThucTe : null,
                phamChat: value.phamChat || "",
                ghiChu: value.ghiChu || ""
            };
        });

        const payload = {
            idYeuCauKiemKe: data.idYeuCauKiemKe,
            idNguoiThucHien: idNguoiThucHien,
            ngayKiemKe: new Date().toISOString(),
            ghiChu: data.ghiChu,
            chiTiet
        };

        try {
            await axios.post("https://localhost:5288/api/kiemke/luu-nhap", payload);
            alert("💾 Đã lưu nháp kiểm kê");
            navigate("/quan-ly-yeu-cau-kiem-ke");
        } catch (err) {
            alert("❌ Lỗi khi lưu nháp");
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

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <Navbar />
                <div className="breadcrumb">
                    <Link to="/dashboard"><FaHome /> Trang chủ</Link>
                    <span>/</span>
                    <Link to="/quan-ly-yeu-cau-kiem-ke"><FaFileAlt /> Yêu cầu kiểm kê</Link>
                    <span>/</span>
                    <span><FaClipboardCheck /> Thực hiện kiểm kê</span>
                </div>

                <div className="form-container">
                    <h1 className="title">📋 THỰC HIỆN KIỂM KÊ SẢN PHẨM THEO VỊ TRÍ</h1>

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
                                    <th rowSpan="2">Ghi chú</th>
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
                                    const tongThucTe = list.reduce((sum, sp) => sum + (input[`${sp.idSanPham}-${sp.idViTri}`]?.soLuongThucTe || 0), 0);
                                    const chenhLech = tongThucTe - tongKho;

                                    return list.map((sp, i) => {
                                        const key = `${idSanPham}-${sp.idViTri}`;
                                        const firstKey = `${idSanPham}-${list[0].idViTri}`;

                                        return (
                                            <tr key={key}>
                                                {i === 0 && (
                                                    <>
                                                        <td rowSpan={list.length}>{idx + 1}</td>
                                                        <td rowSpan={list.length}>{tenSp}</td>
                                                    </>
                                                )}
                                                <td>{sp.viTri}</td>
                                                <td>{sp.soLuongTaiViTri}</td>
                                                <td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={
                                                                typeof input[key]?.soLuongThucTe === "number"
                                                                    ? input[key].soLuongThucTe
                                                                    : ""
                                                            }
                                                            onChange={(e) =>
                                                                handleChange(sp.idSanPham, sp.idViTri, "soLuongThucTe", e.target.value)
                                                            }
                                                        />
                                                        {typeof input[key]?.soLuongThucTe !== "number" && (
                                                            <span title="Chưa nhập số lượng">⚠️</span>
                                                        )}

                                                    </td>

                                                </td>
                                                {i === 0 && (
                                                    <>
                                                        <td rowSpan={list.length}>{tongKho}</td>
                                                        <td rowSpan={list.length}>{tongThucTe}</td>
                                                        <td rowSpan={list.length} style={{ color: chenhLech !== 0 ? "red" : undefined }}>{chenhLech}</td>
                                                        <td rowSpan={list.length}>
                                                            <Autocomplete
                                                                options={phamChatOptions}
                                                                value={input[firstKey]?.phamChat || ""}
                                                                onChange={(e, val) =>
                                                                    handleChange(idSanPham, list[0].idViTri, "phamChat", val || "")
                                                                }
                                                                renderInput={(params) => (
                                                                    <TextField {...params} variant="standard" label="Chọn phẩm chất" />
                                                                )}
                                                            />
                                                        </td>
                                                        <td rowSpan={list.length}>
                                                            <input
                                                                type="text"
                                                                value={input[firstKey]?.ghiChu || ""}
                                                                onChange={(e) =>
                                                                    handleChange(idSanPham, list[0].idViTri, "ghiChu", e.target.value)
                                                                }
                                                                placeholder="Ghi chú..."
                                                                style={{ width: "100%" }}
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
                    <div className="action-buttons center-btn">
                        <button onClick={handleSaveDraft} className="btn">💾 Lưu nháp</button>
                        <button onClick={handleSubmit} className="btn btn-primary">📨 Gửi phiếu kiểm kê</button>
                        <button onClick={() => navigate("/quan-ly-yeu-cau-kiem-ke")} className="btn btn-danger">❌ Huỷ</button>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default FormThucHienKiemKe;