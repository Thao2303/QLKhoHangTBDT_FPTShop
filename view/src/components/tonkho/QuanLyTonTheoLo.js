import React, { useEffect, useState, useRef } from "react";
import Navbar from '../common/Navbar/Navbar';
import Sidebar from '../common/Sidebar/Sidebar';
import axios from "axios";
import Pagination from "../common/Pagination/Pagination";
import * as XLSX from "xlsx";
import { useReactToPrint } from "react-to-print";
import "../nhapkho/FormTaoPhieuNhap.css";

const removeVietnameseTones = (str) => {
    return str.normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .toLowerCase();
};

const QuanLyTonTheoLo = () => {
    const [tonLoList, setTonLoList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedNCC, setSelectedNCC] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const printRef = useRef();
    const handlePrint = useReactToPrint({ content: () => printRef.current });

    useEffect(() => {
        axios.get("https://localhost:5288/api/tonkho/lohang")
            .then(res => setTonLoList(res.data))
            .catch(() => alert("❌ Lỗi khi lấy tồn kho theo lô"));
    }, []);

    const resetSearch = () => {
        setSearchTerm("");
        setSelectedNCC("");
        setFromDate("");
        setToDate("");
    };

    const exportToExcel = () => {
        const data = filteredLoHang.map(item => ({
            "Mã SP": item.maSanPham,
            "Tên SP": item.tenSanPham,
            "Tên lô": item.tenLo,
            "Ngày nhập": new Date(item.ngayNhapLo).toLocaleDateString(),
            "Nhà cung cấp": item.tenNhaCungCap,
            "Số lượng nhập": item.soLuongNhap,
            "Còn lại": item.soLuongConLai,
            "Tình trạng": item.tinhTrang
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "TonTheoLo");
        XLSX.writeFile(wb, "ton_kho_theo_lo.xlsx");
    };

    const filteredLoHang = tonLoList.filter(item => {
        const keyword = removeVietnameseTones(searchTerm);
        const text = removeVietnameseTones(
            (item.tenSanPham || "") +
            (item.maSanPham || "") +
            (item.tenLo || "") +
            (item.tenNhaCungCap || "")
        );
        const matchSearch = text.includes(keyword);
        const matchNCC = selectedNCC ? item.tenNhaCungCap === selectedNCC : true;
        const matchDate = (!fromDate || new Date(item.ngayNhapLo) >= new Date(fromDate)) &&
            (!toDate || new Date(item.ngayNhapLo) <= new Date(toDate));
        return matchSearch && matchNCC && matchDate;
    });

    const paginatedData = filteredLoHang.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredLoHang.length / itemsPerPage);

    const nccList = [...new Set(tonLoList.map(x => x.tenNhaCungCap).filter(Boolean))];

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <Navbar />
                <div className="container">
                    <h1 className="title">📦 Tồn kho theo lô hàng</h1>

                    <div className="search-form">
                        <input
                            type="text"
                            placeholder="Tìm kiếm tên SP, mã SP, lô, NCC"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <select value={selectedNCC} onChange={(e) => setSelectedNCC(e.target.value)} className="filter-select">
                            <option value="">-- Nhà cung cấp --</option>
                            {nccList.map((ncc, idx) => <option key={idx} value={ncc}>{ncc}</option>)}
                        </select>
                        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="date-input" />
                        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="date-input" />
                        <button onClick={exportToExcel} className="export-button">📥 Xuất Excel</button>
                        <button onClick={handlePrint} className="export-button">🖨 In</button>
                        <button onClick={resetSearch} className="reset-button">🔄 Reset</button>
                    </div>

                    <div style={{ overflowX: "auto" }} ref={printRef}>
                        <table className="data-table" style={{ minWidth: 1200 }}>
                            <thead>
                                <tr>
                                    <th>Mã SP</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Tên lô</th>
                                    <th>Ngày nhập</th>
                                    <th>Nhà cung cấp</th>
                                    <th>Số lượng nhập</th>
                                    <th>Còn lại</th>
                                    <th>Tình trạng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{item.maSanPham}</td>
                                        <td>{item.tenSanPham}</td>
                                        <td>{item.tenLo}</td>
                                        <td>{new Date(item.ngayNhapLo).toLocaleDateString()}</td>
                                        <td>{item.tenNhaCungCap}</td>
                                        <td>{item.soLuongNhap}</td>
                                        <td>{item.soLuongConLai}</td>
                                        <td>{item.tinhTrang}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
            </div>
        </div>
    );
};

export default QuanLyTonTheoLo;