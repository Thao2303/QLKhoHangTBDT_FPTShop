import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar/Navbar';
import Sidebar from '../common/Sidebar/Sidebar';
import "./FormTaoPhieuNhap.css";
import Pagination from "../common/Pagination/Pagination";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useLocation } from 'react-router-dom';
import autoTable from 'jspdf-autotable';
import PrintablePhieuNhap from "./PrintablePhieuNhap";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import html2pdf from "html2pdf.js";
import { createRoot } from "react-dom/client"; 
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';


import Select from 'react-select';

const removeVietnameseTones = (str) => {
    return str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
};

const numberToWords = require('number-to-words'); // nếu dùng thư viện này cần npm i number-to-words

const QuanLyPhieuNhapKho = () => {
    const [phieuNhaps, setPhieuNhaps] = useState([]);
    const [searchMaPhieu, setSearchMaPhieu] = useState("");
    const [selectedNhaCungCap, setSelectedNhaCungCap] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [popupData, setPopupData] = useState(null);
    const [chiTietSanPham, setChiTietSanPham] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const location = useLocation();
    const API_BASE_URL = "https://localhost:5288/api";
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const isThuKho = user?.tenChucVu === "Thủ kho";
    const exportRef = useRef();
    const [searchNguoiTao, setSearchNguoiTao] = useState("");
    const [selectedNguoiTao, setSelectedNguoiTao] = useState(null);
       const queryParams = new URLSearchParams(location.search);
    const focusId = queryParams.get("focus");
    const [internalFocusId, setInternalFocusId] = useState(focusId);

    useEffect(() => {
        fetch(`${API_BASE_URL}/phieunhap`)
            .then((res) => res.json())
            .then((data) => {
                setPhieuNhaps(data);
            })
            .catch((error) => console.error("Lỗi lấy dữ liệu:", error));
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const idPhieu = params.get("id");

        if (idPhieu) {
            fetch(`${API_BASE_URL}/phieunhap/${idPhieu}`)
                .then(res => res.json())
                .then(phieu => {
                    setPopupData(phieu);
                    return fetch(`${API_BASE_URL}/phieunhap/chitiet/${idPhieu}`);
                })
                .then(res => res.json())
                .then(setChiTietSanPham)
                .catch(console.error);
        }
    }, [location.search]);


    useEffect(() => {
        const idPhieu = location.state?.moPopupPhieuNhapId;
        if (idPhieu) {
            fetch(`${API_BASE_URL}/phieunhap/${idPhieu}`)
                .then(res => res.json())
                .then(phieu => {
                    setPopupData(phieu);
                    return fetch(`${API_BASE_URL}/phieunhap/chitiet/${idPhieu}`);
                })
                .then(res => res.json())
                .then(setChiTietSanPham)
                .catch(console.error);
        }
    }, [location.state]);

    useEffect(() => {
        const idPhieu = location.state?.moPopupPhieuNhapId;
        if (idPhieu) {
            fetch(`${API_BASE_URL}/phieunhap/${idPhieu}`)
                .then(res => res.json())
                .then(phieu => {
                    setPopupData(phieu);
                    return fetch(`${API_BASE_URL}/phieunhap/chitiet/${idPhieu}`);
                })
                .then(res => res.json())
                .then(setChiTietSanPham)
                .catch(console.error);
        }
    }, [location.state]);
    const exportPDF = async () => {
        const element = exportRef.current;

        if (!element) {
            alert("Không tìm thấy nội dung cần in.");
            return;
        }

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: false
            });

            const imgData = canvas.toDataURL("image/png", 1.0);

            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`phieu_nhap_${popupData?.idPhieuNhap || "phieu"}.pdf`);
        } catch (error) {
            console.error("❌ Lỗi khi xuất PDF:", error);
            alert("Không thể tạo PDF. Vui lòng thử lại.");
        }
    };

    const exportToExcel = (phieu, chiTiet) => {
        const XLSX = require("xlsx");
        const wb = XLSX.utils.book_new();

        const tongTien = chiTiet.reduce((sum, ct) => sum + ct.tongTien, 0);

        const header = [
            ["CÔNG TY CỔ PHẦN BÁN LẺ KỸ THUẬT SỐ FPT (FPT SHOP)"],
            ["PHIẾU NHẬP KHO"],
            [],
            [`Ngày nhập: ${new Date(phieu.ngayNhap).toLocaleDateString("vi-VN")}`],
            [`Mã phiếu: ${phieu.idPhieuNhap}`],
            [`Nhà cung cấp: ${phieu.nhaCungCap?.tenNhaCungCap || ""}`],
            [`Người lập phiếu: ${phieu.nguoiTao || ""}`],
            [`Ghi chú: ${phieu.ghiChu || "Không có"}`],
            [
                `Trạng thái: ${phieu.trangThai === 1
                    ? "⏳ Chờ duyệt"
                    : phieu.trangThai === 2
                        ? "✅ Đã duyệt"
                        : phieu.trangThai === 3
                            ? "❌ Từ chối"
                            : "↩️ Hoàn hàng"
                }`,
            ],
            [],
            ["STT", "Tên SP", "Mã SP", "SL C.Từ", "SL Nhập", "Đơn giá", "Thành tiền"],
        ];

        const rows = chiTiet.map((ct, idx) => [
            idx + 1,
            ct.sanPham?.tenSanPham || "",
            ct.sanPham?.idSanPham || "",
            ct.soLuongTheoChungTu || 0,
            ct.soLuongThucNhap || 0,
            ct.donGia || 0,
            ct.tongTien || 0,
        ]);

        const total = [["", "", "", "", "", "Tổng cộng", tongTien]];

        const sign = [
            [],
            ["Người lập phiếu", "", "", "Người giao hàng", "", "Thủ kho"],
        ];

        const data = [...header, ...rows, [], ...total, ...sign];

        const ws = XLSX.utils.aoa_to_sheet(data);

        // 🔲 Thêm viền bảng từ dòng 11 đến dòng dữ liệu + dòng tổng cộng
        const borderStartRow = header.length + 1;
        const borderEndRow = borderStartRow + rows.length;

        for (let R = borderStartRow; R <= borderEndRow; ++R) {
            for (let C = 0; C <= 6; ++C) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                if (!ws[cellAddress]) ws[cellAddress] = { t: "s", v: "" };
                ws[cellAddress].s = {
                    border: {
                        top: { style: "thin", color: { rgb: "000000" } },
                        bottom: { style: "thin", color: { rgb: "000000" } },
                        left: { style: "thin", color: { rgb: "000000" } },
                        right: { style: "thin", color: { rgb: "000000" } },
                    },
                };
            }
        }

        // 📏 Cột rộng đẹp
        ws["!cols"] = [
            { wch: 5 },
            { wch: 35 },
            { wch: 10 },
            { wch: 10 },
            { wch: 10 },
            { wch: 12 },
            { wch: 15 },
        ];

        // 👨‍💼 Gộp ô dòng chữ ký cho đều
        ws["!merges"] = [
            { s: { r: data.length - 1, c: 0 }, e: { r: data.length - 1, c: 2 } },
            { s: { r: data.length - 1, c: 3 }, e: { r: data.length - 1, c: 4 } },
            { s: { r: data.length - 1, c: 5 }, e: { r: data.length - 1, c: 6 } },
        ];

        XLSX.utils.book_append_sheet(wb, ws, "PhieuNhap");
        XLSX.writeFile(wb, `phieu_nhap_${phieu.idPhieuNhap}.xlsx`);
    };


    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setCurrentPage(1); // reset về trang đầu
    };

    const resetSearch = () => {
        setSearchMaPhieu("");
        setSelectedNhaCungCap("");
        setFilterStatus("");
        setFromDate("");
        setToDate("");
        setSelectedNguoiTao(null);

    };

    const handleEdit = (id) => navigate(`/sua-phieu-nhap/${id}`);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xoá phiếu nhập này?");
        if (!confirmDelete) return;

        try {
            await fetch(`${API_BASE_URL}/phieunhap/${id}`, { method: 'DELETE' });
            setPhieuNhaps(prev => prev.filter(p => p.idPhieuNhap !== id));
            alert("✅ Đã xoá thành công!");
        } catch (error) {
            console.error("Lỗi khi xoá phiếu nhập:", error);
            alert("❌ Xoá thất bại!");
        }
    };

    const handleDuyet = async (id) => {
        const xacNhan = window.confirm("Bạn có chắc muốn duyệt phiếu này?");
        if (!xacNhan) return;

        try {
            await fetch(`${API_BASE_URL}/phieunhap/duyet/${id}`, { method: "PUT" });
            alert("✅ Đã duyệt!");

            const res = await fetch(`${API_BASE_URL}/phieunhap`);
            const data = await res.json();
            setPhieuNhaps(data);

            // 🔍 Lấy người tạo từ danh sách
            const phieu = data.find(p => p.idPhieuNhap === id);
            const idNguoiTao = phieu?.idTaiKhoan;

          

        } catch (error) {
            alert("❌ Duyệt thất bại!");
        }
    };


    const filteredPhieuNhaps = phieuNhaps.filter((phieu) => {
        const matchMa = phieu.idPhieuNhap.toString().includes(searchMaPhieu);
        const matchNCC = selectedNhaCungCap
            ? removeVietnameseTones(phieu.nhaCungCap?.tenNhaCungCap || "").includes(removeVietnameseTones(selectedNhaCungCap))
            : true;
        const matchStatus = filterStatus ? phieu.trangThai.toString() === filterStatus : true;
        const matchNguoiTao = searchNguoiTao
            ? removeVietnameseTones(phieu.nguoiTao || "").includes(removeVietnameseTones(searchNguoiTao))
            : true;

        // ✅ Chuyển ngày về dạng yyyy-MM-dd theo local (KHÔNG dùng toISOString)
        const formatDateLocal = (date) => format(new Date(date), 'yyyy-MM-dd');

        const matchDate =
            (!fromDate || formatDateLocal(phieu.ngayNhap) >= fromDate) &&
            (!toDate || formatDateLocal(phieu.ngayNhap) <= toDate);

        return matchMa && matchNCC && matchStatus && matchDate && matchNguoiTao;

    });

    const totalPages = Math.ceil(filteredPhieuNhaps.length / itemsPerPage);
    const paginatedData = filteredPhieuNhaps.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePopup = async (phieu) => {
        const res = await fetch(`${API_BASE_URL}/phieunhap/chitiet/${phieu.idPhieuNhap}`);
        const data = await res.json();
        setChiTietSanPham(data);
        setPopupData(phieu);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getTongThanhTien = () => {
        return chiTietSanPham.reduce((sum, ct) => sum + (Number(ct.tongTien) || 0), 0);
    };

    const handleTuChoi = async (id) => {
        const xacNhan = window.confirm("Bạn có chắc muốn từ chối phiếu này?");
        if (!xacNhan) return;

        try {
            await fetch(`${API_BASE_URL}/phieunhap/tuchoi/${id}`, { method: "PUT" });
            alert("❌ Đã từ chối!");
            const res = await fetch(`${API_BASE_URL}/phieunhap`);
            const data = await res.json();
            setPhieuNhaps(data);
        } catch (error) {
            alert("❌ Từ chối thất bại!");
        }
    };

    useEffect(() => {
        const id = parseInt(focusId);
        if (!id || !filteredPhieuNhaps.length) return;

        const index = filteredPhieuNhaps.findIndex(p => p.idPhieuNhap === id);
        if (index === -1) return;

        const page = Math.floor(index / itemsPerPage) + 1;
        setCurrentPage(page);
        setInternalFocusId(focusId); // lưu lại để style dòng

        // 🕒 Xoá focus khỏi URL sau 1 giây để không mất style liền
        setTimeout(() => {
            const newParams = new URLSearchParams(location.search);
            newParams.delete("focus");
            navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
        }, 1000);
    }, [focusId, filteredPhieuNhaps]);


    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <div className="main-layout">
                    <Navbar />
                    <div className="container">
                        <h1 className="title">✉️ QUẢN LÝ PHIẾU NHẬP KHO</h1>

                        <div className="search-form">
                            <input type="text" placeholder="Mã phiếu" value={searchMaPhieu} onChange={handleInputChange(setSearchMaPhieu)} className="search-input" />
                            <Select
                                options={[...new Set(phieuNhaps.map(p => p.nhaCungCap?.tenNhaCungCap))]
                                    .filter(Boolean)
                                    .map(name => ({ value: name, label: name }))}
                                value={selectedNhaCungCap ? { value: selectedNhaCungCap, label: selectedNhaCungCap } : null}
                                onChange={(selected) => setSelectedNhaCungCap(selected ? selected.value : "")}
                                placeholder="Nhà cung cấp"
                                isClearable
                                className="search-select"
                            />

                            <Select
                                options={[...new Set(phieuNhaps.map(p => p.nguoiTao))]
                                    .filter(Boolean)
                                    .map(name => ({ value: name, label: name }))}
                                value={selectedNguoiTao}
                                onChange={(selected) => {
                                    setSelectedNguoiTao(selected);
                                    setSearchNguoiTao(selected ? selected.value : "");
                                }}
                                placeholder="Người tạo"
                                isClearable
                                className="search-select"
                            />

                            <select value={filterStatus} onChange={handleInputChange(setFilterStatus)} className="filter-select">
                                <option value="">-- Trạng thái --</option>
                                <option value="1">Chờ duyệt</option>
                                <option value="2">Đã duyệt</option>
                                <option value="3">Từ chối</option>
                                <option value="4">Hoàn hàng</option>
                            </select>

                            <div className="date-group">
                                <label>Từ ngày:</label>
                                <DatePicker
                                    selected={fromDate ? new Date(fromDate) : null}
                                    onChange={(date) => setFromDate(date ? format(date, 'yyyy-MM-dd') : "")}

                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="Chọn ngày bắt đầu"
                                    className="date-input-custom"
                                />
                            </div>

                            <div className="date-group">
                                <label>Đến ngày:</label>
                                <DatePicker
                                    selected={toDate ? new Date(toDate) : null}
                                    onChange={(date) => setToDate(date ? format(date, 'yyyy-MM-dd') : "")}

                                 
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="Chọn ngày kết thúc"
                                    className="date-input-custom"
                                />
                            </div>



                            <div className="search-actions">
                                <button className="search-button">🔍 Tìm kiếm</button>
                                <button className="reset-button" onClick={resetSearch}>🗑 Reset</button>
                            </div>
                        </div>


                        <button className="add-button" onClick={() => navigate("/them-phieu-nhap")}>+ Tạo phiếu nhập kho</button>
                        <p style={{ marginTop: 10 }}>
                            🔍 Tổng kết quả: <strong>{filteredPhieuNhaps.length}</strong>
                        </p>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mã phiếu</th>
                                    <th>Nhà cung cấp</th>
                                    <th>Thời gian</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map((phieu, index) => (
                                    <tr
                                        key={phieu.idPhieuNhap}
                                        style={
                                            phieu.idPhieuNhap.toString() === internalFocusId
                                                ? { backgroundColor: "#fff7d6", fontWeight: "bold" }
                                                : {}
                                        }
                                    >


                                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        <td>{phieu.idPhieuNhap}</td>
                                        <td>{phieu.nhaCungCap?.tenNhaCungCap}</td>
                                        <td>{format(new Date(phieu.ngayNhap), "dd/MM/yyyy")}</td>

                                        <td>
                                            {phieu.trangThai === 1 ? (
                                                <span title="Phiếu đang chờ thủ kho duyệt">⏳ Chờ duyệt</span>
                                            ) : phieu.trangThai === 2 ? (
                                                <span title="Phiếu đã được duyệt và nhập hàng vào kho">✅ Đã duyệt</span>
                                            ) : phieu.trangThai === 3 ? (
                                                <span title="Phiếu đã bị từ chối, không nhập kho">❌ Từ chối</span>
                                            ) : (
                                                <span title="Phiếu đã hoàn hàng, hàng trả lại NCC">↩️ Hoàn hàng</span>
                                            )}
                                        </td>

                                        <td>
                                            <button onClick={() => handlePopup(phieu)}>🔍</button>
                                            {phieu.trangThai === 1 && user?.idTaiKhoan === phieu.idTaiKhoan && (
                                                <>
                                                    <button className="edit-btn" onClick={() => handleEdit(phieu.idPhieuNhap)}>✏️</button>
                                                    <button className="delete-btn" onClick={() => handleDelete(phieu.idPhieuNhap)}>🗑</button>
                                                </>
                                            )}

                                            {isThuKho && phieu.trangThai === 1 && (
                                                <>
                                                    <button className="approve-btn" onClick={() => handleDuyet(phieu.idPhieuNhap)}>✔️ Duyệt</button>
                                                    <button className="reject-btn" onClick={() => handleTuChoi(phieu.idPhieuNhap)}>❌ Từ chối</button>
                                                </>
                                            )}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />

                        {popupData && (
                            <div className="popup">
                                <div className="popup-inner" style={{ position: 'relative' }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        zIndex: 10
                                    }}>
                                        <button
                                            onClick={() => setPopupData(null)}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                fontSize: '24px',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                color: '#333'
                                            }}
                                            title="Đóng"
                                        >
                                            ×
                                        </button>
                                    </div>


                                
                                    <h1 className="title">📦 CHI TIẾT PHIẾU NHẬP #{popupData.idPhieuNhap}</h1>

                                    <div className="info-row"><label>🏢 Nhà cung cấp:</label> {popupData.nhaCungCap?.tenNhaCungCap}</div>
                                    <div className="info-row"><label>👤 Người tạo:</label> {popupData.nguoiTao || 'Không rõ'}</div>
                                    <div className="info-row"><label>📅 Ngày nhập:</label> {new Date(popupData.ngayNhap).toLocaleString()}</div>
                                    <div className="info-row"><label>📝 Ghi chú:</label> {popupData.ghiChu || 'Không có'}</div>
                                    <div className="info-row"><label>📌 Trạng thái:</label> {
                                        popupData.trangThai === 1 ? '⏳ Chờ duyệt' :
                                            popupData.trangThai === 2 ? '✅ Đã duyệt' :
                                                popupData.trangThai === 3 ? '❌ Từ chối' : '↩️ Hoàn hàng'
                                    }</div>

                                    <h4 style={{ marginTop: 16 }}>🧾 Danh sách sản phẩm:</h4>
                                    <div style={{ overflowX: "auto" }}>
                                        <table className="sub-table" style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid #ccc' }}>

                                            <thead>
                                                <tr>
                                                    <th>Sản phẩm</th>
                                                    <th>Số lượng chứng từ</th>
                                                    <th>Số lượng thực nhập</th>
                                                    <th>Đơn giá</th>
                                                    <th>Thành tiền</th>
                                                    <th>Vị trí</th> {/* 🔹 Tên vị trí (Dãy-Cột-Tầng) */}
                                                    <th>Số lượng</th> {/* 🔹 Số lượng tại vị trí đó */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {chiTietSanPham.map((ct, idx) => (
                                                    ct.viTri && ct.viTri.length > 0 ? (
                                                        ct.viTri.map((v, i) => (
                                                            <tr key={`vitri-${ct.idSanPham}-${v.idViTri}-${i}`}>
                                                                {i === 0 && (
                                                                    <>
                                                                        <td rowSpan={ct.viTri.length} style={{ textAlign: 'left' }}>{ct.sanPham?.tenSanPham}</td>
                                                                        <td rowSpan={ct.viTri.length}>{ct.soLuongTheoChungTu}</td>
                                                                        <td rowSpan={ct.viTri.length}>{ct.soLuongThucNhap}</td>
                                                                        <td rowSpan={ct.viTri.length}>{Number(ct.donGia || 0).toLocaleString()}</td>
                                                                        <td rowSpan={ct.viTri.length}>{Number(ct.tongTien || 0).toLocaleString()}</td>
                                                                    </>
                                                                )}
                                                                <td>{v.day}-{v.cot}-{v.tang}</td>
                                                                <td>{v.soLuong}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr key={`vitri-${ct.idSanPham}-none`}>
                                                            <td style={{ textAlign: 'left' }}>{ct.sanPham?.tenSanPham}</td>
                                                            <td>{ct.soLuongTheoChungTu}</td>
                                                            <td>{ct.soLuongThucNhap}</td>
                                                            <td>{Number(ct.donGia || 0).toLocaleString()}</td>
                                                            <td>{Number(ct.tongTien || 0).toLocaleString()}</td>
                                                            <td colSpan="2"><em>Không có</em></td>
                                                        </tr>
                                                    )
                                                ))}
                                            </tbody>

                                            <tfoot>
                                                <tr>
                                                    <td colSpan="4" style={{ textAlign: 'right', fontWeight: 'bold' }}>Tổng thành tiền:</td>
                                                    <td style={{ fontWeight: 'bold' }}>{getTongThanhTien().toLocaleString()}</td>
                                                    <td></td>
                                                </tr>
                                            </tfoot>
                                        </table>

                                    </div>
                       
                                    
                                    <div className="popup-footer">
                                        <button className="btn-export excel" onClick={() => exportToExcel(popupData, chiTietSanPham)}>
                                            📗 Xuất Excel
                                        </button>

                                        <button className="btn-export pdf" onClick={exportPDF}>
                                            📄 Xuất PDF
                                        </button>

                                        <button className="btn-export close" onClick={() => setPopupData(null)}>
                                            ❌ Đóng
                                        </button>

                                        <div style={{ position: "absolute", left: "-9999px", top: "0" }}>
                                            <div ref={exportRef}>
                                                <PrintablePhieuNhap phieu={popupData} chiTiet={chiTietSanPham} />
                                            </div>
                                        </div>
                                    </div>


                                </div>

                            </div>
                        )}

                       

                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuanLyPhieuNhapKho;