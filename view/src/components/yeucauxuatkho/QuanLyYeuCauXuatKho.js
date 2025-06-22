import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Navbar from '../common/Navbar/Navbar';
import Sidebar from '../common/Sidebar/Sidebar';
import Pagination from "../common/Pagination/Pagination";
import { FaHome, FaFileAlt } from "react-icons/fa";
import "../nhapkho/FormTaoPhieuNhap.css";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from 'xlsx';
import { saveAs } from "file-saver";
import { useRef } from "react";
import PrintableYeuCauXuat from "./PrintableYeuCauXuat";
import PopupChiTietYeuCau from "../common/ModalPopup/PopupChiTietYeuCau"
const removeVietnameseTones = (str) => {
    return str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
};

const QuanLyYeuCauXuatKho = () => {
    const [danhSachYeuCau, setDanhSachYeuCau] = useState([]);
    const [searchMaYC, setSearchMaYC] = useState("");
    const [searchDaiLy, setSearchDaiLy] = useState("");
    const [searchStatus, setSearchStatus] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [popupData, setPopupData] = useState(null);
    const [tonKhoMap, setTonKhoMap] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const exportRef = useRef();

    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"));
    const isThuKho = user?.tenChucVu === "Thủ kho";

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setCurrentPage(1);
    };

    const fetchData = async () => {
        try {
            const res = await fetch("https://qlkhohangtbdt-fptshop-be2.onrender.com/api/yeucauxuatkho");
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Lỗi server: ${res.status} - ${text}`);
            }
            const data = await res.json();

            setDanhSachYeuCau(data);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu yêu cầu:", error);
        }
    };

    useEffect(() => { fetchData(); }, []);

    useEffect(() => {
        if (location.state?.moPopupYeuCauId) {
            const id = location.state.moPopupYeuCauId;
            const yc = danhSachYeuCau.find(x => x.idYeuCauXuatKho === id);
            if (yc) handlePopup(yc);
        }
    }, [danhSachYeuCau, location.state]);

    const handleXoa = async (id) => {
        const xacNhan = window.confirm("Bạn có chắc muốn xoá yêu cầu này?");
        if (!xacNhan) return;

        try {
            await fetch(`https://qlkhohangtbdt-fptshop-be2.onrender.com/api/yeucauxuatkho/${id}`, { method: "DELETE" });
            alert("✅ Đã xoá thành công!");
            setDanhSachYeuCau(prev => prev.filter(yc => yc.idYeuCauXuatKho !== id));
        } catch (err) {
            console.error("❌ Lỗi xoá yêu cầu:", err);
            alert("Xoá thất bại");
        }
    };

    const handleDuyet = async (id) => {
        const confirm = window.confirm("Bạn có chắc muốn duyệt yêu cầu này?");
        if (!confirm) return;

        try {
            await fetch(`https://qlkhohangtbdt-fptshop-be2.onrender.com/api/yeucauxuatkho/duyet/${id}?chucVu=${user.tenChucVu}`, {
                method: "PUT"
            });
            alert("✅ Đã duyệt yêu cầu!");
            setPopupData(prev => ({ ...prev, idTrangThaiXacNhan: 2 }));
            fetchData();
        } catch (err) {
            console.error("❌ Lỗi duyệt:", err);
            alert("❌ Duyệt thất bại!");
        }
    };

    const handleTaoPhieuXuat = (yeuCau) => {
        const dsSanPham = yeuCau.chiTietYeuCauXuatKhos.map(ct => ({
            idSanPham: ct.idSanPham,
            soLuong: ct.soLuong,
            tenSanPham: ct.sanPham?.tenSanPham
        }));
        navigate("/tao-phieu-xuat", { state: { tuYeuCau: yeuCau, dsSanPham } });
    };

    const locDanhSach = danhSachYeuCau.filter(yc => {
        const matchMa = yc.idYeuCauXuatKho.toString().includes(searchMaYC);
        const matchDL = searchDaiLy
            ? removeVietnameseTones(yc.daiLy?.tenDaiLy || "").includes(removeVietnameseTones(searchDaiLy))
            : true;
        const matchStatus = searchStatus ? yc.idTrangThaiXacNhan.toString() === searchStatus : true;
        const formatDateLocal = (date) => format(new Date(date), 'yyyy-MM-dd');

        const matchDate =
            (!fromDate || formatDateLocal(yc.ngayYeuCau) >= fromDate) &&
            (!toDate || formatDateLocal(yc.ngayYeuCau) <= toDate);

        return matchMa && matchDL && matchStatus && matchDate;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = locDanhSach.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(locDanhSach.length / itemsPerPage);

    const handlePopup = async (yc) => {
        try {
            const res = await fetch(`https://qlkhohangtbdt-fptshop-be2.onrender.com/api/yeucauxuatkho/chitiet/${yc.idYeuCauXuatKho}`);
            const chiTiet = await res.json();
            setPopupData({ ...yc, chiTietYeuCauXuatKhos: chiTiet });

            const tonMap = {};
            for (const ct of chiTiet) {
                try {
                    const resTon = await fetch(`https://qlkhohangtbdt-fptshop-be2.onrender.com/api/yeucauxuatkho/tonkho/${ct.idSanPham}`);
                    tonMap[ct.idSanPham] = await resTon.json();
                } catch {
                    tonMap[ct.idSanPham] = "Lỗi";
                }
            }
            setTonKhoMap(tonMap);
        } catch (err) {
            alert("Không thể tải chi tiết.");
        }
    };
    const handleTuChoi = async (id) => {
        const xacNhan = window.confirm("Bạn có chắc muốn từ chối yêu cầu này?");
        if (!xacNhan) return;

        try {
            await fetch(`https://qlkhohangtbdt-fptshop-be2.onrender.com/api/yeucauxuatkho/tuchoi/${id}`, { method: "PUT" });
            alert("❌ Đã từ chối yêu cầu!");
            setPopupData(null); // 👉 đóng popup
            fetchData();        // 👉 reload danh sách

        } catch (error) {
            alert("❌ Từ chối thất bại!");
            console.error(error);
        }
    };

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
            pdf.save(`yeu_cau_xuat_${popupData?.idYeuCauXuatKho || "phieu"}.pdf`);
        } catch (error) {
            console.error("❌ Lỗi khi xuất PDF:", error);
            alert("Không thể tạo PDF. Vui lòng thử lại.");
        }
    };


    const exportExcel = () => {
        const wb = XLSX.utils.book_new();
        const wsData = [
            ["FPT Shop"],
            ["PHIẾU YÊU CẦU XUẤT KHO"],
            [],
            [`Mã yêu cầu:`, popupData.idYeuCauXuatKho],
            [`Đại lý:`, popupData.daiLy?.tenDaiLy],
            [`Ngày yêu cầu:`, new Date(popupData.ngayYeuCau).toLocaleString()],
            [`Lý do xuất:`, popupData.lyDoXuat || "Không có"],
            [`Hình thức:`, popupData.hinhThucXuat || "Không có"],
            [`Vận chuyển:`, popupData.phuongThucVanChuyen || "Không có"],
            [`Ghi chú:`, popupData.ghiChu || "Không có"],
            [],
            ["STT", "Tên sản phẩm", "Số lượng yêu cầu", "Tồn kho", "Ghi chú"]
        ];

        const rows = popupData.chiTietYeuCauXuatKhos.map((ct, idx) => {
            const ton = tonKhoMap[ct.idSanPham];
            const ok = typeof ton === 'number' && ton >= ct.soLuong;
            const ghiChu = ton === 'Lỗi' ? '⚠️ Không lấy được' : !ok ? 'Không đủ' : '✔️ Đủ';

            return [
                idx + 1,
                ct.sanPham?.tenSanPham || `SP ${ct.idSanPham}`,
                ct.soLuong,
                ton,
                ghiChu
            ];
        });

        const ws = XLSX.utils.aoa_to_sheet([...wsData, ...rows]);

        // Merge dòng tiêu đề
        ws["!merges"] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
            { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } }
        ];

        // Set column width cho dễ đọc
        ws["!cols"] = [
            { wch: 5 },  // STT
            { wch: 30 }, // Tên SP
            { wch: 15 }, // Số lượng
            { wch: 12 }, // Tồn kho
            { wch: 20 }  // Ghi chú
        ];

        // Style: tô đậm tiêu đề
        const boldCell = (cell) => {
            if (!cell.s) cell.s = {};
            cell.s.font = { bold: true };
        };

        boldCell(ws["A1"]);
        boldCell(ws["A2"]);

        for (let col = 0; col <= 4; col++) {
            const colLetter = String.fromCharCode(65 + col); // A, B, C...
            const headerCell = `${colLetter}${12}`; // Dòng tiêu đề table (dòng 13)
            if (ws[headerCell]) boldCell(ws[headerCell]);
        }

        XLSX.utils.book_append_sheet(wb, ws, "YeuCauXuatKho");
        XLSX.writeFile(wb, `yeu_cau_xuat_${popupData.idYeuCauXuatKho}.xlsx`);
    };


    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <Navbar />
         

                <div className="container">
                    <h1 className="title">QUẢN LÝ YÊU CẦU XUẤT KHO</h1>

                    <div className="search-form">
                        <input
                            type="text"
                            placeholder="🔍 Mã yêu cầu"
                            value={searchMaYC}
                            onChange={handleInputChange(setSearchMaYC)}
                            className="search-input"
                        />

                        <input
                            type="text"
                            placeholder="🔍 Tên đại lý"
                            value={searchDaiLy}
                            onChange={handleInputChange(setSearchDaiLy)}
                            className="search-input"
                        />

                        <select
                            value={searchStatus}
                            onChange={handleInputChange(setSearchStatus)}
                            className="filter-select"
                        >
                            <option value="">-- Trạng thái --</option>
                            <option value="1">⏳ Chờ duyệt</option>
                            <option value="2">✅ Đã duyệt</option>
                            <option value="3">❌ Đã từ chối</option>
                            <option value="4">🚚 Đã xuất kho</option>
                        </select>

                        <div className="date-group">
                            <label>Từ ngày:</label>
                            <DatePicker
                                selected={fromDate ? new Date(fromDate) : null}
                                onChange={(date) => {
                                    setFromDate(format(date, 'yyyy-MM-dd'));
                                    setCurrentPage(1);
                                }}
                                className="date-input"
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Chọn ngày"
                                className="date-input-custom"
                            />
                        </div>

                        <div className="date-group">
                            <label>Đến ngày:</label>
                            <DatePicker
                                selected={toDate ? new Date(toDate) : null}
                                onChange={(date) => {
                                    setToDate(format(date, 'yyyy-MM-dd'));
                                    setCurrentPage(1);
                                }}
                                className="date-input"
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Chọn ngày"
                                className="date-input-custom"
                            />
                        </div>
         

                   
                        <button className="search-button">🔍 Tìm</button>
                        <button
                            className="reset-button"
                            onClick={() => {
                                setSearchMaYC("");
                                setSearchDaiLy("");
                                setSearchStatus("");
                                setFromDate("");
                                setToDate("");
                                setCurrentPage(1);
                            }}
                        >
                            🧹 Reset
                        </button>
                    </div>


                    <button className="add-button" onClick={() => navigate("/tao-yeu-cau-xuat-kho")}>+ Gửi yêu cầu mới</button>
                    <p style={{ marginTop: 10 }}>
                        🔍 Tổng kết quả: <strong>{locDanhSach.length}</strong>
                    </p>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã yêu cầu</th>
                                <th>Đại lý</th>
                                <th>Thời gian</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((yc, idx) => (
                                <tr key={yc.idYeuCauXuatKho}>
                                    <td>{indexOfFirstItem + idx + 1}</td>
                                    <td>{yc.idYeuCauXuatKho}</td>
                                    <td>{yc.daiLy?.tenDaiLy || '---'}</td>
                                    <td>{new Date(yc.ngayYeuCau).toLocaleString()}</td>

                                    <td>
                                        {yc.idTrangThaiXacNhan === 1 ? '⏳ Chờ duyệt' :
                                            yc.idTrangThaiXacNhan === 2 ? '✅ Đã duyệt' :
                                                yc.idTrangThaiXacNhan === 3 ? '❌ Từ chối' :
                                                    yc.idTrangThaiXacNhan === 4 ? '🚚 Đã xuất kho' : '---'}
                                    </td>

                                    <td>
                                        <button className="view-btn" onClick={() => handlePopup(yc)}>🔍</button>

                                        {/* ✏️ Chỉ hiển thị nếu chưa duyệt */}
                                        {yc.idTrangThaiXacNhan === 1 && (
                                            <>
                                                <button className="edit-btn" onClick={() => navigate(`/sua-yeu-cau-xuat-kho/${yc.idYeuCauXuatKho}`)}>✏️</button>
                                                <button className="delete-btn" onClick={() => handleXoa(yc.idYeuCauXuatKho)}>🗑</button>
                                            </>
                                        )}

                                       
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    {popupData && (
                        <PopupChiTietYeuCau
                            data={popupData}
                            tonKhoMap={tonKhoMap}
                            onClose={() => setPopupData(null)}
                            onTaoPhieu={handleTaoPhieuXuat}
                            onDuyet={handleDuyet}
                            isThuKho={isThuKho}
                            onTuChoi={handleTuChoi}
                        />
                    )}



                        </div>
             
            </div>
        </div>
    );
};

export default QuanLyYeuCauXuatKho;
