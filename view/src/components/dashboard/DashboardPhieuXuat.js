import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
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
import {    PieChart, Pie, Cell, LineChart, Line } from 'recharts';
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50'];

const DashboardPhieuXuat = () => {
    const [phieuXuats, setPhieuXuats] = useState([]);
    const [chiTietMap, setChiTietMap] = useState({});
    const [filterDaiLy, setFilterDaiLy] = useState(null);
    const [filterThang, setFilterThang] = useState('');
    const [filterNguoiXuat, setFilterNguoiXuat] = useState(null);
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
            const res = await axios.get(`https://localhost:5288/api/phieuxuat`);
            setPhieuXuats(res.data || []);

            const resCt = await axios.get(`https://localhost:5288/api/phieuxuat/chitiet/all`);
            const map = resCt.data || {};

            // map lại thành format cũ (thanhTien = tongTien)
            const newMap = {};
            for (const [id, list] of Object.entries(map)) {
                newMap[id] = list.map(ct => ({
                    ...ct,
                    thanhTien: ct.tongTien || 0
                }));
            }

            setChiTietMap(newMap);
        };
        fetchData();
    }, []);


    const uniqueYears = Array.from(
        new Set(phieuXuats.map(p => dayjs(p.ngayXuat).year()))
    ).sort((a, b) => b - a);


    const filteredPhieuXuats = phieuXuats.filter(p => {
        const matchDaiLy = filterDaiLy ? p.yeuCauXuatKho?.daiLy?.tenDaiLy === filterDaiLy.value : true;
        const matchNguoiXuat = filterNguoiXuat ? p.nguoiXuat === filterNguoiXuat.value : true;
        const matchThang = filterThang ? dayjs(p.ngayXuat).format('YYYY-MM') === filterThang : true;
        const matchKeyword = searchKeyword ? p.idPhieuXuat.toString().includes(searchKeyword) || p.nguoiXuat?.toLowerCase().includes(searchKeyword.toLowerCase()) : true;
        const matchDate =
            (!startDate || new Date(p.ngayXuat) >= startDate) &&
            (!endDate || new Date(p.ngayXuat) <= endDate);

        const matchYear = p.ngayXuat && dayjs(p.ngayXuat).year().toString() === filterYear.toString();
        return matchDaiLy && matchNguoiXuat && matchKeyword && matchDate && matchYear && matchThang;
    });

    const sortedPhieuXuats = [...filteredPhieuXuats].sort((a, b) => {
        if (sortOrder === 'asc') return new Date(a.ngayXuat) - new Date(b.ngayXuat);
        if (sortOrder === 'desc') return new Date(b.ngayXuat) - new Date(a.ngayXuat);
        return 0;
    });

    const paginatedPhieuXuats = sortedPhieuXuats.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredPhieuXuats.length / itemsPerPage);

    const tongPhieuXuat = filteredPhieuXuats.length;
    const tongTien = filteredPhieuXuats.flatMap(p => chiTietMap[p.idPhieuXuat] || []).reduce((sum, ct) => sum + (ct.thanhTien || 0), 0);
    const now = dayjs();
    const thangNayCount = filteredPhieuXuats.filter(p => dayjs(p.ngayXuat).isSame(now, 'month')).length;

    const daiLyCounts = {};
    filteredPhieuXuats.forEach(p => {
        const name = p.yeuCauXuatKho?.daiLy?.tenDaiLy;
        if (name) daiLyCounts[name] = (daiLyCounts[name] || 0) + 1;
    });
    const topDaiLy = Object.entries(daiLyCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Không có';

    const namHienTai = dayjs().year();
    const thangHienTai = dayjs().month() + 1;
    const soThang = Number(filterYear) === namHienTai ? thangHienTai : 12;

    const dataTheoThang = Array.from({ length: soThang }, (_, i) => {
        const thang = i + 1;
        const soPhieu = filteredPhieuXuats.filter(p => {
            const date = dayjs(p.ngayXuat);
            return date.year() === Number(filterYear) && date.month() + 1 === thang;
        }).length;

        const tongTienThang = filteredPhieuXuats
            .filter(p => {
                const date = dayjs(p.ngayXuat);
                return date.year() === Number(filterYear) && date.month() + 1 === thang;
            })
            .flatMap(p => chiTietMap[p.idPhieuXuat] || [])
            .reduce((sum, ct) => sum + (ct.thanhTien || 0), 0);

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
        pdf.save(`dashboard_xuat_${dayjs().format('YYYY-MM-DD')}.pdf`);
    };

    const exportExcel = () => {
        const data = filteredPhieuXuats.map(p => ({
            MaPhieu: p.idPhieuXuat,
            NgayXuat: dayjs(p.ngayXuat).format('DD/MM/YYYY'),
            DaiLy: p.yeuCauXuatKho?.daiLy?.tenDaiLy,
            NguoiXuat: p.nguoiXuat
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'PhieuXuat');
        XLSX.writeFile(wb, `phieu_xuat_${dayjs().format('YYYY-MM-DD')}.xlsx`);
    };

    const daiLyOptions = [...new Set(phieuXuats.map(p => p.yeuCauXuatKho?.daiLy?.tenDaiLy))].filter(Boolean).map(name => ({ value: name, label: name }));
    const nguoiXuatOptions = [...new Set(phieuXuats.map(p => p.nguoiXuat))].filter(Boolean).map(name => ({ value: name, label: name }));

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <Navbar />
                <div className="container" ref={exportRef}>
                    <h1 className="title">THỐNG KÊ PHIẾU XUẤT</h1>

                    <div style={{ display: 'flex', justifyContent: 'right', marginTop: '20px' }}>
                        <div>
                            <label>Năm: </label>
                            <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
                                {uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}
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
                        <span>Từ:</span>
                        <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
                        <span>Đến:</span>
                        <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'right', margin: '16px 0' }}>
                        <Select options={daiLyOptions} value={filterDaiLy} onChange={setFilterDaiLy} placeholder="Lọc theo đại lý" isClearable />
                      
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '20px' }}>
                        <Card title="Tổng phiếu xuất" value={tongPhieuXuat} />
                        <Card title="Tổng tiền xuất" value={tongTien.toLocaleString('vi-VN')} />
                        <Card title="Phiếu xuất tháng này" value={thangNayCount} />
                        <Card title="Đại lý nổi bật" value={topDaiLy} />
                    </div>

                    <div style={{ display: 'flex', gap: '32px', marginTop: '40px', justifyContent: 'center' }}>
                        <div>
                            <h3>Số phiếu theo tháng</h3>
                            <BarChart width={780} height={300} data={dataTheoThang} barCategoryGap={10}>
                                <XAxis dataKey="thang" />
                                <YAxis />
                                <Tooltip cursor={{ fill: "transparent" }} />
                                <Bar dataKey="soPhieu" fill="#8884d8" radius={[6, 6, 0, 0]} activeBar={false} />
                            </BarChart>

                        </div>
              
                  
                    </div>
                    <div style={{ display: 'flex', gap: '32px', marginTop: '40px', justifyContent: 'center' }}>
              
                        <div>
                            <h3>Giá trị xuất theo tháng</h3>
                            <LineChart width={880} height={300} margin={{ top: 20, right: 40, left: 100, bottom: 0 }}  data={dataTheoThang}>
                                <XAxis dataKey="thang" />
                                <YAxis
                                    tickFormatter={value => value.toLocaleString('vi-VN')}
                                    width={100} // 👈 THÊM DÒNG NÀY để tránh bị cắt
                                />


                                <Tooltip />
                                <CartesianGrid stroke="#ccc" />
                                <Line type="monotone" dataKey="tongTien" stroke="#82ca9d" />
                            </LineChart>
                        </div>


                    </div>
                    <div style={{ marginTop: '40px' }}>
                        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>📋 Danh sách phiếu xuất</h3>
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
                                <th style={{ padding: '12px' }}>Ngày xuất</th>
                                <th style={{ padding: '12px' }}>Đại lý</th>
                                <th style={{ padding: '12px' }}>Người xuất</th>
                                <th style={{ padding: '12px' }}>Tổng tiền</th>
                               
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedPhieuXuats.map(p => {
                                const tongTienPhieu = (chiTietMap[p.idPhieuXuat] || []).reduce((sum, ct) => sum + (ct.thanhTien || 0), 0);
                                const status = p.trangThai || "Chưa xác định";
                                return (
                                    <tr key={p.idPhieuXuat} style={{
                                        textAlign: 'center',
                                        borderBottom: '1px solid #e5e7eb',
                                        transition: 'background 0.2s',
                                        cursor: 'default'
                                    }} onMouseOver={e => e.currentTarget.style.background = '#f9fafb'}
                                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '10px' }}>{p.idPhieuXuat}</td>
                                        <td>{dayjs(p.ngayXuat).format('DD/MM/YYYY')}</td>
                                        <td>{p.yeuCauXuatKho?.daiLy?.tenDaiLy}</td>
                                        <td>{p.nguoiXuat}</td>
                                        <td>{tongTienPhieu.toLocaleString('vi-VN')}</td>
                                       
                                    </tr>
                                );
                            })}
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

export default DashboardPhieuXuat;