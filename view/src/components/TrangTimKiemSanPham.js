// ✅ TRANG TÌM KIẾM VỊ TRÍ CHỨA SẢN PHẨM
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import SoDoKho from './SoDoKho';
import './SoDoKho.css';
import './TrangTimKiemSanPham.css'; 


const TrangTimKiemSanPham = () => {
    const [sanPhamList, setSanPhamList] = useState([]);
    const [selectedSanPham, setSelectedSanPham] = useState(null);
    const [viTriCoSanPham, setViTriCoSanPham] = useState([]);

    useEffect(() => {
        axios.get("https://localhost:5288/api/sanpham")
            .then(res => setSanPhamList(res.data))
            .catch(err => console.error("Lỗi tải sản phẩm:", err));
    }, []);

    const handleSearch = () => {
        if (!selectedSanPham) return;
        axios.get(`https://localhost:5288/api/chitietluutru/sanpham/${selectedSanPham}`)
            .then(res => setViTriCoSanPham(res.data))
            .catch(err => console.error("Lỗi tải chi tiết lưu trữ:", err));
    };

    const highlightedIds = viTriCoSanPham.map(item => item.idViTri);

    return (
        <div className="layout-wrapper" style={{ display: 'flex' }}>
            <Sidebar />
            <div className="content-area" style={{ flexGrow: 1 }}>
                <div className="main-layout" style={{ padding: '0 20px' }}>
                    <Navbar />

                    <div className="container" style={{ width: '100%', margin: '0 auto' }}>
                        <h2 style={{ textAlign: 'center', marginBottom: 20 }}>🔍 Tìm kiếm vị trí lưu trữ sản phẩm</h2>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                            <select value={selectedSanPham || ""} onChange={e => setSelectedSanPham(e.target.value)} style={{ padding: 8, minWidth: 400 }}>
                                <option value="">-- Chọn sản phẩm --</option>
                                {sanPhamList.map(sp => (
                                    <option key={sp.idSanPham} value={sp.idSanPham}>{sp.tenSanPham}</option>
                                ))}
                            </select>
                            <button onClick={handleSearch} style={{ padding: '8px 12px', background: '#007bff', color: '#fff', border: 'none', borderRadius: 4 }}>🔍 Tìm kiếm</button>
                        </div>

                        <div style={{ marginTop: 30 }}>
                            <div style={{ width: '100%' }}>
                                <div className="sodokho-container2" style={{ width: '100%', maxWidth: '100%' }}>
                                    <SoDoKho highlightedIds={highlightedIds} />
                                </div>
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
                                            <th style={{ border: '1px solid #ccc', padding: 8, background: '#f0f0f0' }}>Vị trí</th>
                                            <th style={{ border: '1px solid #ccc', padding: 8, background: '#f0f0f0' }}>Số lượng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {viTriCoSanPham.map((item, index) => (
                                            <tr key={index}>
                                                <td style={{ border: '1px solid #ccc', padding: 8 }}>{item.vitri?.day}-{item.vitri?.cot}-{item.vitri?.tang}</td>
                                                <td style={{ border: '1px solid #ccc', padding: 8 }}>{item.soLuong}</td>
                                            </tr>
                                        ))}
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

