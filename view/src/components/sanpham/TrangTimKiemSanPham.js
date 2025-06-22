// ✅ TÌM KIẾM TIẾNG VIỆT - CUSTOM DROPDOWN
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from '../common/Sidebar/Sidebar';
import Navbar from '../common/Navbar/Navbar';
import '../sodokho/SoDoKho.css';
import './TrangTimKiemSanPham.css';

const removeAccents = (str) => {
    return str.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d").replace(/Đ/g, "D")
        .toLowerCase();
};

const TrangTimKiemSanPham = () => {
    const [sanPhamList, setSanPhamList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSanPham, setSelectedSanPham] = useState(null);
    const [viTriCoSanPham, setViTriCoSanPham] = useState([]);
    const [highlightedIds, setHighlightedIds] = useState([]);
    const [grouped, setGrouped] = useState({});
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        axios.get("https://qlkhohangtbdt-fptshop-be2.onrender.com/api/sanpham")
            .then(res => setSanPhamList(res.data))
            .catch(err => console.error("Lỗi tải sản phẩm:", err));

        axios.get("https://qlkhohangtbdt-fptshop-be2.onrender.com/api/vitri")
            .then(res => {
                const group = {};
                (res.data || []).forEach(v => {
                    if (!group[v.day]) group[v.day] = [];
                    group[v.day].push(v);
                });
                setGrouped(group);
            });
    }, []);

    const handleInputChange = (e) => {
        const typed = e.target.value;
        setSearchTerm(typed);
        const normalized = removeAccents(typed);
        const matches = sanPhamList.filter(sp =>
            removeAccents(sp.tenSanPham).includes(normalized)
        );
        setSuggestions(matches);
    };

    const handleSelectSuggestion = (sp) => {
        setSearchTerm(sp.tenSanPham);
        setSelectedSanPham(sp.idSanPham);
        setSuggestions([]);
    };

    const handleSearch = () => {
        if (!selectedSanPham) return;
        axios.get(`https://qlkhohangtbdt-fptshop-be2.onrender.com/api/ChiTietLuuTru/chitietluutru/sanpham/${selectedSanPham}`)
            .then(res => {
                const validItems = res.data.filter(item => item.soLuong > 0);
                setViTriCoSanPham(validItems);
                setHighlightedIds([...new Set(validItems.map(item => item.idViTri))]);
            })
            .catch(err => console.error("Lỗi tải chi tiết lưu trữ:", err));
    };

    const handleClear = () => {
        setSearchTerm("");
        setSelectedSanPham(null);
        setSuggestions([]);
        setViTriCoSanPham([]);
        setHighlightedIds([]);
    };

    const getTooltip = (idViTri) => {
        const items = viTriCoSanPham.filter(x => x.idViTri === idViTri);
        if (items.length === 0) return "";
        const tenSanPham = items[0].tenSanPham || "Sản phẩm";
        const total = items.reduce((sum, x) => sum + x.soLuong, 0);
        return `${tenSanPham} - Tổng SL: ${total}`;
    };

    return (
        <div className="layout-wrapper" style={{ display: 'flex' }}>
            <Sidebar />
            <div className="content-area" style={{ flexGrow: 1, backgroundColor: '#f9f9f9' }}>
                <div className="main-layout" style={{ padding: '20px' }}>
                    <Navbar />
                    <div className="container">
                        <h1 className="title">🔍 TÌM KIẾM VỊ TRÍ LƯU TRỮ SẢN PHẨM</h1>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 16, marginBottom: 30, position: "relative" }}>
                            <div style={{ display: 'flex', flexDirection: 'column', width: 400 }}>
                                <label style={{ fontSize: 14, marginBottom: 4 }}>Tên sản phẩm</label>
                                <input
                                    type="text"
                                    placeholder="Nhập tên sản phẩm..."
                                    value={searchTerm}
                                    onChange={handleInputChange}
                                    style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
                                />
                                {suggestions.length > 0 && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 66,
                                        background: '#fff',
                                        border: '1px solid #ccc',
                                        borderRadius: 6,
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                                        maxHeight: 200,
                                        overflowY: 'auto',
                                        zIndex: 10
                                    }}>
                                        {suggestions.map(sp => (
                                            <div
                                                key={sp.idSanPham}
                                                onClick={() => handleSelectSuggestion(sp)}
                                                style={{ padding: 10, cursor: 'pointer' }}
                                                onMouseDown={(e) => e.preventDefault()}
                                            >
                                                {sp.tenSanPham}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button onClick={handleSearch} className="submit-button">🔍 Tìm kiếm</button>
                            <button onClick={handleClear} className="cancel-button">❌ Xóa</button>
                        </div>

                        <div className="sodokho-container2">
                            <div className="kho-wrapper-horizontal">
                                {Object.entries(grouped).sort().map(([day, items], idx) => (
                                    <div className="kho-row" key={idx}>
                                        <div className="day-label">Dãy {day}</div>
                                        <div className="kho-row-items">
                                            {items.map((vt, i) => {
                                                const isHighlighted = highlightedIds.includes(vt.idViTri);
                                                const tooltip = getTooltip(vt.idViTri);
                                                return (
                                                    <div
                                                        key={i}
                                                        className={`vitri-cell ${isHighlighted ? 'highlighted' : ''}`}
                                                        title={tooltip}
                                                    >
                                                        {vt.day}-{vt.cot}-{vt.tang}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="note-box" style={{ margin: '30px auto', width: '70%' }}>
                            <h4 style={{ textAlign: 'center' }}>📦 Chi tiết vị trí chứa sản phẩm</h4>
                            {viTriCoSanPham.length === 0 ? (
                                <p style={{ textAlign: 'center', marginTop: 10 }}>Chưa có dữ liệu.</p>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
                                    <thead>
                                        <tr>
                                            <th style={{ border: '1px solid #ccc', padding: 10, background: '#f0f0f0' }}>Vị trí</th>
                                            <th style={{ border: '1px solid #ccc', padding: 10, background: '#f0f0f0' }}>Số lượng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {viTriCoSanPham.map((item, index) => (
                                            <tr key={index}>
                                                <td style={{ border: '1px solid #ccc', padding: 10 }}>
                                                    {item.vitri ? `${item.vitri.day}-${item.vitri.cot}-${item.vitri.tang}` : '--'}
                                                </td>
                                                <td style={{ border: '1px solid #ccc', padding: 10 }}>{item.soLuong}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td style={{ border: '1px solid #ccc', padding: 10, fontWeight: 'bold' }}>Tổng</td>
                                            <td style={{ border: '1px solid #ccc', padding: 10, fontWeight: 'bold' }}>
                                                {viTriCoSanPham.reduce((sum, item) => sum + item.soLuong, 0)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrangTimKiemSanPham;
