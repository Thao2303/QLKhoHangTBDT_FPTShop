import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./GoiyViTri.css";
import Sidebar from '../common/Sidebar/Sidebar';
import Navbar from '../common/Navbar/Navbar';
import { Link } from "react-router-dom";
import { FaHome, FaFileAlt, FaPlus } from "react-icons/fa";
const GoiyViTri = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [locations, setLocations] = useState([]);
    const [luuTruData, setLuuTruData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { idPhieuNhap } = location.state || {};

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

    const [sanPhamList, setSanPhamList] = useState([]);

    useEffect(() => {
        const { sanPhams } = location.state || { sanPhams: [] };

        axios.get("https://localhost:5288/api/sanpham")
            .then(res => {
                const mapFullSP = sanPhams.map(sp => {
                    const matched = res.data.find(p => p.idSanPham === sp.idSanPham);
                    return {
                        ...sp,
                        ...matched, // 🔥 Lấy toàn bộ thông tin từ dữ liệu gốc (có hinhAnh)
                    };
                });
                setProducts(mapFullSP);

               
            });

        axios.get("https://localhost:5288/api/vitri")
            .then(res => setLocations(res.data || []))
            .catch(err => {
                console.error("Lỗi lấy vị trí kho:", err);
                setError("Không lấy được dữ liệu vị trí từ server.");
            });
    }, [location.state]);


    const [oldPositionsState, setOldPositionsState] = useState({});

    useEffect(() => {
        const fetchOldPositionsAndRunGA = async () => {
            try {
                const oldPositions = {};
                for (const sp of products) {
                    const res = await axios.get(`https://localhost:5288/api/chitietluutru/chitietluutru/sanpham/${sp.idSanPham}`);
                    oldPositions[sp.idSanPham] = res.data.map(x => x.idViTri);
                }

                setOldPositionsState(oldPositions); 

                setLoading(true);
                const worker = new Worker(new URL('../../workers/ga.worker.js', import.meta.url), { type: 'module' });
                worker.postMessage({
                    products,
                    locations: JSON.parse(JSON.stringify(locations)),
                    oldPositions
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
            } catch (err) {
                console.error("Lỗi khi fetch old positions:", err);
                setError("Không thể lấy thông tin vị trí đã lưu.");
            }
        };

        if (products.length > 0 && locations.length > 0) {
            fetchOldPositionsAndRunGA();
        }
    }, [products, locations]);

    const getVolumePerItem = (sp) => (sp.chieuDai || 1) * (sp.chieuRong || 1) * (sp.chieuCao || 1);
    const calculateFullUsedVolume = (luuTruData, products, exclude = null) => {
        const used = {};
        for (const spId in luuTruData) {
            const sp = products.find(p => p.idSanPham === parseInt(spId));
            if (!sp) continue;
            const vol = (sp.chieuDai || 1) * (sp.chieuRong || 1) * (sp.chieuCao || 1);

            for (let i = 0; i < luuTruData[spId].length; i++) {
                const row = luuTruData[spId][i];
                if (exclude && exclude.idSanPham === parseInt(spId) && exclude.index === i) continue;

                used[row.viTri] = (used[row.viTri] || 0) + row.soLuong * vol;
            }
        }
        return used;
    };




    const getFreeVolume = (loc, usedVolume) => {
        return (loc.sucChua || 0) - (loc.daDung || 0) - (usedVolume[loc.idViTri] || 0);
    };

    const handleChange = (idSanPham, index, field, value) => {
        setLuuTruData(prev => {
            const updated = [...(prev[idSanPham] || [])];
            updated[index][field] = field === 'soLuong' ? parseInt(value) : value;
            return { ...prev, [idSanPham]: updated };
        });
    };
    const getZoneFromLocation = (loc) => {
        if (!loc || !loc.day) return "";
        return loc.day.trim().toUpperCase(); // Ví dụ 'A'
    };

    const getRowFromLocation = (loc) => {
        if (!loc || typeof loc.cot === 'undefined') return "";
        return loc.cot; // Ví dụ 1 (số dãy)
    };

    const handleAddRow = (idSanPham) => {
        setLuuTruData(prev => {
            const updated = [...(prev[idSanPham] || [])];
            const sp = products.find(p => p.idSanPham === idSanPham);
            const volPerItem = getVolumePerItem(sp);

            const currentQty = updated.reduce((sum, row) => sum + (parseInt(row.soLuong) || 0), 0);
            const qtyLeft = sp.soLuong - currentQty;
            if (qtyLeft <= 0) {
                alert("✅ Đã đủ số lượng yêu cầu, không cần thêm nữa!");
                return prev;
            }

            const usedVolume = calculateFullUsedVolume(prev, products);



            // Vị trí cũ đã lưu
            const oldLocIds = (prev[idSanPham] || []).map(r => parseInt(r.viTri));
            const oldPositionIds = oldPositionsState[idSanPham] || [];

            const oldLocs = locations.filter(loc => oldPositionIds.includes(loc.idViTri));

            let bestLoc = null;

            // Bước 1: Ưu tiên vị trí cũ đang có
            for (let loc of oldLocs) {
                const freeVol = getFreeVolume(loc, usedVolume);
                const freeQty = Math.floor(freeVol / volPerItem);
                if (freeQty > 0) {
                    bestLoc = loc;
                    break;
                }
            }

            // Bước 2: Ưu tiên cùng Zone + cùng Row
            if (!bestLoc && oldLocs.length > 0) {
                const zone = getZoneFromLocation(oldLocs[0]);
                const row = getRowFromLocation(oldLocs[0]);

                const sameZoneRowLocs = locations.filter(loc => {
                    const freeVol = getFreeVolume(loc, usedVolume);
                    const maxQty = Math.floor(freeVol / volPerItem);
                    return getZoneFromLocation(loc) === zone && getRowFromLocation(loc) === row && maxQty > 0;
                });

                if (sameZoneRowLocs.length > 0) {
                    bestLoc = sameZoneRowLocs[0];
                }
            }

            // Bước 3: Ưu tiên cùng Zone
            if (!bestLoc && oldLocs.length > 0) {
                const zone = getZoneFromLocation(oldLocs[0]);

                const sameZoneLocs = locations.filter(loc => {
                    const freeVol = getFreeVolume(loc, usedVolume);
                    const maxQty = Math.floor(freeVol / volPerItem);
                    return getZoneFromLocation(loc) === zone && maxQty > 0;
                });

                if (sameZoneLocs.length > 0) {
                    bestLoc = sameZoneLocs[0];
                }
            }

            // Bước 4: Random toàn bộ kho
            if (!bestLoc) {
                const allLocs = locations.filter(loc => {
                    const freeVol = getFreeVolume(loc, usedVolume);
                    const maxQty = Math.floor(freeVol / volPerItem);
                    return maxQty > 0;
                });
                if (allLocs.length > 0) {
                    bestLoc = allLocs[0];
                }
            }

            if (!bestLoc) {
                alert("❌ Không còn vị trí nào đủ chỗ trống!");
                return prev;
            }

            const freeQty = Math.floor(getFreeVolume(bestLoc, usedVolume) / volPerItem);
            const suggestedQty = Math.min(freeQty, qtyLeft);

            updated.push({ viTri: bestLoc.idViTri, soLuong: suggestedQty });

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
        const qrList = [];
        let hasError = false;

        for (let sp of products) {
            const chiTiet = luuTruData[sp.idSanPham] || [];
            const totalQty = chiTiet.reduce((sum, vt) => sum + (parseInt(vt.soLuong) || 0), 0);

            if (totalQty > sp.soLuong) {
                alert(`❌ Sản phẩm "${sp.tenSanPham}" bị vượt quá số lượng yêu cầu!`);
                hasError = true;
                break;
            }
        }

        if (hasError) return;

        for (let sp of products) {
            const chiTiet = luuTruData[sp.idSanPham] || [];
            const totalQty = chiTiet.reduce((sum, vt) => sum + (parseInt(vt.soLuong) || 0), 0);

            if (totalQty < sp.soLuong) {
                const confirmSave = window.confirm(`⚠️ Sản phẩm "${sp.tenSanPham}" mới nhập ${totalQty}/${sp.soLuong}. Bạn có chắc chắn lưu?`);
                if (!confirmSave) return;
            }

            for (let vt of chiTiet) {
                const viTriObj = locations.find(v => v.idViTri === parseInt(vt.viTri));
                if (vt.viTri && vt.soLuong > 0 && viTriObj) {
                    console.log("➡️ idPhieuNhap:", idPhieuNhap);

                    payload.push({
                        idPhieuNhap,
                        idSanPham: sp.idSanPham,
                        idViTri: parseInt(vt.viTri),
                        soLuong: vt.soLuong
                    });


                    qrList.push({
                        value: `SP: ${sp.tenSanPham || `SP${sp.idSanPham}`}
Mã: ${sp.idSanPham}
Vị trí: ${viTriObj.day}-${viTriObj.cot}-${viTriObj.tang}
SL: ${vt.soLuong}`,
                        label: `${sp.tenSanPham || `SP${sp.idSanPham}`} - ${viTriObj.day}-${viTriObj.cot}-${viTriObj.tang}`
                    });
                }
            }
        }

        try {
            const res = await axios.post("https://localhost:5288/api/phieunhap/luu-vi-tri", payload);
            alert("✅ " + res.data.message);
            navigate("/quanlyphieunhap");
        } catch (err) {
            console.error("❌ Lỗi:", err);
            alert("❌ Lỗi gửi API: " + err.response?.data?.message || err.message);
        }
    };

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
             
                    <Navbar />
                    <div className="breadcrumb">
                        <Link to="/dashboard">
                            <FaHome className="breadcrumb-icon" /> Trang chủ
                        </Link>
                        <span>/</span>
                        <Link to="/quanlyphieunhap">
                            <FaFileAlt className="breadcrumb-icon" /> Quản lý phiếu nhập
                        </Link>
                    <span>/</span>
                    <Link to="/them-phieu-nhap">
                        <FaFileAlt className="breadcrumb-icon" /> Tạo phiếu nhập
                    </Link>
                    <span>/</span>
                        <span>
                            <FaPlus className="breadcrumb-icon" /> Chọn vị trí lưu trữ
                        </span>
                </div>
                <div className="form-container">
                    <h2 className="title">🧜‍♂️ Gợi ý vị trí lưu trữ sản phẩm (tối ưu bằng GA)
                    </h2>
                    {loading && <p>⏳ Đang chạy thuật toán GA...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {!loading && products.map((sp, index) => {
                        const usedVolume = calculateFullUsedVolume(luuTruData, products);

                        return (
                            <div key={index} className="card">
                                <div className="product-header" style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    marginBottom: 12
                                }}>
                                    {sp.hinhAnh && (
                                        <img
                                            src={sp.hinhAnh.startsWith('http') ? sp.hinhAnh : `https://localhost:5288${sp.hinhAnh}`}
                                            alt={sp.tenSanPham}
                                            style={{
                                                width: 100,
                                                height: 100,
                                                objectFit: 'cover',
                                                borderRadius: 12,
                                                border: '1px solid #ccc',
                                                marginBottom: 8,
                                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                    )}
                                    <strong style={{ fontSize: 16 }}>{sp.tenSanPham || `Sản phẩm ${sp.idSanPham}`}</strong>
                                    <span style={{ color: '#555' }}>Số lượng: {sp.soLuong}</span>
                                </div>




                                {(luuTruData[sp.idSanPham] || []).map((row, i) => (
                                    <div key={i} className="row">
                                        <select
                                            value={row.viTri}
                                            onChange={(e) => handleChange(sp.idSanPham, i, 'viTri', e.target.value)}
                                            className="select"
                                        >
                                            <option value="">--Chọn vị trí--</option>
                                            {locations
                                                .filter(loc => {
                                                    const volPerItem = getVolumePerItem(sp);
                                                    const freeVol = getFreeVolume(loc, usedVolume);
                                                    const maxQty = Math.floor(freeVol / volPerItem);

                                                    const isSelected = parseInt(loc.idViTri) === parseInt(row.viTri);

                                                    return maxQty > 0 || isSelected; // ✅ luôn giữ vị trí đang được chọn
                                                })

                                                .map(loc => (
                                                    <option key={loc.idViTri} value={loc.idViTri}>
                                                        {loc.day}-{loc.cot}-{loc.tang} (còn chứa ~{Math.floor(getFreeVolume(loc, usedVolume) / getVolumePerItem(sp))} sp)
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

                                        {(() => {
                                            const volPerItem = getVolumePerItem(sp);
                                            const usedVol = calculateFullUsedVolume(luuTruData, products, { idSanPham: sp.idSanPham, index: i });
                                            const loc = locations.find(l => l.idViTri === parseInt(row.viTri));
                                            const freeVol = getFreeVolume(loc, usedVol);
                                            const maxQty = Math.floor(freeVol / volPerItem);

                                            if (parseInt(row.soLuong) > maxQty) {
                                                return (
                                                    <span style={{ color: 'red', fontSize: 12 }}>
                                                        ⚠️ Vượt quá sức chứa!
                                                    </span>
                                                );
                                            }
                                            return null;
                                        })()}


                                        <button className="remove-btn" onClick={() => handleRemoveRow(sp.idSanPham, i)}>❌</button>
                                    </div>
                                ))}

                                <div style={{ marginTop: 4, fontStyle: 'italic', color: '#333' }}>
                                    Tổng đã phân bổ: {
                                        (luuTruData[sp.idSanPham] || []).reduce((sum, r) => sum + (parseInt(r.soLuong) || 0), 0)
                                    } / {sp.soLuong}
                                </div>

                                <button className="add-btn" onClick={() => handleAddRow(sp.idSanPham)}>➕ Thêm vị trí</button>
                            </div>
                        );
                    })}
                    {!loading && (
                        <div className="center-btn">
                            <button className="save-btn" onClick={handleSave}>💾 Lưu vào kho</button>
                        </div>
                    )}

                </div>
                </div>
            </div>
       
    );
};

export default GoiyViTri;
