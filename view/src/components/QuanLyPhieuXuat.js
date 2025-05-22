import React, { useEffect, useState } from "react";
import "./QuanLyPhieuNhapKho.css";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import FormPhieuXuat from "./FormPhieuXuat";
import PopupChiTietPhieuXuat from "./PopupChiTietPhieuXuat";
import PopupChonYeuCau from "./PopupChonYeuCauXuatKho";
import './QuanLyPhieuXuat.css';
import { useNavigate } from 'react-router-dom';
import Pagination from './Pagination';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { useRef } from "react";

const QuanLyPhieuXuat = () => {
    const [list, setList] = useState([]);
    const [daiLyList, setDaiLyList] = useState([]);
    const [popup, setPopup] = useState(null);
    const [searchMa, setSearchMa] = useState("");
    const [searchDaiLy, setSearchDaiLy] = useState("");
    const [status, setStatus] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const exportRef = useRef();

    const [popupChonYC, setPopupChonYC] = useState(false);
    const [popupYCChiTiet, setPopupYCChiTiet] = useState(null);

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const fetchData = async () => {
        const res = await fetch("https://localhost:5288/api/phieuxuat");
        const data = await res.json();
        setList(data);

        const resDaiLy = await fetch("https://localhost:5288/api/daily");
        const daiLys = await resDaiLy.json();
        setDaiLyList(daiLys);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filtered = list.filter((px) => {
        const matchMa = px.idPhieuXuat.toString().includes(searchMa);
        const matchDaiLy = searchDaiLy
            ? px.yeuCauXuatKho?.daiLy?.tenDaiLy === searchDaiLy
            : true;
        const matchStatus = status
            ? px.yeuCauXuatKho?.trangThaiXacNhan?.tenTrangThai === status
            : true;
        const date = new Date(px.ngayXuat);
        const matchFrom = !fromDate || date >= new Date(fromDate);
        const matchTo = !toDate || date <= new Date(toDate);

        return matchMa && matchDaiLy && matchStatus && matchFrom && matchTo;
    });

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginatedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa phiếu xuất này không?")) {
            await fetch(`https://localhost:5288/api/phieuxuat/${id}`, {
                method: "DELETE",
            });
            fetchData();
        }
    };

    const handleChonYeuCau = async (yc) => {
        const res = await fetch(`https://localhost:5288/api/yeucauxuatkho/chitiet/${yc.idYeuCauXuatKho}`);
        const chiTiet = await res.json();
        setPopupChonYC(false);
        setPopupYCChiTiet({ ...yc, chiTietYeuCauXuatKhos: chiTiet });
    };
    const exportPDF = async () => {
        const element = exportRef.current;
        if (!element) return alert("Không tìm thấy nội dung!");

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const width = pdf.internal.pageSize.getWidth();
        const height = (canvas.height * width) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, width, height);
        pdf.save(`phieu_xuat_${popup.idPhieuXuat}.pdf`);
    };
    const exportExcel = () => {
        const wb = XLSX.utils.book_new();
        const header = [
            ["FPT SHOP"],
            ["PHIẾU XUẤT KHO"],
            [],
            [`Mã phiếu: ${popup.idPhieuXuat}`],
            [`Ngày xuất: ${new Date(popup.ngayXuat).toLocaleString("vi-VN")}`],
            [`Đại lý: ${popup.yeuCauXuatKho?.daiLy?.tenDaiLy}`],
            [`Ghi chú: ${popup.ghiChu || "Không có"}`],
            [],
            ["Tên sản phẩm", "Số lượng", "Đơn giá", "Thành tiền"]
        ];

        const rows = popup.chiTietPhieuXuats?.map(ct => [
            ct.sanPham?.tenSanPham || `SP ${ct.idSanPham}`,
            ct.soLuong,
            ct.donGia?.toLocaleString("vi-VN") || 0,
            ct.thanhTien?.toLocaleString("vi-VN") || 0
        ]) || [];

        const ws = XLSX.utils.aoa_to_sheet([...header, ...rows]);
        XLSX.utils.book_append_sheet(wb, ws, "PhieuXuat");
        XLSX.writeFile(wb, `phieu_xuat_${popup.idPhieuXuat}.xlsx`);
    };

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <div className="main-layout">
                    <Navbar />
                    <div className="container">
                        <h1 className="title">Quản lý phiếu xuất kho</h1>

                        <div className="search-form">
                            <input type="text" placeholder="Mã phiếu" value={searchMa} onChange={(e) => setSearchMa(e.target.value)} className="search-input" />
                            <input list="dai-ly-list" placeholder="Đại lý                               " value={searchDaiLy} onChange={(e) => setSearchDaiLy(e.target.value)} className="search-input" />
                            <datalist id="dai-ly-list">
                                {daiLyList.map((dl) => (
                                    <option key={dl.idDaiLy} value={dl.tenDaiLy} />
                                ))}
                            </datalist>
                           
                            <div className="date-group">
                                <label>Từ ngày:</label>
                                <input type="date" className="date-input" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                            </div>
                            <div className="date-group">
                                <label>Đến ngày:</label>
                                <input type="date" className="date-input" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                            </div>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <button className="search-button">🔍 Tìm kiếm</button>
                                <button className="reset-button" onClick={() => { setSearchMa(""); setSearchDaiLy(""); setStatus(""); setFromDate(""); setToDate(""); }}>🗑 Xóa tìm kiếm</button>
                            </div>
                        </div>

                        {user && ["Thủ kho", "Quản lý kho"].includes(user.tenChucVu) && (
                            <div style={{  gap: "10px"}}>
                                <div className="button-container">
                                    <button className="add-button" onClick={() => setPopupChonYC(true)}>
                                        + Tạo phiếu xuất từ yêu cầu
                                    </button>
                                   
                                </div>

                            </div>
                        )}
                        <p style={{ marginTop: 10 }}>
                            🔍 Tổng kết quả: <strong>{filtered.length}</strong>
                        </p>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mã PX</th>
                                    <th>Đại lý</th>
                                    <th>Thời gian</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map((px, idx) => (
                                    <tr key={px.idPhieuXuat}>
                                        <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                                        <td>{px.idPhieuXuat}</td>
                                        <td>{px.yeuCauXuatKho?.daiLy?.tenDaiLy || '—'}</td>
                                        <td>{new Date(px.ngayXuat).toLocaleString('vi-VN')}</td>
                                        <td>
                                            <button className="edit-btn" onClick={() => setPopup(px)}>👁️</button>
                                           
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

                        {popup && (
                            <div className="popup">
                                <div className="popup-inner">
                                    <button className="close-btn" onClick={() => setPopup(null)}>×</button>

                                    <div ref={exportRef}>
                                        <h2>📦 PHIẾU XUẤT KHO #{popup.idPhieuXuat}</h2>
                                        <p><strong>Đại lý:</strong> {popup.yeuCauXuatKho?.daiLy?.tenDaiLy}</p>
                                        <p><strong>Ngày xuất:</strong> {new Date(popup.ngayXuat).toLocaleString("vi-VN")}</p>
                                        <p><strong>Ghi chú:</strong> {popup.ghiChu || "Không có"}</p>

                                        <table className="sub-table">
                                            <thead>
                                                <tr>
                                                    <th>Sản phẩm</th>
                                                    <th>Số lượng</th>
                                                    <th>Đơn giá</th>
                                                    <th>Thành tiền</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {popup.chiTietPhieuXuats?.map((ct, idx) => (
                                                    <tr key={idx}>
                                                        <td>{ct.sanPham?.tenSanPham}</td>
                                                        <td>{ct.soLuong}</td>
                                                        <td>{ct.donGia?.toLocaleString("vi-VN")}</td>
                                                        <td>{ct.thanhTien?.toLocaleString("vi-VN")}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="popup-footer">
                                        <button onClick={exportExcel}>📥 Xuất Excel</button>
                                        <button onClick={exportPDF}>📄 Xuất PDF</button>
                                        <button className="cancel-button" onClick={() => setPopup(null)}>Đóng</button>
                                    </div>
                                </div>
                            </div>
                        )}


                        {popupChonYC && (
                            <PopupChonYeuCau onChon={handleChonYeuCau} onClose={() => setPopupChonYC(false)} />
                        )}

                        {popupYCChiTiet && (
                            <div className="popup-overlay">
                                <div className="popup-box">
                                    <h3>Chi tiết yêu cầu #{popupYCChiTiet.idYeuCauXuatKho}</h3>
                                    <p><strong>Đại lý:</strong> {popupYCChiTiet.daiLy?.tenDaiLy}</p>
                                    <p><strong>Ghi chú:</strong> {popupYCChiTiet.ghiChu || 'Không có'}</p>
                                    <p><strong>Ngày yêu cầu:</strong> {new Date(popupYCChiTiet.ngayYeuCau).toLocaleString()}</p>

                                    <h4>📦 Sản phẩm:</h4>
                                    <table className="sub-table">
                                        <thead>
                                            <tr>
                                                <th>Tên SP</th>
                                                <th>Số lượng</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {popupYCChiTiet.chiTietYeuCauXuatKhos.map((ct, i) => (
                                                <tr key={i}>
                                                    <td>{ct.sanPham?.tenSanPham || `SP ${ct.idSanPham}`}</td>
                                                    <td>{ct.soLuong}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <div style={{ marginTop: 16, textAlign: "right" }}>
                                        <button className="submit-button" onClick={() => {
                                            const dsSanPham = popupYCChiTiet.chiTietYeuCauXuatKhos.map(ct => ({
                                                idSanPham: ct.idSanPham,
                                                soLuong: ct.soLuong,
                                                tenSanPham: ct.sanPham?.tenSanPham
                                            }));
                                            navigate("/tao-phieu-xuat", {
                                                state: {
                                                    tuYeuCau: popupYCChiTiet,
                                                    dsSanPham
                                                }
                                            });
                                        }}>✔️ Duyệt và tạo phiếu</button>
                                        <button className="btn btn-cancel" onClick={() => setPopupYCChiTiet(null)}>Đóng</button>
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

export default QuanLyPhieuXuat;