// DashboardYeuCauXuatKho.js
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Navbar from '../common/Navbar/Navbar';
import Sidebar from '../common/Sidebar/Sidebar';

import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Pagination from "../common/Pagination/Pagination";
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50'];

const DashboardYeuCauXuatKho = () => {
    const [yeuCaus, setYeuCaus] = useState([]);
    const [filterTrangThai, setFilterTrangThai] = useState(null);
    const [filterDaiLy, setFilterDaiLy] = useState(null);
    const [filterNguoiTao, setFilterNguoiTao] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const exportRef = useRef();
    const itemsPerPage = 5;
    const namOptions = [...new Set(yeuCaus.map(y => dayjs(y.ngayYeuCau).year()))].filter(Boolean).sort((a, b) => b - a);
    const [selectedYear, setSelectedYear] = useState(dayjs().year());

    const trangThaiMap = { 1: 'Chờ duyệt', 2: 'Đã duyệt', 3: 'Từ chối', 4: 'Đã xuất kho' };

    useEffect(() => {
        axios.get('https://localhost:5288/api/yeucauxuatkho')
            .then(res => {
                const all = res.data || [];
                const user = JSON.parse(localStorage.getItem("user"));

                let filtered = all;

                if (user?.tenChucVu === "Đại lý bán hàng") {
                    filtered = all.filter(yc => yc.nguoiTao?.idTaiKhoan === user.idTaiKhoan);
                } else if (user?.tenChucVu === "Giám đốc đại lý") {
                    filtered = all.filter(yc => yc.daiLy?.idDaiLy === user.idDaiLy);
                }

                setYeuCaus(filtered);
            })

            .catch(err => console.error(err));
    }, []);

    const filteredData = yeuCaus.filter(yc => {
        const matchTrangThai = filterTrangThai ? yc.idTrangThaiXacNhan === filterTrangThai.value : true;
        const matchDaiLy = filterDaiLy ? yc.daiLy?.tenDaiLy === filterDaiLy.value : true;
        const matchNguoiTao = filterNguoiTao ? yc.nguoiTao?.tenDangNhap === filterNguoiTao.value : true;
        const matchDate = (!startDate || new Date(yc.ngayYeuCau) >= startDate) &&
            (!endDate || new Date(yc.ngayYeuCau) <= endDate);

        const matchKeyword = searchKeyword ? yc.idYeuCauXuatKho.toString().includes(searchKeyword) : true;
        return matchTrangThai && matchDaiLy && matchNguoiTao && matchDate && matchKeyword;
    });

    const namHienTai = dayjs().year();
    const thangHienTai = dayjs().month() + 1;
    const thangCoDuLieu = Array.from({ length: 12 }, (_, i) => i + 1).filter(thang =>
        filteredData.some(p => {
            const date = dayjs(p.ngayYeuCau);
            return date.year() === Number(selectedYear) && date.month() + 1 === thang;
        })
    );

    const dataTheoThang = thangCoDuLieu.map(thang => {
        const soYeuCau = filteredData.filter(p => {
            const date = dayjs(p.ngayYeuCau);
            return date.year() === Number(selectedYear) && date.month() + 1 === thang;
        }).length;

        return { thang: `Th${thang}`, soYeuCau };
    });


    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const exportPDF = async () => {
        const element = exportRef.current;
        if (!element) return;
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`yeucauxuatkho_${dayjs().format('YYYY-MM-DD')}.pdf`);
    };

    const exportExcel = () => {
        const data = filteredData.map(yc => ({
            MaYeuCau: yc.idYeuCauXuatKho,
            DaiLy: yc.daiLy?.tenDaiLy,
            NguoiTao: yc.nguoiTao?.tenDangNhap,
            TrangThai: trangThaiMap[yc.idTrangThaiXacNhan] || 'Chưa rõ',
            NgayYeuCau: dayjs(yc.ngayYeuCau).format('DD/MM/YYYY')
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'YeuCauXuatKho');
        XLSX.writeFile(wb, `yeucauxuatkho_${dayjs().format('YYYY-MM-DD')}.xlsx`);
    };

    const trangThaiOptions = Object.entries(trangThaiMap).map(([value, label]) => ({ value: parseInt(value), label }));
    const daiLyOptions = [...new Set(yeuCaus.map(yc => yc.daiLy?.tenDaiLy))].filter(Boolean).map(name => ({ value: name, label: name }));
    const nguoiTaoOptions = [...new Set(yeuCaus.map(yc => yc.nguoiTao?.tenDangNhap))].filter(Boolean).map(name => ({ value: name, label: name }));



    const trangThaiCounts = filteredData.reduce((acc, yc) => {
        const key = trangThaiMap[yc.idTrangThaiXacNhan] || 'Khác';
        const found = acc.find(i => i.trangThai === key);
        if (found) found.soLuong++;
        else acc.push({ trangThai: key, soLuong: 1 });
        return acc;
    }, []);
    const tongYeuCau = filteredData.length;
    const thangNayCount = filteredData.filter(p => dayjs(p.ngayYeuCau).isSame(dayjs(), 'month')).length;

    const daiLyCounts = {};
    filteredData.forEach(p => {
        const name = p.daiLy?.tenDaiLy;
        if (name) daiLyCounts[name] = (daiLyCounts[name] || 0) + 1;
    });
    const topDaiLy = Object.entries(daiLyCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Không có';
    const Card = ({ title, value }) => (
        <div style={{ background: '#f3f4f6', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
            <h4 style={{ fontSize: '16px', color: '#555' }}>{title}</h4>
            <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{value}</p>
        </div>
    );

    const daDuyet = filteredData.filter(p => p.idTrangThaiXacNhan === 2).length;
    const tuChoi = filteredData.filter(p => p.idTrangThaiXacNhan === 3).length;
    const tiLeDuyet = ((daDuyet / tongYeuCau) * 100).toFixed(1);

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <Navbar />
                <div className="container" ref={exportRef}>
                    <h1 className="title">📑 THỐNG KÊ YÊU CẦU XUẤT KHO</h1>
                 

                    <div style={{ display: 'flex', justifyContent: 'right', marginTop: '20px' }}>
                        <div>
                            <label>Năm: </label>
                            <select
                                value={startDate ? new Date(startDate).getFullYear() : ''}
                                onChange={(e) => {
                                    const year = e.target.value;
                                    if (year) setStartDate(new Date(`${year}-01-01`));
                                    else setStartDate(null);
                                }}
                            >
                                <option value="">-- Chọn năm --</option>
                                {namOptions.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>

                            <label style={{ marginLeft: '10px' }}>Sắp xếp: </label>
                            <select>
                                <option value="none">Bình thường</option>
                                <option value="asc">Tăng dần</option>
                                <option value="desc">Giảm dần</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', alignItems: 'right', justifyContent: 'right', marginTop: '10px' }}>
                        <span>Từ:</span>
                        <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
                        <span>Đến:</span>
                        <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
                    </div>

                    <div style={{ marginBottom: '16px', marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'right' }}>
                        <Select options={daiLyOptions} value={filterDaiLy} onChange={setFilterDaiLy} placeholder="Lọc theo đại lý" isClearable styles={{ container: base => ({ ...base, minWidth: '200px' }) }} />
                       
                        <Select options={trangThaiOptions} value={filterTrangThai} onChange={setFilterTrangThai} placeholder="Trạng thái" isClearable styles={{ container: base => ({ ...base, minWidth: '200px' }) }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '20px' }}>
                        <Card title="Tổng yêu cầu" value={tongYeuCau} />
                        <Card title="Yêu cầu tháng này" value={thangNayCount} />
                        <Card title="Tỷ lệ duyệt" value={`${tiLeDuyet}%`} />
                        <Card title="Đại lý nổi bật" value={topDaiLy} />
                        

                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px', justifyContent: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                            <h3>📅 Số yêu cầu theo tháng</h3>
                            <BarChart width={580} height={300} data={dataTheoThang}>
                                <XAxis dataKey="thang" />
                                <YAxis />
                                <Tooltip />
                                <CartesianGrid stroke="#ccc" />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="soYeuCau" fill="#8884d8" radius={[6, 6, 0, 0]} activeBar={false} />

                            </BarChart>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h3>📌 Trạng thái yêu cầu</h3>
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
                    <div style={{ display: 'flex', gap: '32px', marginTop: '40px', justifyContent: 'center' }}>
                        <div>
                        <h3>📈 Yêu cầu theo tháng (Biểu đồ đường)</h3>
                        <LineChart width={680} height={300} data={dataTheoThang}>
                            <XAxis dataKey="thang" />
                            <YAxis />
                            <Tooltip />
                            <CartesianGrid stroke="#ccc" />
                            <Line type="monotone" dataKey="soYeuCau" stroke="#8884d8" />
                            </LineChart>
                        </div>
                    </div>

                    <h3 style={{ textAlign: 'center', margin: '20px 0' }}>📋 Danh sách yêu cầu</h3>

                    <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', boxShadow: '0 0 10px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                        <thead style={{ background: '#e2e8f0' }}>
                            <tr>
                                <th style={{ padding: '12px' }}>Mã YC</th>
                                <th style={{ padding: '12px' }}>Ngày yêu cầu</th>
                                <th style={{ padding: '12px' }}>Đại lý</th>
                                <th style={{ padding: '12px' }}>Người tạo</th>
                                <th style={{ padding: '12px' }}>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((yc, idx) => (
                                <tr key={idx} style={{ textAlign: 'center', borderBottom: '1px solid #eee' }}>
                                    <td>{yc.idYeuCauXuatKho}</td>
                                    <td>{dayjs(yc.ngayYeuCau).format('DD/MM/YYYY')}</td>
                                    <td>{yc.daiLy?.tenDaiLy}</td>
                                    <td>{yc.nguoiTao?.tenTaiKhoan}</td>
                                    <td style={{ color: yc.idTrangThaiXacNhan === 2 ? 'green' : yc.idTrangThaiXacNhan === 3 ? 'red' : '#f59e0b' }}>{trangThaiMap[yc.idTrangThaiXacNhan]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                  
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'right', gap: '10px' }}>
                        <button onClick={exportPDF} style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: '6px' }}>📄 Xuất PDF</button>
                        <button onClick={exportExcel} style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: '6px' }}>📥 Xuất Excel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardYeuCauXuatKho;
