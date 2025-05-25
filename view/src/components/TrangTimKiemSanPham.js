// ✅ TRANG TÌM KIẾM VỊ TRÍ CHỨA SẢN PHẨM - COMBOBOX GÕ TỪ KHÓA TIẾNG VIỆT
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './SoDoKho.css';
import './TrangTimKiemSanPham.css';

const TrangTimKiemSanPham = () => {
    const [sanPhamList, setSanPhamList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSanPham, setSelectedSanPham] = useState(null);
    const [viTriCoSanPham, setViTriCoSanPham] = useState([]);
    const [highlightedIds, setHighlightedIds] = useState([]);
    const [grouped, setGrouped] = useState({});
    const [vitriList, setVitriList] = useState([]);

    useEffect(() => {
        axios.get("https://qlkhohangtbdt-fptshop-be2.onrender.com/api/sanpham")
            .then(res => setSanPhamList(res.data))
            .catch(err => console.error("Lỗi tải sản phẩm:", err));
    }, []);

    useEffect(() => {
        axios.get("https://qlkhohangtbdt-fptshop-be2.onrender.com/api/vitri")
            .then(res => {
                const group = {};
                (res.data || []).forEach(v => {
                    if (!group[v.day]) group[v.day] = [];
                    group[v.day].push(v);
                });
                setGrouped(group);
                setVitriList(res.data || []);
            });
    }, []);

    const handleSearch = () => {
        if (!selectedSanPham) return;
        axios.get(`https://qlkhohangtbdt-fptshop-be2.onrender.com/api/ChiTietLuuTru/chitietluutru/sanpham/${selectedSanPham}`)
            .then(res => {
                console.log("✅ Dữ liệu trả về:", res.data); // Gỡ khi xong
                const validItems = res.data.filter(item => item.soLuong > 0);
                setViTriCoSanPham(validItems);
                setHighlightedIds([...new Set(validItems.map(item => item.idViTri))]);

            })

            .then(res => {
                setViTriCoSanPham(res.data);
                setHighlightedIds([...new Set(res.data.map(item => item.idViTri))]);
            })
            .catch(err => console.error("Lỗi tải chi tiết lưu trữ:", err));
    };

    const handleClear = () => {
        setSearchTerm("");
        setSelectedSanPham(null);
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



    const removeAccents = (str) => str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

    const handleSelectFromInput = (e) => {
        const typed = e.target.value;
        setSearchTerm(typed);

        const typedNormalized = removeAccents(typed);

        const exactMatch = sanPhamList.find(sp =>
            removeAccents(sp.tenSanPham) === typedNormalized
        );

        if (exactMatch) {
            setSelectedSanPham(exactMatch.idSanPham);
            return;
        }

        const partialMatch = sanPhamList.find(sp =>
            removeAccents(sp.tenSanPham).includes(typedNormalized)
        );

        if (partialMatch) {
            setSelectedSanPham(partialMatch.idSanPham);
        } else {
            setSelectedSanPham(null);
        }
    };


    return (
        <div className="layout-wrapper" style={{ display: 'flex' }}>
            <Sidebar />
            <div className="content-area" style={{ flexGrow: 1, backgroundColor: '#f9f9f9' }}>
                <div className="main-layout" style={{ padding: '20px' }}>
                    <Navbar />

                    <div className="container" >
                        <h1 className="title">🔍 Tìm kiếm vị trí lưu trữ sản phẩm</h1>
                      

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 16, marginBottom: 30 }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={{ fontSize: 14, marginBottom: 4 }}>Tên sản phẩm</label>
                                <input
                                    list="sanpham-options"
                                    type="text"
                                    placeholder="Nhập tên sản phẩm..."
                                    value={searchTerm}
                                    onChange={handleSelectFromInput}
                                    style={{ padding: 10, width: 400, borderRadius: 6, border: '1px solid #ccc' }}
                                />
                                <datalist id="sanpham-options">
                                    {sanPhamList.map(sp => (
                                        <option key={sp.idSanPham} value={sp.tenSanPham} />
                                    ))}
                                </datalist>
                            </div>
                            <button
                                onClick={handleSearch}
                                style={{ height: 42, padding: '0 16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 'bold' }}
                            >
                                🔍 Tìm kiếm
                            </button>
                            <button
                                onClick={handleClear}
                                style={{ height: 42, padding: '0 16px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 'bold' }}
                            >
                                ❌ Xóa
                            </button>
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
                                            <th style={{ border: '1px solid #ccc', padding: 10, background: '#f0f0f0', textAlign: 'left' }}>Vị trí</th>
                                            <th style={{ border: '1px solid #ccc', padding: 10, background: '#f0f0f0', textAlign: 'left' }}>Số lượng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                            {viTriCoSanPham.filter(item => item.soLuong > 0).map((item, index) => (
                                            <tr key={index}>
                                                <td style={{ border: '1px solid #ccc', padding: 10 }}>
                                                    {item.vitri && item.vitri.day && item.vitri.cot && item.vitri.tang
                                                        ? `${item.vitri.day}-${item.vitri.cot}-${item.vitri.tang}`
                                                        : '--'}
                                                </td>

                                                <td style={{ border: '1px solid #ccc', padding: 10 }}>{item.soLuong}</td>
                                            </tr>
                                        ))}
                                            <tr>
                                                <td style={{ border: '1px solid #ccc', padding: 10, fontWeight: 'bold' }}>Tổng</td>
                                                <td style={{ border: '1px solid #ccc', padding: 10, fontWeight: 'bold' }}>
                                                    {viTriCoSanPham.filter(item => item.soLuong > 0).reduce((sum, item) => sum + item.soLuong, 0)}

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