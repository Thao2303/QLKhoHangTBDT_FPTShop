import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from '../common/Sidebar/Sidebar';
import Navbar from '../common/Navbar/Navbar';
import "../vitri/GoiyViTri.css";

const SuaViTriLuuTru = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [products, setProducts] = useState(state?.sanPhams || []);
    const [locations, setLocations] = useState([]);
    const [luuTruData, setLuuTruData] = useState({});
    const [error, setError] = useState("");
    const [isEditable, setIsEditable] = useState(true);

    // 1. Load danh sách vị trí
    useEffect(() => {
        axios.get("https://qlkhohangtbdt-fptshop-be2.onrender.com/api/vitri")
            .then(res => setLocations(res.data || []))
            .catch(() => setError("Không lấy được danh sách vị trí"));
    }, []);

    // 2. Khi đã có vị trí và sản phẩm, mới chạy GA
    useEffect(() => {
        if (state?.sanPhams?.length > 0 && locations.length > 0) {
            const fetchOldLuuTru = async () => {
                const result = {};

                // 🎯 Load lại daDung dựa trên lưu trữ thật
                const viTriUsage = {};
                try {
                    const resLuuTru = await axios.get("https://qlkhohangtbdt-fptshop-be2.onrender.com/api/phieunhap/luu-tru");
                    for (const row of resLuuTru.data) {
                        if (!viTriUsage[row.idViTri]) viTriUsage[row.idViTri] = 0;
                        const sp = state.sanPhams.find(p => p.idSanPham === row.idSanPham);
                        if (!sp) continue;
                        const vol = (sp.chieuDai || 1) * (sp.chieuRong || 1) * (sp.chieuCao || 1);
                        viTriUsage[row.idViTri] += row.soLuong * vol;
                    }
                } catch (err) {
                    console.error("❌ Lỗi khi lấy dữ liệu ChiTietLuuTru:", err);
                }
                const updatedLocations = locations.map(loc => ({
                    ...loc,
                    daDung: viTriUsage[loc.idViTri] || 0
                }));

                for (let sp of state.sanPhams) {
                    try {
                        const res = await axios.get(`https://qlkhohangtbdt-fptshop-be2.onrender.com/api/chitietluutru/chitietluutru/sanpham/${sp.idSanPham}`);
                        const oldLuuTru = res.data || [];
                        const oldQty = oldLuuTru.reduce((sum, r) => sum + (r.soLuong || 0), 0);
                        const qtyDiff = sp.soLuong - oldQty;

                        console.log(`🔎 SP ${sp.tenSanPham || sp.idSanPham} | Cũ: ${oldQty} | Mới: ${sp.soLuong} | Diff: ${qtyDiff}`);

                        result[sp.idSanPham] = oldLuuTru.map(x => ({
                            viTri: x.idViTri,
                            soLuong: x.soLuong
                        }));

                        if (qtyDiff < 0) {
                            let remaining = sp.soLuong;
                            const trimmed = [];
                            for (const r of result[sp.idSanPham]) {
                                if (remaining <= 0) break;
                                const keptQty = Math.min(remaining, r.soLuong);
                                trimmed.push({ viTri: r.viTri, soLuong: keptQty });
                                remaining -= keptQty;
                            }
                            result[sp.idSanPham] = trimmed;
                        }

                        if (qtyDiff > 0) {
                            const oldLocIds = oldLuuTru.map(x => x.idViTri);
                            const extra = await new Promise((resolve, reject) => {
                                const worker = new Worker(new URL('../../workers/ga.worker.js', import.meta.url), { type: 'module' });
                                worker.postMessage({
                                    products: [{ ...sp, soLuong: qtyDiff }],
                                    locations: [...updatedLocations],
                                    oldPositions: { [sp.idSanPham]: oldLocIds }
                                });
                                worker.onmessage = (e) => {
                                    if (e.data.success) resolve(e.data.data);
                                    else reject(e.data.error);
                                    worker.terminate();
                                };
                            });

                            if (extra[sp.idSanPham]) {
                                const newRows = extra[sp.idSanPham].map(x => ({ ...x, tuGA: true }));
                                result[sp.idSanPham] = [...result[sp.idSanPham], ...newRows];
                                console.log("✨ Đề xuất thêm vị trí mới từ GA:", newRows);
                            }
                        }
                    } catch (err) {
                        console.error(`❌ Lỗi khi xử lý SP ${sp.idSanPham}:`, err);
                    }
                }

                setLuuTruData(result);
            };

            fetchOldLuuTru();
        }
    }, [state, locations]);

    const handleChange = (idSanPham, index, field, value) => {
        setLuuTruData(prev => {
            const updated = [...(prev[idSanPham] || [])];
            const updatedRow = { ...updated[index], [field]: field === 'soLuong' ? parseInt(value) : value };
            updated[index] = updatedRow;
            return { ...prev, [idSanPham]: updated };
        });
    };

    const handleAddRow = (idSanPham) => {
        if (!isEditable) return;
        setLuuTruData(prev => ({
            ...prev,
            [idSanPham]: [...(prev[idSanPham] || []), { viTri: "", soLuong: 1 }]
        }));
    };

    const handleRemoveRow = (idSanPham, index) => {
        if (!isEditable) return;
        const updated = [...(luuTruData[idSanPham] || [])];
        updated.splice(index, 1);
        setLuuTruData(prev => ({ ...prev, [idSanPham]: updated }));
    };

    const handleSave = async () => {
        if (!isEditable) return;

        const payload = [];
        for (let sp of products) {
            for (let vt of (luuTruData[sp.idSanPham] || [])) {
                if (vt.viTri && vt.soLuong > 0) {
                    payload.push({
                        idSanPham: sp.idSanPham,
                        idViTri: parseInt(vt.viTri),
                        soLuong: parseInt(vt.soLuong),
                        thoiGianLuu: new Date().toISOString()
                    });
                }
            }
        }

        try {
            const res = await axios.post("https://qlkhohangtbdt-fptshop-be2.onrender.com/api/phieunhap/luu-vi-tri", payload);
            alert("✅ " + res.data.message);
            navigate("/quanlyphieunhap");
        } catch (err) {
            alert("❌ Lỗi khi lưu vị trí");
        }
    };

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <Navbar />
                <h2 className="title">📦 SỬA VỊ TRÍ LƯU TRỮ SẢN PHẨM</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}

                {products.map((sp, idx) => (
                    <div key={idx} className="card">
                        <h3 className="card-title">
                            - {sp.tenSanPham} - Số lượng: {sp.soLuong}
                            <span style={{ fontSize: 14, fontWeight: 'normal' }}>
                                ({(luuTruData[sp.idSanPham] || []).reduce((sum, r) => sum + r.soLuong, 0)} đã phân)
                            </span>
                        </h3>

                        {(luuTruData[sp.idSanPham] || []).map((row, i) => (
                            <div key={`${sp.idSanPham}-${i}-${row.viTri || i}`} className={`row ${row.tuGA ? 'highlight-ga' : ''}`}>
                                <select value={row.viTri} onChange={(e) => handleChange(sp.idSanPham, i, 'viTri', e.target.value)} className="select" disabled={!isEditable}>
                                    <option value="">--Chọn vị trí--</option>
                                    {locations.map(loc => (
                                        <option key={loc.idViTri} value={loc.idViTri}>
                                            {loc.day}-{loc.cot}-{loc.tang} (còn {loc.sucChua - loc.daDung} cm³)
                                        </option>
                                    ))}
                                </select>
                                <input type="number" className="input" value={row.soLuong} onChange={(e) => handleChange(sp.idSanPham, i, 'soLuong', e.target.value)} disabled={!isEditable} />
                                {isEditable && (
                                    <button className="remove-btn" onClick={() => handleRemoveRow(sp.idSanPham, i)}>❌</button>
                                )}
                            </div>
                        ))}
                        {isEditable && <button className="add-btn" onClick={() => handleAddRow(sp.idSanPham)}>➕ Thêm vị trí</button>}
                    </div>
                ))}

                {isEditable && <button className="save-btn" onClick={handleSave}>💾 Lưu vị trí</button>}
            </div>
        </div>
    );
};

export default SuaViTriLuuTru;
