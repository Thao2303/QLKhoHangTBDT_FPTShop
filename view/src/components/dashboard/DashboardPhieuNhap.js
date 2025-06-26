// File: DashboardPhieuNhap.js
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import dayjs from 'dayjs';
import Navbar from '../common/Navbar/Navbar';
import Sidebar from '../common/Sidebar/Sidebar';

import Select from 'react-select';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Pagination from "../common/Pagination/Pagination";
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50'];

const DashboardPhieuNhap = () => {
    const [phieuNhaps, setPhieuNhaps] = useState([]);
    const [chiTietMap, setChiTietMap] = useState({});
    const [filterNCC, setFilterNCC] = useState(null);
    const [filterThang, setFilterThang] = useState('');
    const [filterNguoiTao, setFilterNguoiTao] = useState(null);
    const [filterTrangThai, setFilterTrangThai] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [filterYear, setFilterYear] = useState(dayjs().year());
    const [sortOrder, setSortOrder] = useState('none');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
 

    const itemsPerPage = 5;
    const exportRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
    const res = await axios.get('https://qlkhohangtbdt-fptshop-be2.onrender.com/api/phieunhap');
    const data = res.data || [];
    setPhieuNhaps(data);

    const promises = data.map(pn =>
        axios.get(`https://qlkhohangtbdt-fptshop-be2.onrender.com/api/phieunhap/chitiet/${pn.idPhieuNhap}`)
            .then(resCt => ({ id: pn.idPhieuNhap, data: resCt.data }))
            .catch(() => ({ id: pn.idPhieuNhap, data: [] }))
    );

    const results = await Promise.all(promises);

    const map = {};
    results.forEach(r => {
        map[r.id] = r.data;
    });

    setChiTietMap(map);
};

        fetchData();
    }, []);

    const trangThaiMap = { 1: 'Chờ duyệt', 2: 'Đã duyệt', 3: 'Từ chối', 4: 'Hoàn hàng' };
    const trangThaiOptions = Object.entries(trangThaiMap).map(([k, v]) => ({ value: Number(k), label: v }));
    const uniqueYears = Array.from(
        new Set(phieuNhaps.map(p => dayjs(p.ngayNhap).year()))
    ).sort((a, b) => b - a); // sort giảm dần

    const filteredPhieuNhaps = phieuNhaps.filter(p => {
        const matchNCC = filterNCC ? p.nhaCungCap?.tenNhaCungCap === filterNCC.value : true;
        const matchNguoiTao = filterNguoiTao ? p.nguoiTao === filterNguoiTao.value : true;
        const matchThang = filterThang ? dayjs(p.ngayNhap).format('YYYY-MM') === filterThang : true;
        const matchTrangThai = filterTrangThai ? p.trangThai === filterTrangThai.value : true;
        const matchKeyword = searchKeyword ? p.idPhieuNhap.toString().includes(searchKeyword) || p.nguoiTao?.toLowerCase().includes(searchKeyword.toLowerCase()) : true;
        const matchDate =
            (!startDate || new Date(p.ngayNhap) >= startDate) &&
            (!endDate || new Date(p.ngayNhap) <= endDate);

        const matchYear = p.ngayNhap && dayjs(p.ngayNhap).year().toString() === filterYear.toString();
        return matchNCC && matchNguoiTao && matchTrangThai && matchKeyword && matchDate && matchYear && matchThang;
    });

    const sortedPhieuNhaps = [...filteredPhieuNhaps].sort((a, b) => {
        if (sortOrder === 'asc') return new Date(a.ngayNhap) - new Date(b.ngayNhap);
        if (sortOrder === 'desc') return new Date(b.ngayNhap) - new Date(a.ngayNhap);
        return 0;
    });

    const paginatedPhieuNhaps = sortedPhieuNhaps.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredPhieuNhaps.length / itemsPerPage);

    const tongPhieuNhap = filteredPhieuNhaps.length;
    const tongTien = filteredPhieuNhaps.flatMap(p => chiTietMap[p.idPhieuNhap] || []).reduce((sum, ct) => sum + (ct.tongTien || 0), 0);
    const now = dayjs();
    const thangNayCount = filteredPhieuNhaps.filter(p => dayjs(p.ngayNhap).isSame(now, 'month')).length;

    const nccCounts = {};
    filteredPhieuNhaps.forEach(p => {
        const name = p.nhaCungCap?.tenNhaCungCap;
        if (name) nccCounts[name] = (nccCounts[name] || 0) + 1;
    });
    const topNhaCungCap = Object.entries(nccCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Không có';

    const trangThaiCounts = filteredPhieuNhaps.reduce((acc, p) => {
        const key = trangThaiMap[p.trangThai] || 'Khác';
        const found = acc.find(i => i.trangThai === key);
        if (found) found.soLuong++;
        else acc.push({ trangThai: key, soLuong: 1 });
        return acc;
    }, []);

    const namHienTai = dayjs().year();
    const thangHienTai = dayjs().month() + 1; // 1-12

    const soThang = Number(filterYear) === namHienTai ? thangHienTai : 12;



    const dataTheoThang = Array.from({ length: soThang }, (_, i) => {
        const thang = i + 1;
        const soPhieu = filteredPhieuNhaps.filter(p => {
            const date = dayjs(p.ngayNhap);
            return date.year() === Number(filterYear) && date.month() + 1 === thang;

        }).length;

        const tongTienThang = filteredPhieuNhaps
            .filter(p => {
                const date = dayjs(p.ngayNhap);
                return date.year() === Number(filterYear) && date.month() + 1 === thang;

            })
            .flatMap(p => chiTietMap[p.idPhieuNhap] || [])
            .reduce((sum, ct) => sum + (ct.tongTien || 0), 0);

        return { thang: `Th${thang}`, soPhieu, tongTien: tongTienThang };
    });

    const exportPDF = async () => {
        const element = exportRef.current;
        if (!element) return;
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`dashboard_${dayjs().format('YYYY-MM-DD')}.pdf`);
    };

    const exportExcel = () => {
        const data = filteredPhieuNhaps.map(p => ({
            MaPhieu: p.idPhieuNhap,
            NgayNhap: dayjs(p.ngayNhap).format('DD/MM/YYYY'),
            NhaCungCap: p.nhaCungCap?.tenNhaCungCap,
            NguoiTao: p.nguoiTao,
            TrangThai: trangThaiMap[p.trangThai] || 'Khác'
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'PhieuNhap');
        XLSX.writeFile(wb, `phieu_nhap_${dayjs().format('YYYY-MM-DD')}.xlsx`);
    };

    const nccOptions = [...new Set(phieuNhaps.map(p => p.nhaCungCap?.tenNhaCungCap))].filter(Boolean).map(name => ({ value: name, label: name }));
    const nguoiTaoOptions = [...new Set(phieuNhaps.map(p => p.nguoiTao))].filter(Boolean).map(name => ({ value: name, label: name }));

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <Navbar />
                <div className="container" ref={exportRef}>
                    <h1 className="title">THỐNG KÊ PHIẾU NHẬP</h1>
                    <div style={{ display: 'flex', justifyContent: 'right', marginTop: '20px' }}>
                        <div>
                            <label>Năm: </label>
                            <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
                                {uniqueYears.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>

                            <label style={{ marginLeft: '10px' }}>Sắp xếp: </label>
                            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                                <option value="none">Bình thường</option>
                                <option value="asc">Tăng dần</option>
                                <option value="desc">Giảm dần</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'right', justifyContent: 'right', marginTop: '10px' }}>
                        <span>Từ ngày:</span>
                        <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
                        <span>Đến ngày:</span>
                        <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
                    </div>
                    <div style={{ marginBottom: '16px', marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'right' }}>
                        <Select options={nccOptions} value={filterNCC} onChange={setFilterNCC} placeholder="Lọc theo NCC" isClearable styles={{ container: base => ({ ...base, minWidth: '200px' }) }} />
                        <Select options={nguoiTaoOptions} value={filterNguoiTao} onChange={setFilterNguoiTao} placeholder="Lọc theo người tạo" isClearable styles={{ container: base => ({ ...base, minWidth: '200px' }) }} />
                        <Select options={trangThaiOptions} value={filterTrangThai} onChange={setFilterTrangThai} placeholder="Trạng thái" isClearable styles={{ container: base => ({ ...base, minWidth: '200px' }) }} />


                    </div>
                 

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '20px' }}>
                        <Card title="Tổng phiếu nhập" value={tongPhieuNhap} />
                        <Card title="Tổng tiền nhập" value={tongTien.toLocaleString('vi-VN')} />
                        <Card title="Phiếu nhập tháng này" value={thangNayCount} />
                        <Card title="NCC nổi bật" value={topNhaCungCap} />
                    </div>

                    <div style={{ display: 'flex', gap: '32px', marginTop: '40px', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <h3 style={{ marginBottom: '10px' }}>📅 Số phiếu theo tháng</h3>
                            <BarChart
                                width={580}
                                height={300}
                                data={dataTheoThang}
                                barCategoryGap={10} // 👈 ngăn Recharts tạo overlay chồng
                            >
                                <XAxis dataKey="thang" interval={0} />
                                <YAxis />
                                <Tooltip cursor={{ fill: "transparent" }} />  {/* 👈 Tắt nền highlight xám */}
                                <Bar
                                    dataKey="soPhieu"
                                    fill="#8884d8"
                                    radius={[6, 6, 0, 0]}
                                    activeBar={false}
                                />
                            </BarChart>

                        </div>
                        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <h3>📌 Trạng thái phiếu</h3>
                            <PieChart width={400} height={300}>
                                <Pie data={trangThaiCounts} dataKey="soLuong" nameKey="trangThai" cx="50%" cy="50%" outerRadius={100} label>
                                    {trangThaiCounts.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </div>
                    
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h3 style={{ marginBottom: '10px' }}>💰 Tiền nhập theo tháng</h3>
                        <LineChart width={780} height={300} margin={{ top: 20, right: 40, left: 100, bottom: 0 }} data={dataTheoThang}>

                            <XAxis dataKey="thang" interval={0} />
                            <YAxis tickFormatter={(value) => value.toLocaleString('vi-VN')} />
                            <Tooltip />
                            <CartesianGrid stroke="#ccc" />
                            <Line type="monotone" dataKey="tongTien" stroke="#82ca9d" />
                        </LineChart>
                    </div>

                    <div style={{ marginTop: '40px' }}>
                        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>📋 Danh sách phiếu nhập</h3>

                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            background: '#fff',
                            boxShadow: '0 0 10px rgba(0,0,0,0.05)',
                            borderRadius: '8px',
                            overflow: 'hidden'
                        }}>
                            <thead style={{ background: '#e2e8f0' }}>
                                <tr>
                                    <th style={{ padding: '12px' }}>Mã phiếu</th>
                                    <th style={{ padding: '12px' }}>Ngày nhập</th>
                                    <th style={{ padding: '12px' }}>Nhà cung cấp</th>
                                    <th style={{ padding: '12px' }}>Người tạo</th>
                                    <th style={{ padding: '12px' }}>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedPhieuNhaps.map((p, idx) => (
                                    <tr key={idx} style={{
                                        textAlign: 'center',
                                        borderBottom: '1px solid #e5e7eb',
                                        transition: 'background 0.2s',
                                        cursor: 'default'
                                    }} onMouseOver={e => e.currentTarget.style.background = '#f9fafb'}
                                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '10px' }}>{p.idPhieuNhap}</td>
                                        <td>{dayjs(p.ngayNhap).format('DD/MM/YYYY')}</td>
                                        <td>{p.nhaCungCap?.tenNhaCungCap}</td>
                                        <td>{p.nguoiTao}</td>
                                        <td style={{ color: p.trangThai === 2 ? 'green' : p.trangThai === 3 ? 'red' : '#f59e0b' }}>{trangThaiMap[p.trangThai]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

                        <div style={{ marginTop: '16px', display: 'flex', gap: '10px', justifyContent: 'right' }}>
                            <button onClick={exportPDF} style={{ padding: '8px 16px', borderRadius: '6px', background: '#f3f4f6', border: '1px solid #ccc', cursor: 'pointer' }}>
                                📄 PDF
                            </button>
                            <button onClick={exportExcel} style={{ padding: '8px 16px', borderRadius: '6px', background: '#f3f4f6', border: '1px solid #ccc', cursor: 'pointer' }}>
                                📥 Excel
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

const Card = ({ title, value }) => (
    <div style={{ background: '#f3f4f6', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
        <h4 style={{ fontSize: '16px', color: '#555' }}>{title}</h4>
        <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{value}</p>
    </div>
);

export default DashboardPhieuNhap;
