import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tooltip } from "react-tooltip";
import "./SoDoKho.css";
import Sidebar from '../common/Sidebar/Sidebar';
import Navbar from '../common/Navbar/Navbar';
import ChiTietViTri from "./ChiTietViTri";

const SoDoKho = ({ highlightedIds = [] }) => {
    const [vitri, setVitri] = useState([]);
    const [grouped, setGrouped] = useState({});
    const [filterDay, setFilterDay] = useState("");
    const [filterTrangThai, setFilterTrangThai] = useState("");
    const [searchMaViTri, setSearchMaViTri] = useState("");
    const [popupViTri, setPopupViTri] = useState(null);
    const [sanPhamPopup, setSanPhamPopup] = useState([]);

    useEffect(() => {
        axios.get("https://qlkhohangtbdt-fptshop-be2.onrender.com/api/vitri")
            .then(res => {
                setVitri(res.data || []);
                const group = {};
                (res.data || []).forEach(v => {
                    const d = v.day || v.tenDay;
                    if (!d) return;
                    if (!group[d]) group[d] = [];
                    group[d].push(v);
                });
                setGrouped(group);
            })
            .catch(err => console.error("Lỗi lấy vị trí:", err));
    }, []);

    const getColor = (viTri) => {
        const tile = viTri.sucChua - viTri.daDung;
        const percent = tile / viTri.sucChua;
        if (percent > 0.5) return "green";
        if (percent > 0.2) return "lightblue";
        return "red";
    };

    const handleOpenPopup = async (viTri) => {
        setPopupViTri(viTri);
        try {
            const res = await axios.get(`https://qlkhohangtbdt-fptshop-be2.onrender.com/api/chitietluutru/chitietluutru/vitri/${viTri.idViTri}`);
            setSanPhamPopup(res.data || []);
        } catch (err) {
            console.error("Lỗi khi tải chi tiết sản phẩm vị trí:", err);
            setSanPhamPopup([]);
        }
    };

    const sortByCotTang = (a, b) => a.cot - b.cot || a.tang - b.tang;

    const filteredGrouped = Object.entries(grouped)
        .filter(([day]) => !filterDay || day === filterDay)
        .map(([day, items]) => [day, items.filter(v => {
            if (filterTrangThai === "0") return v.trangThai === 0 || v.trangThai === "0";
            if (filterTrangThai === "full") return v.daDung >= v.sucChua;
            if (filterTrangThai === "partial") return v.daDung < v.sucChua;
            if (searchMaViTri) {
                const ma = `${v.day}-${v.cot}-${v.tang}`;
                return ma.toLowerCase().includes(searchMaViTri.toLowerCase());
            }
            return true;
        })]);

    const matchedMaViTri = (v) => {
        const ma = `${v.day}-${v.cot}-${v.tang}`;
        const matchMa = searchMaViTri && ma.toLowerCase().includes(searchMaViTri.toLowerCase());
        const matchDay = filterDay && v.day === filterDay;
        const matchTrangThai = filterTrangThai === "0" ? (v.trangThai === 0 || v.trangThai === "0")
            : filterTrangThai === "full" ? (v.daDung >= v.sucChua)
                : filterTrangThai === "partial" ? (v.daDung < v.sucChua)
                    : false;
        return matchMa || matchDay || matchTrangThai;
    };

    const getUsagePercent = (vt) => {
        const used = vt.daDung || 0;
        const capacity = vt.sucChua || 1;
        return Math.round((used / capacity) * 100);
    };

    return (

        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <div className="main-layout">
                    <div className="container" >
                        <title>Sơ đồ kho</title>
                        <h1 className="title">SƠ ĐỒ KHO HÀNG FPT SHOP</h1>
                        <Navbar />

                        <div className="search-form">
                            <input placeholder="Tìm mã vị trí (VD: A-1-1)" value={searchMaViTri} onChange={(e) => setSearchMaViTri(e.target.value)} className="search-input" />
                            <select value={filterDay} onChange={(e) => setFilterDay(e.target.value)} className="filter-select">
                                <option value="">-- Dãy --</option>
                                {Object.keys(grouped).sort().map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                            <select value={filterTrangThai} onChange={(e) => setFilterTrangThai(e.target.value)} className="filter-select">
                                <option value="">-- Trạng thái --</option>
                                <option value="partial">Còn trống</option>
                                <option value="full">Đã đầy</option>
                                <option value="0">Đã khoá</option>
                            </select>
                            <button className="reset-button" onClick={() => { setFilterDay(""); setFilterTrangThai(""); setSearchMaViTri(""); }}>🗑 Xoá lọc</button>
                        </div>
                        <div className="so-do-wrapper" style={{ textAlign: 'center', marginTop: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div className="note-box">
                                <h4>Ghi chú sơ đồ</h4>
                                <div className="legend">
                                    <div><span className="green box" /> Còn &gt; 50%</div>
                                    <div><span className="lightblue box" /> Còn 20–50%</div>
                                    <div><span className="red box" /> Còn &lt; 20%</div>
                                </div>
                                <div style={{ textAlign: 'left', fontSize: 13 }}>
                                        <p><strong>Mã vị trí:</strong>  A-1-1: Dãy A - Cột 1 - Tầng 1</p>
                              
                                </div>
                            </div>
                        </div>
                    
                        <div className="sodokho-container2" style={{ textAlign: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div>
                                    <div className="area-label">Khu vực soạn hàng</div>
                                    <div className="kho-wrapper-horizontal">
                                        {filteredGrouped.map(([day, items], idx) => (
                                            <div className="kho-row" key={idx}>
                                                <div className="day-label">Dãy {day}</div>
                                                <div className="kho-row-items">
                                                    {items.sort(sortByCotTang).map((vt, i) => (

                                                        <div
                                                            key={i}
                                                            className={`vitri-cell ${getColor(vt)} ${matchedMaViTri(vt) ? 'matched' : ''}`}
                                                            onClick={() => handleOpenPopup(vt)}
                                                            title={`Vị trí: ${vt.day}-${vt.cot}-${vt.tang}\nSử dụng: ${getUsagePercent(vt)}%\n${vt.tenSanPham ?? ''}`}
                                                        >
                                                            <div>{vt.day}-{vt.cot}-{vt.tang}</div>
                                                            {vt.trangThai === 0 && <div className="lock-icon">🔒</div>}
                                                        </div>

                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="area-label">Khu vực hàng chờ xuất</div>
                        </div>

                        {popupViTri && (
                            <div className="popup-overlay">
                                <div className="popup-box" >
                                    
                                    <ChiTietViTri danhSach={sanPhamPopup} viTri={popupViTri} onClose={() => setPopupViTri(null)} />
                                </div>
                            </div>
                        )}

                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default SoDoKho;
