import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./GoiyViTri.css";

const GoiyViTri = () => {
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [locations, setLocations] = useState([]);
    const [luuTruData, setLuuTruData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const { sanPhams } = location.state || { sanPhams: [] };
        setProducts(sanPhams);

        axios.get("https://localhost:5288/api/vitri")
            .then(res => setLocations(res.data || []))
            .catch(err => {
                console.error("Lỗi lấy vị trí kho:", err);
                setError("Không lấy được dữ liệu vị trí từ server.");
            });
    }, [location.state]);

    useEffect(() => {
        if (products.length > 0 && locations.length > 0) {
            setLoading(true);
            const worker = new Worker(new URL('../workers/ga.worker.js', import.meta.url), { type: 'module' });
            worker.postMessage({
                products,
                locations: JSON.parse(JSON.stringify(locations))
            });

            worker.onmessage = function (e) {
                if (e.data.success) {
                    setLuuTruData(e.data.data);
                } else {
                    setError("GA lỗi: " + e.data.error);
                }
                setLoading(false);
                worker.terminate();
            };
        }
    }, [products, locations]);

    const getVolumePerItem = (sp) => (sp.chieuDai || 1) * (sp.chieuRong || 1) * (sp.chieuCao || 1);

    const calculateUsedVolume = (excludeId = null) => {
        const used = {};
        for (const spId in luuTruData) {
            if (excludeId && parseInt(spId) === excludeId) continue;
            const sp = products.find(p => p.idSanPham === parseInt(spId));
            if (!sp) continue;
            const vol = getVolumePerItem(sp);
            for (const vt of luuTruData[spId]) {
                if (vt.viTri && vt.soLuong > 0) {
                    used[vt.viTri] = (used[vt.viTri] || 0) + vt.soLuong * vol;
                }
            }
        }
        return used;
    };

    const getFreeVolume = (loc, usedVolume) => {
        return (loc.sucChua || 0) - (loc.daDung || 0) - (usedVolume[loc.idViTri] || 0);
    };

    const getAvailableLocations = (sp) => {
        const volPerItem = getVolumePerItem(sp);
        const usedVolume = calculateUsedVolume(sp.idSanPham);
        return locations.filter(loc => {
            const freeVol = getFreeVolume(loc, usedVolume);
            const maxQty = Math.floor(freeVol / volPerItem);
            return maxQty > 0;
        });
    };

    const handleChange = (idSanPham, index, field, value) => {
        setLuuTruData(prev => {
            const updated = [...(prev[idSanPham] || [])];
            updated[index][field] = field === 'soLuong' ? parseInt(value) : value;
            return { ...prev, [idSanPham]: updated };
        });
    };

    const handleAddRow = (idSanPham) => {
        setLuuTruData(prev => {
            const updated = [...(prev[idSanPham] || [])];
            updated.push({ viTri: '', soLuong: 0 });
            return { ...prev, [idSanPham]: updated };
        });
    };

    const handleRemoveRow = (idSanPham, index) => {
        setLuuTruData(prev => {
            const updated = [...(prev[idSanPham] || [])];
            updated.splice(index, 1);
            return { ...prev, [idSanPham]: updated };
        });
    };

    const handleSave = async () => {
        const payload = [];

        for (let sp of products) {
            const chiTiet = luuTruData[sp.idSanPham] || [];
            for (let vt of chiTiet) {
                if (vt.viTri && vt.soLuong > 0) {
                    payload.push({
                        idSanPham: sp.idSanPham,
                        idViTri: parseInt(vt.viTri),
                        soLuong: vt.soLuong,
                        thoiGianLuu: new Date().toISOString() // 👈 Thêm dòng này!
                    });
                }
            }
        }

        console.log("Payload gửi:", payload);

        try {
            const res = await axios.post("https://localhost:5288/api/phieunhap/luu-vi-tri", payload);
            alert("✅ " + res.data.message);
        } catch (err) {
            console.error("❌ Lỗi:", err);
            alert("❌ Lỗi gửi API: " + err.response?.data?.message || err.message);
        }
    };

    return (
        <div className="container">
            <h2 className="title">🧬 Gợi ý vị trí lưu trữ sản phẩm (tối ưu bằng GA)</h2>
            {loading && <p>⏳ Đang chạy thuật toán GA...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && products.map((sp, index) => {
                const usedVolume = calculateUsedVolume(sp.idSanPham);
                return (
                    <div key={index} className="card">
                        <h3 className="card-title">📱 {sp.tenSanPham || `Sản phẩm ${sp.idSanPham}`} – SL: {sp.soLuong}</h3>
                        {(luuTruData[sp.idSanPham] || []).map((row, i) => (
                            <div key={i} className="row">
                                <select
                                    value={row.viTri}
                                    onChange={(e) => handleChange(sp.idSanPham, i, 'viTri', e.target.value)}
                                    className="select"
                                >
                                    <option value="">--Chọn vị trí--</option>
                                    {getAvailableLocations(sp).map(loc => (
                                        <option key={loc.idViTri} value={loc.idViTri}>
                                            {loc.day}-{loc.cot}-{loc.tang} (còn {getFreeVolume(loc, usedVolume)} cm³)
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    placeholder="Số lượng"
                                    value={row.soLuong}
                                    onChange={(e) => handleChange(sp.idSanPham, i, 'soLuong', e.target.value)}
                                    className="input"
                                />
                                <button className="remove-btn" onClick={() => handleRemoveRow(sp.idSanPham, i)}>❌</button>
                            </div>
                        ))}
                        <button className="add-btn" onClick={() => handleAddRow(sp.idSanPham)}>➕ Thêm vị trí</button>
                    </div>
                );
            })}
            {!loading && (
                <button className="save-btn" onClick={handleSave}>💾 Lưu vào kho</button>
            )}
        </div>
    );
};

export default GoiyViTri;
