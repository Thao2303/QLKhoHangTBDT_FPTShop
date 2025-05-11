import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./FormKiemKe.css";

const FormThucHienKiemKe = () => {
    const { idYeuCauKiemKe } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [input, setInput] = useState({}); // { "idSanPham-idViTri": { soLuongThucTe, phamChat } }

    useEffect(() => {
        axios.get(`https://localhost:5288/api/yeucaukiemke/${idYeuCauKiemKe}`)
            .then(res => setData(res.data))
            .catch(() => alert("❌ Không tải được dữ liệu yêu cầu kiểm kê."));
    }, [idYeuCauKiemKe]);

    const handleChange = (idSp, viTri, field, value) => {
        const key = `${idSp}-${viTri}`;
        setInput(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                [field]: field === "soLuongThucTe" ? Number(value) : value
            }
        }));
    };

    const handleSubmit = async () => {
        // Gộp các mục trùng idSanPham-idViTri
        const tempMap = {};
        for (const [key, value] of Object.entries(input)) {
            if (!value || isNaN(value.soLuongThucTe)) continue;
            if (!tempMap[key]) tempMap[key] = { ...value };
            else {
                tempMap[key].soLuongThucTe += value.soLuongThucTe;
                if (value.phamChat && !tempMap[key].phamChat?.includes(value.phamChat)) {
                    tempMap[key].phamChat += ", " + value.phamChat;
                }
            }
        }

        const payload = {
            idYeuCauKiemKe: data.idYeuCauKiemKe,
            idNguoiThucHien: 1,
            ngayKiemKe: new Date().toISOString(),
            ghiChu: data.ghiChu,
            chiTiet: Object.entries(tempMap).map(([key, value]) => {
                const [idSanPham, idViTri] = key.split("-");
                return {
                    idSanPham: parseInt(idSanPham),
                    idViTri: parseInt(idViTri),
                    soLuongThucTe: Number(value.soLuongThucTe || 0),
                    phamChat: value.phamChat || ""
                };
            }).filter(item => !isNaN(item.idSanPham) && !isNaN(item.idViTri))
        };

        console.log("Payload gửi:", payload);

        try {
            await axios.post("https://localhost:5288/api/kiemke/tao", payload);
            alert("✅ Gửi phiếu kiểm kê thành công");
            navigate("/quan-ly-phieu-kiem-ke");
        } catch (err) {
            alert("❌ Gửi thất bại");
            console.error(err);
        }
    };

    if (!data || !data.sanPhamList) return <p>Đang tải...</p>;

    const grouped = {};
    data.viTriSanPham.forEach(item => {
        if (!grouped[item.tenSanPham]) grouped[item.tenSanPham] = [];
        grouped[item.tenSanPham].push(item);
    });

    return (
        <div className="kiemke-wrapper">
            <h2>📋 Thực hiện kiểm kê chi tiết theo vị trí</h2>
            <table className="data-table">
                <thead>
                    <tr>
                        <th rowSpan="2">STT</th>
                        <th rowSpan="2">Tên sản phẩm</th>
                        <th colSpan="3">Vị trí</th>
                        <th rowSpan="2">Tổng tồn kho</th>
                        <th rowSpan="2">Tổng thực tế</th>
                        <th rowSpan="2">Chênh lệch</th>
                    </tr>
                    <tr>
                        <th>Vị trí</th>
                        <th>Tồn tại vị trí</th>
                        <th>Thực tế</th>
                        <th>Phẩm chất</th>
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

                        return list.map((sp, i) => (
                            <tr key={`${sp.idSanPham}-${sp.idViTri}`}>
                                {i === 0 && (
                                    <>
                                        <td rowSpan={list.length}>{idx + 1}</td>
                                        <td rowSpan={list.length}>{tenSp}</td>
                                    </>
                                )}
                                <td>{sp.viTri}</td>
                                <td>{sp.soLuongTaiViTri}</td>
                                <td>
                                    <input
                                        type="number"
                                        min="0"
                                        value={input[`${sp.idSanPham}-${sp.idViTri}`]?.soLuongThucTe || ""}
                                        onChange={e => handleChange(sp.idSanPham, sp.idViTri, "soLuongThucTe", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        value={input[`${sp.idSanPham}-${sp.idViTri}`]?.phamChat || ""}
                                        onChange={e => handleChange(sp.idSanPham, sp.idViTri, "phamChat", e.target.value)}
                                    />
                                </td>
                                {i === 0 && (
                                    <>
                                        <td rowSpan={list.length}>{tongKho}</td>
                                        <td rowSpan={list.length}>{tongThucTe}</td>
                                        <td rowSpan={list.length}>{chenhLech}</td>
                                    </>
                                )}
                            </tr>
                        ));
                    })}
                </tbody>
            </table>

            <button onClick={handleSubmit} className="submit-btn" style={{ marginTop: 20 }}>
                📨 Gửi phiếu kiểm kê
            </button>
        </div>
    );
};

export default FormThucHienKiemKe;