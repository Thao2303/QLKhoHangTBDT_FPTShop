import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import Navbar from '../common/Navbar/Navbar';
import Sidebar from '../common/Sidebar/Sidebar';
import Pagination from "../common/Pagination/Pagination";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50'];

const DashboardDaiLy = ({ currentUser }) => {
    const [yeuCaus, setYeuCaus] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const exportRef = useRef();
    const [filterTrangThai, setFilterTrangThai] = useState(null);
    const [filterNguoiTao, setFilterNguoiTao] = useState(null);

    const trangThaiMap = { 1: 'Chờ duyệt', 2: 'Đã duyệt', 3: 'Từ chối', 4: 'Đã xuất kho' };
    const trangThaiOptions = Object.entries(trangThaiMap).map(([k, v]) => ({ value: Number(k), label: v }));
    const nguoiTaoOptions = [...new Set(yeuCaus.map(y => y.nguoiTao?.tenTaiKhoan))]
        .filter(Boolean).map(name => ({ value: name, label: name }));
    const [filterYear, setFilterYear] = useState(dayjs().year());
    const [filterMonth, setFilterMonth] = useState('');
    const [sortOrder, setSortOrder] = useState('none'); // 'asc' | 'desc'

    const uniqueYears = [...new Set(yeuCaus.map(p => dayjs(p.ngayYeuCau).year()))].sort((a, b) => b - a);


    useEffect(() => {
        axios.get('https://qlkhohangtbdt-fptshop-be2.onrender.com/api/yeucauxuatkho')
            .then(async res => {
                const allData = res.data.filter(y => parseInt(y.daiLy?.idDaiLy) === parseInt(currentUser.idDaiLy));

                // Gọi chi tiết sản phẩm cho mỗi yêu cầu
                const enriched = await Promise.all(allData.map(async yc => {
                    const ct = await axios.get(`https://qlkhohangtbdt-fptshop-be2.onrender.com/api/yeucauxuatkho/chitiet/${yc.idYeuCauXuatKho}`);
                    yc.chiTietYeuCauXuatKhos = ct.data || [];
                    return yc;
                }));

                setYeuCaus(enriched);
            });
    }, [currentUser.idDaiLy]);


    const filteredData = yeuCaus.filter(yc => {
        const matchDate = (!startDate || new Date(yc.ngayYeuCau) >= startDate) && (!endDate || new Date(yc.ngayYeuCau) <= endDate);
        const matchKeyword = searchKeyword ? yc.idYeuCauXuatKho.toString().includes(searchKeyword) : true;
        const matchTrangThai = filterTrangThai ? yc.idTrangThaiXacNhan === filterTrangThai : true;
        const matchNguoiTao = filterNguoiTao ? yc.nguoiTao?.tenTaiKhoan === filterNguoiTao : true;
        const matchYear = dayjs(yc.ngayYeuCau).year().toString() === filterYear.toString();
        const matchMonth = filterMonth ? dayjs(yc.ngayYeuCau).month() + 1 === Number(filterMonth) : true;

        return matchDate && matchKeyword && matchTrangThai && matchNguoiTao && matchYear && matchMonth;
    });

    const thongKeSanPham = {};
    filteredData.forEach(yc => {
        yc.chiTietYeuCauXuatKhos?.forEach(ct => {
            const ten = ct.sanPham?.tenSanPham;
            if (ten) {
                thongKeSanPham[ten] = (thongKeSanPham[ten] || 0) + ct.soLuong;
            }
        });
    });

    let dataSanPhamBar = Object.entries(thongKeSanPham).map(([ten, soLuong]) => ({ tenSanPham: ten, soLuong }));
    if (sortOrder === 'asc') dataSanPhamBar.sort((a, b) => a.soLuong - b.soLuong);
    else if (sortOrder === 'desc') dataSanPhamBar.sort((a, b) => b.soLuong - a.soLuong);

    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const dataTheoThang = Array.from({ length: 12 }, (_, i) => {
        const thang = i + 1;
        const soYeuCau = filteredData.filter(p => dayjs(p.ngayYeuCau).month() + 1 === thang).length;
        return { thang: `Th${thang}`, soYeuCau };
    });

    const trangThaiCounts = filteredData.reduce((acc, yc) => {
        const key = trangThaiMap[yc.idTrangThaiXacNhan] || 'Khác';
        const found = acc.find(i => i.trangThai === key);
        if (found) found.soLuong++;
        else acc.push({ trangThai: key, soLuong: 1 });
        return acc;
    }, []);

    const exportPDF = async () => {
        const canvas = await html2canvas(exportRef.current);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`yeucau_chinhanh_${dayjs().format('YYYY-MM-DD')}.pdf`);
    };

    const exportExcel = () => {
        const data = filteredData.map(yc => ({
            MaYeuCau: yc.idYeuCauXuatKho,
            NguoiTao: yc.nguoiTao?.tenTaiKhoan,
            TrangThai: trangThaiMap[yc.idTrangThaiXacNhan] || 'Chưa rõ',
            NgayYeuCau: dayjs(yc.ngayYeuCau).format('DD/MM/YYYY')
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'YeuCauChiNhanh');
        XLSX.writeFile(wb, `yeucau_chinhanh_${dayjs().format('YYYY-MM-DD')}.xlsx`);
    };

    const Card = ({ title, value }) => (
        <div style={{ background: '#f3f4f6', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
            <h4 style={{ fontSize: '16px', color: '#555' }}>{title}</h4>
            <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{value}</p>
        </div>
    );

    const tongYeuCau = filteredData.length;
    const thangNayCount = filteredData.filter(p => dayjs(p.ngayYeuCau).isSame(dayjs(), 'month')).length;
    const daDuyet = filteredData.filter(p => p.idTrangThaiXacNhan === 2).length;
    const tiLeDuyet = ((daDuyet / tongYeuCau) * 100).toFixed(1);

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <Navbar />
                <div className="container" ref={exportRef}>
                    <h1 className="title">📌 DASHBOARD CHI NHÁNH</h1>
                    <div style={{ display: 'flex', justifyContent: 'right', marginTop: '10px', gap: '16px', alignItems: 'center' }}>
                        <label>Năm:</label>
                        <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
                            {uniqueYears.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>

                        <label>Tháng:</label>
                        <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
                            <option value="">Tất cả</option>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                <option key={m} value={m}>{`Th${m}`}</option>
                            ))}
                        </select>

                        <label>Sắp xếp:</label>
                        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                            <option value="none">Bình thường</option>
                            <option value="asc">Tăng dần theo số lượng</option>
                            <option value="desc">Giảm dần theo số lượng</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'right', marginTop: '10px', gap: '16px', alignItems: 'center' }}>
                    <span>Từ ngày:</span>
                    <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
                    <span>Đến ngày:</span>
                        <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
                    </div>
                    <div style={{
                        marginTop: '16px',
                        marginBottom: '16px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '10px',
                        alignItems: 'center',
                        justifyContent: 'right'
                    }}>
                        

                        <input
                            type="text"
                            placeholder="🔍 Tìm mã yêu cầu..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            style={{
                                padding: '8px',
                                borderRadius: '6px',
                                border: '1px solid #ccc',
                                width: '180px'
                            }}
                        />
                        <Select
                            placeholder="Trạng thái"
                            isClearable
                            value={trangThaiOptions.find(o => o.value === filterTrangThai)}
                            onChange={(val) => setFilterTrangThai(val?.value || null)}
                            options={trangThaiOptions}
                            styles={{ container: base => ({ ...base, minWidth: '160px' }) }}
                        />
                        <Select
                            placeholder="Người tạo"
                            isClearable
                            value={nguoiTaoOptions.find(o => o.value === filterNguoiTao)}
                            onChange={(val) => setFilterNguoiTao(val?.value || null)}
                            options={nguoiTaoOptions}
                            styles={{ container: base => ({ ...base, minWidth: '180px' }) }}
                        />
                    </div>


                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '20px' }}>
                        <Card title="Tổng yêu cầu" value={tongYeuCau} />
                        <Card title="Tháng này" value={thangNayCount} />
                        <Card title="Tỉ lệ duyệt" value={`${tiLeDuyet}%`} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px', marginTop: '30px' }}>
                        <div>
                            <h3>🗓 Yêu cầu theo tháng</h3>
                            <BarChart width={500} height={300} data={dataTheoThang}>
                                <XAxis dataKey="thang" />
                                <YAxis />
                                <Tooltip />
                                <CartesianGrid stroke="#ccc" />
                                <Bar dataKey="soYeuCau" fill="#8884d8" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </div>
                        <div>
                            <h3>📊 Trạng thái yêu cầu</h3>
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
                    
                    <h3 style={{ marginTop: '40px' }}>📦 Sản phẩm được yêu cầu</h3>
                    <BarChart width={800} height={300} data={dataSanPhamBar}>
                        <XAxis dataKey="tenSanPham" />
                        <YAxis />
                        <Tooltip />
                        <CartesianGrid stroke="#ccc" />
                        <Bar dataKey="soLuong" fill="#82ca9d" />
                    </BarChart>
                    <h3 style={{ marginTop: '40px' }}>📋 Danh sách yêu cầu</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', boxShadow: '0 0 10px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                        <thead style={{ background: '#e2e8f0' }}>
                            <tr>
                                <th style={{ padding: '12px' }}>Mã YC</th>
                                <th style={{ padding: '12px' }}>Ngày yêu cầu</th>
                                <th style={{ padding: '12px' }}>Người tạo</th>
                                <th style={{ padding: '12px' }}>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((yc, idx) => (
                                <tr key={idx} style={{ textAlign: 'center', borderBottom: '1px solid #eee' }}>
                                    <td>{yc.idYeuCauXuatKho}</td>
                                    <td>{dayjs(yc.ngayYeuCau).format('DD/MM/YYYY')}</td>
                                    <td>{yc.nguoiTao?.tenTaiKhoan}</td>
                                    <td style={{ color: yc.idTrangThaiXacNhan === 2 ? 'green' : yc.idTrangThaiXacNhan === 3 ? 'red' : '#f59e0b' }}>{trangThaiMap[yc.idTrangThaiXacNhan]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'right', gap: '10px' }}>
                        <button onClick={exportPDF}>📄 Xuất PDF</button>
                        <button onClick={exportExcel}>📥 Xuất Excel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardDaiLy;