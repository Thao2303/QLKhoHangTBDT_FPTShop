﻿import React, { useEffect, useState, useRef } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";
import "./FormTaoPhieuNhap.css";
import * as XLSX from "xlsx";
import { useReactToPrint } from "react-to-print";
import Pagination from "./Pagination";

const removeVietnameseTones = (str) => {
    return str.normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .toLowerCase();
};

const QuanLyTonKho = () => {
    const [tonKhoList, setTonKhoList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDanhMuc, setSelectedDanhMuc] = useState("");
    const [selectedThuongHieu, setSelectedThuongHieu] = useState("");
    const [selectedTrangThai, setSelectedTrangThai] = useState("");
    const [danhMucs, setDanhMucs] = useState([]);
    const [thuongHieus, setThuongHieus] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const printRef = useRef();
    const handlePrint = useReactToPrint({ content: () => printRef.current });

    useEffect(() => {
        axios.get("https://localhost:5288/api/tonkho")
            .then(res => setTonKhoList(res.data))
            .catch(() => alert("❌ Lỗi khi lấy dữ liệu tồn kho"));

        axios.get("https://localhost:5288/api/danhmuc")
            .then(res => setDanhMucs(res.data));

        axios.get("https://localhost:5288/api/thuonghieu")
            .then(res => setThuongHieus(res.data));
    }, []);

    const handleUpdateSoLuongToiThieu = async (idSanPham, newVal) => {
        try {
            await axios.put(`https://localhost:5288/api/sanpham/update-toithieu/${idSanPham}`, {
                soLuongToiThieu: parseInt(newVal)
            });
            setTonKhoList(prev => prev.map(sp => sp.idSanPham === idSanPham ? { ...sp, soLuongToiThieu: parseInt(newVal) } : sp));
        } catch {
            alert("❌ Lỗi cập nhật tối thiểu");
        }
    };
    useEffect(() => {
        fetch("https://localhost:5288/api/tonkho/canhbao-tonkho", { method: "POST" });
    }, []);

    const exportToExcel = () => {
        const data = filteredData.map(sp => ({
            "Mã SP": sp.maSanPham,
            "Tên SP": sp.tenSanPham,
            "Danh mục": sp.danhMuc,
            "Thương hiệu": sp.thuongHieu,
            "Tồn kho": sp.tonHeThong,
            "Tối thiểu": sp.soLuongToiThieu,
            "Mô tả": sp.moTa
        }));
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "TonKho");
        XLSX.writeFile(workbook, "ton_kho.xlsx");
    };

    const resetSearch = () => {
        setSearchTerm("");
        setSelectedDanhMuc("");
        setSelectedThuongHieu("");
        setSelectedTrangThai("");
    };

    const getTrangThai = (ton, toiThieu) => {
        return ton < toiThieu ? "⚠️ Cần nhập" : "✅ Ổn định";
    };

    const filteredData = tonKhoList.filter(item => {
        const keyword = removeVietnameseTones(searchTerm);
        const text = removeVietnameseTones(item.tenSanPham + item.maSanPham + item.thuongHieu);
        const matchText = text.includes(keyword);
        const matchDM = selectedDanhMuc ? item.danhMuc === selectedDanhMuc : true;
        const matchTH = selectedThuongHieu ? item.thuongHieu === selectedThuongHieu : true;
        const matchTrangThai = selectedTrangThai
            ? (selectedTrangThai === "1" ? item.tonHeThong < item.soLuongToiThieu : item.tonHeThong >= item.soLuongToiThieu)
            : true;
        return matchText && matchDM && matchTH && matchTrangThai;
    });

    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <Navbar />
                <div className="container">
                    <h1 className="title">📦 Quản lý tồn kho</h1>

                    <div className="search-form">
                        <input
                            type="text"
                            placeholder="Tìm kiếm tên, mã, thương hiệu"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <select value={selectedDanhMuc} onChange={(e) => setSelectedDanhMuc(e.target.value)} className="filter-select">
                            <option value="">-- Danh mục --</option>
                            {danhMucs.map(dm => <option key={dm.idDanhMuc} value={dm.tenDanhMuc}>{dm.tenDanhMuc}</option>)}
                        </select>
                        <select value={selectedThuongHieu} onChange={(e) => setSelectedThuongHieu(e.target.value)} className="filter-select">
                            <option value="">-- Thương hiệu --</option>
                            {thuongHieus.map(th => <option key={th.idThuongHieu} value={th.tenThuongHieu}>{th.tenThuongHieu}</option>)}
                        </select>
                        <select value={selectedTrangThai} onChange={(e) => setSelectedTrangThai(e.target.value)} className="filter-select">
                            <option value="">-- Trạng thái --</option>
                            <option value="1">⚠️ Cần nhập</option>
                            <option value="2">✅ Ổn định</option>
                        </select>
                        <button onClick={exportToExcel} className="export-button">📤 Xuất Excel</button>
                        <button onClick={handlePrint} className="export-button">🖨 In</button>
                        <button onClick={resetSearch} className="reset-button">🔄 Reset</button>
                    </div>

                    <div style={{ overflowX: "auto" }} ref={printRef}>
                        <table className="data-table" style={{ width: "100%" }}>

                            <thead>
                                <tr>
                                    <th>Mã SP</th>
                                    <th>Danh mục</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Thương hiệu</th>
                                    <th>Tồn hệ thống</th>
                                    <th>Tối thiểu</th>
                                    <th>Mô tả</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map((sp, index) => (
                                    <tr key={index} style={{ backgroundColor: sp.tonHeThong < sp.soLuongToiThieu ? "#ffebeb" : "" }}>
                                        <td>{sp.maSanPham}</td>
                                        <td>{sp.danhMuc}</td>
                                        <td style={{ whiteSpace: "pre-wrap", maxWidth: 250, wordWrap: "break-word" }}>{sp.tenSanPham}</td>
                                        <td>{sp.thuongHieu}</td>
                                        <td>{sp.tonHeThong}</td>
                                        <td>
                                            <input
                                                type="number"
                                                value={sp.soLuongToiThieu}
                                                onChange={(e) => handleUpdateSoLuongToiThieu(sp.idSanPham, e.target.value)}
                                                style={{ width: 60 }}
                                            />
                                        </td>
                                        <td style={{ whiteSpace: "pre-wrap", maxWidth: 250, wordWrap: "break-word" }}>{sp.moTa}</td>

                                        <td>{getTrangThai(sp.tonHeThong, sp.soLuongToiThieu)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
                </div>
            </div>
        </div>
    );
};

export default QuanLyTonKho;
