import React, { useEffect, useState, useRef } from "react";
import Sidebar from '../common/Sidebar/Sidebar';
import Navbar from '../common/Navbar/Navbar';
import axios from "axios";
import "../nhapkho/FormTaoPhieuNhap.css";
import * as XLSX from "xlsx";
import PrintableTonKho from "./PrintableTonKho"; // thêm dòng này

import Pagination from "../common/Pagination/Pagination";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
    const daCanhBaoRef = useRef(false);

    useEffect(() => {
        if (!daCanhBaoRef.current) {
            fetch("https://localhost:5288/api/tonkho/canhbao-tonkho", { method: "POST" });
            daCanhBaoRef.current = true;
        }
    }, []);

    const handleExportExcel = () => {
        const wb = XLSX.utils.book_new();
        const header = [
            ["BÁO CÁO TỒN KHO"],
            [],
            ["Mã SP", "Danh mục", "Tên sản phẩm", "Thương hiệu", "Tồn hệ thống", "Tối thiểu", "Mô tả", "Trạng thái"]
        ];

        const rows = filteredData.map(sp => [
            sp.maSanPham,
            sp.danhMuc,
            sp.tenSanPham,
            sp.thuongHieu,
            sp.tonHeThong,
            sp.soLuongToiThieu,
            sp.moTa,
            getTrangThai(sp.tonHeThong, sp.soLuongToiThieu)
        ]);

        const sheet = XLSX.utils.aoa_to_sheet([...header, ...rows]);
        XLSX.utils.book_append_sheet(wb, sheet, "TonKho");

        XLSX.writeFile(wb, `bao_cao_ton_kho.xlsx`);
    };
    const handleExportPDF = async () => {
        const element = document.getElementById("tonkho-pdf");

        if (!element) return;

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = (canvas.height * pageWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
        pdf.save("bao_cao_ton_kho.pdf");
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
                    <h1 className="title">📦 QUẢN LÝ TỒN KHO</h1>

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
                                        <button onClick={resetSearch} className="reset-button">🔄 Reset</button>
                    </div>

                    <div style={{ overflowX: "auto" }} ref={printRef}>
                        <div style={{ margin: "20px 0", textAlign: "right" }}>
                            <button className="btn" onClick={handleExportExcel}>📊 Xuất Excel</button>
                            <button className="btn btn-primary" onClick={handleExportPDF}>📄 Xuất PDF</button>
                        </div>



                        <table className="data-table" style={{ width: "100%" }}>

                            <thead>
                                <tr>
                                    <th>Mã SP</th>
                                    <th>Danh mục</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Hình ảnh</th>

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
                                      
                                        <td>
                                            {sp.hinhAnh ? (
                                                <img
                                                    src={sp.hinhAnh.startsWith("http") ? sp.hinhAnh : `https://localhost:5288${sp.hinhAnh}`}
                                                    alt="ảnh"
                                                    style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }}
                                                />
                                            ) : (
                                                <span style={{ fontStyle: "italic", color: "#888" }}>Không có</span>
                                            )}
                                        </td>
                                        <td>{sp.thuongHieu}</td>
                                        <td>{sp.tonHeThong}</td>
                                        <td>{sp.soLuongToiThieu}</td>
                                       
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
            <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
                <div id="tonkho-pdf" ref={printRef}>
                    <PrintableTonKho data={filteredData} />
                </div>
            </div>

        </div>
    );
};

export default QuanLyTonKho;
