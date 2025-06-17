// [CẬP NHẬT] Bổ sung lọc nâng cao
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import Navbar from '../common/Navbar/Navbar';
import Sidebar from '../common/Sidebar/Sidebar';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import Select from 'react-select';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50'];

const truncate = (str, len = 30) => str.length > len ? str.slice(0, len) + '...' : str;

const DashboardSanPham = () => {
    const [sanPhams, setSanPhams] = useState([]);
    const [filteredSP, setFilteredSP] = useState([]);
    const [filterDanhMuc, setFilterDanhMuc] = useState(null);
    const [filterThuongHieu, setFilterThuongHieu] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [trangThaiTonKho, setTrangThaiTonKho] = useState("");
    const exportRef = useRef();

    useEffect(() => {
        axios.get('https://localhost:5288/api/sanpham')
            .then(res => {
                const data = res.data || [];
                setSanPhams(data);
                setFilteredSP(data);
            });
    }, []);

    useEffect(() => {
        const filtered = sanPhams.filter(sp => {
            const matchDM = filterDanhMuc ? sp.danhMuc?.idDanhMuc === filterDanhMuc.value : true;
            const matchTH = filterThuongHieu ? sp.thuongHieu?.idThuongHieu === filterThuongHieu.value : true;
            const matchName = searchText ? sp.tenSanPham.toLowerCase().includes(searchText.toLowerCase()) : true;
            const matchMin = minPrice ? sp.donGiaBan >= parseFloat(minPrice) : true;
            const matchMax = maxPrice ? sp.donGiaBan <= parseFloat(maxPrice) : true;
            const matchTrangThai =
                trangThaiTonKho === "saphethang"
                    ? sp.soLuongHienCon < sp.soLuongToiThieu
                    : trangThaiTonKho === "conhang"
                        ? sp.soLuongHienCon >= sp.soLuongToiThieu
                        : true;
            return matchDM && matchTH && matchName && matchMin && matchMax && matchTrangThai;
        });
        setFilteredSP(filtered);
    }, [filterDanhMuc, filterThuongHieu, searchText, minPrice, maxPrice, trangThaiTonKho, sanPhams]);

    const tongSoSanPham = filteredSP.length;
    const tongSLTon = filteredSP.reduce((sum, sp) => sum + sp.soLuongHienCon, 0);
    const tongGiaTri = filteredSP.reduce((sum, sp) => sum + sp.soLuongHienCon * sp.donGiaBan, 0);

    const topTonKho = [...filteredSP].sort((a, b) => b.soLuongHienCon - a.soLuongHienCon).slice(0, 10)
        .map(sp => ({ ten: truncate(sp.tenSanPham), soLuong: sp.soLuongHienCon }));

    const topGiaTriTon = [...filteredSP].sort((a, b) => (b.soLuongHienCon * b.donGiaBan) - (a.soLuongHienCon * a.donGiaBan)).slice(0, 10)
        .map(sp => ({ ten: truncate(sp.tenSanPham), giaTri: sp.soLuongHienCon * sp.donGiaBan }));

    const danhMucCount = {};
    const thuongHieuCount = {};
    const nhaCungCapCount = {};
    filteredSP.forEach(sp => {
        const dm = sp.danhMuc?.tenDanhMuc || 'Khác';
        danhMucCount[dm] = (danhMucCount[dm] || 0) + 1;
        const th = sp.thuongHieu?.tenThuongHieu || 'Khác';
        thuongHieuCount[th] = (thuongHieuCount[th] || 0) + 1;
        const ncc = sp.nhaCungCap?.tenNhaCungCap || 'Khác';
        nhaCungCapCount[ncc] = (nhaCungCapCount[ncc] || 0) + 1;
    });
    const pieDataDM = Object.entries(danhMucCount).map(([name, value]) => ({ name, value }));
    const pieDataTH = Object.entries(thuongHieuCount).map(([name, value]) => ({ name, value }));
    const pieDataNCC = Object.entries(nhaCungCapCount).map(([name, value]) => ({ name, value }));

    const danhMucOptions = [...new Set(sanPhams.map(sp => sp.danhMuc?.idDanhMuc))]
        .filter(Boolean)
        .map(id => {
            const dm = sanPhams.find(sp => sp.danhMuc?.idDanhMuc === id)?.danhMuc;
            return { value: id, label: dm.tenDanhMuc };
        });

    const thuongHieuOptions = [...new Set(sanPhams.map(sp => sp.thuongHieu?.idThuongHieu))]
        .filter(Boolean)
        .map(id => {
            const th = sanPhams.find(sp => sp.thuongHieu?.idThuongHieu === id)?.thuongHieu;
            return { value: id, label: th.tenThuongHieu };
        });
    const exportPDF = async () => {
        const element = exportRef.current;
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const width = pdf.internal.pageSize.getWidth();
        const height = (canvas.height * width) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, width, height);
        pdf.save('dashboard_sanpham.pdf');
    };

    const exportExcel = () => {
        const data = filteredSP.map(sp => ({
            SKU: sp.sku,
            TenSanPham: sp.tenSanPham,
            SoLuong: sp.soLuongHienCon,
            DonGia: sp.donGiaBan,
            GiaTri: sp.soLuongHienCon * sp.donGiaBan
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'SanPham');
        XLSX.writeFile(wb, 'sanpham.xlsx');
    };
    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <Navbar />
                <div className="container" ref={exportRef}>
                    <h1 className="title">📦 THỐNG KÊ SẢN PHẨM</h1>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                        <input
                            type="text"
                            placeholder="🔍 Tìm theo tên sản phẩm"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ padding: '8px', minWidth: '200px' }}
                        />
                        <input
                            type="number"
                            placeholder="Giá tối thiểu"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            style={{ padding: '8px', width: '120px' }}
                        />
                        <input
                            type="number"
                            placeholder="Giá tối đa"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            style={{ padding: '8px', width: '120px' }}
                        />
                        <Select
                            options={danhMucOptions}
                            value={filterDanhMuc}
                            onChange={setFilterDanhMuc}
                            placeholder="-- Lọc danh mục --"
                            isClearable
                            styles={{ container: base => ({ ...base, minWidth: 200 }) }}
                        />
                        <Select
                            options={thuongHieuOptions}
                            value={filterThuongHieu}
                            onChange={setFilterThuongHieu}
                            placeholder="-- Lọc thương hiệu --"
                            isClearable
                            styles={{ container: base => ({ ...base, minWidth: 200 }) }}
                        />
                        <select value={trangThaiTonKho} onChange={(e) => setTrangThaiTonKho(e.target.value)} style={{ padding: '8px', minWidth: '160px' }}>
                            <option value="">-- Trạng thái tồn kho --</option>
                            <option value="saphethang">⚠️ Sắp hết hàng</option>
                            <option value="conhang">✅ Còn đủ hàng</option>
                        </select>
                    </div>

                    <div className="cards" style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <Card title="Tổng sản phẩm" value={tongSoSanPham} />
                        <Card title="Tổng danh mục" value={Object.keys(danhMucCount).length} />
                        <Card title="Tổng thương hiệu" value={Object.keys(thuongHieuCount).length} />
                        <Card title="Tổng nhà cung cấp" value={Object.keys(nhaCungCapCount).length} />
                        <Card title="Tổng SL tồn kho" value={tongSLTon} />
                        <Card title="Tổng giá trị tồn kho" value={tongGiaTri.toLocaleString('vi-VN')} />
                    </div>


                    <div style={{ display: 'flex', gap: '32px', marginTop: 40, justifyContent: 'center' }}>
                        <div>
                            <h3>📊 Top 10 tồn kho cao nhất</h3>
                            <BarChart width={500} height={300} data={topTonKho} layout="vertical">
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="ten" width={200} />
                                <Tooltip />
                                <Bar dataKey="soLuong" fill="#8884d8" />
                            </BarChart>
                        </div>
                        <div>
                            <h3>💰 Top 10 giá trị tồn kho</h3>
                            <BarChart width={500} height={300} data={topGiaTriTon} layout="vertical">
                                <XAxis type="number" tickFormatter={v => v.toLocaleString('vi-VN')} />
                                <YAxis type="category" dataKey="ten" width={200} />
                                <Tooltip formatter={v => v.toLocaleString('vi-VN')} />
                                <Bar dataKey="giaTri" fill="#82ca9d" />
                            </BarChart>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '32px', marginTop: 40, justifyContent: 'center' }}>
                        <div>
                            <h3>📦 Theo danh mục</h3>
                            <PieChart width={400} height={300}>
                                <Pie data={pieDataDM} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                    {pieDataDM.map((_, index) => (
                                        <Cell key={`cell-dm-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </div>
                        <div>
                            <h3>🏷️ Theo thương hiệu</h3>
                            <PieChart width={400} height={300}>
                                <Pie data={pieDataTH} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                    {pieDataTH.map((_, index) => (
                                        <Cell key={`cell-th-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </div>
                       
                            <div>
                                <h3>🏬 Theo nhà cung cấp</h3>
                                <PieChart width={400} height={300}>
                                    <Pie data={pieDataNCC} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                        {pieDataNCC.map((_, index) => (
                                            <Cell key={`cell-ncc-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </div>
                    

                    </div>

                    <div style={{ marginTop: 32, textAlign: 'right' }}>
                        <button onClick={exportPDF} className="btn">📄 Xuất PDF</button>
                        <button onClick={exportExcel} className="btn">📥 Xuất Excel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Card = ({ title, value }) => (
    <div style={{ background: '#f3f4f6', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
        <h4>{title}</h4>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{value}</p>
    </div>
);

export default DashboardSanPham;