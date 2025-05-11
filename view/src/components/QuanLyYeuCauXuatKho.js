// 📁 QuanLyYeuCauXuatKho.js
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import './FormTaoPhieuNhap.css';

const QuanLyYeuCauXuatKho = () => {
    const [danhSachYeuCau, setDanhSachYeuCau] = useState([]);
    const [searchMaYC, setSearchMaYC] = useState("");
    const [searchDaiLy, setSearchDaiLy] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [popupData, setPopupData] = useState(null);
    const [tonKhoMap, setTonKhoMap] = useState({});

    const loadTonKho = async (chiTietList) => {
        const map = {};
        for (const ct of chiTietList) {
            try {
                const res = await fetch(`https://localhost:5288/api/yeucauxuatkho/tonkho/${ct.idSanPham}`);
                const ton = await res.json();
                map[ct.idSanPham] = ton;
            } catch {
                map[ct.idSanPham] = "Lỗi";
            }
        }
        setTonKhoMap(map);
    };

    useEffect(() => {
        if (popupData?.chiTietYeuCauXuatKhos?.length > 0) {
            loadTonKho(popupData.chiTietYeuCauXuatKhos);
        }
    }, [popupData]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));
    const isThuKho = user?.tenChucVu === "Thủ kho";

    const fetchData = async () => {
        try {
            const res = await fetch("https://localhost:5288/api/yeucauxuatkho");
            const data = await res.json();
            setDanhSachYeuCau(data);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu yêu cầu:", error);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleXoa = async (id) => {
        const xacNhan = window.confirm("Bạn có chắc muốn xoá yêu cầu này?");
        if (!xacNhan) return;

        try {
            await fetch(`https://localhost:5288/api/yeucauxuatkho/${id}`, {
                method: "DELETE"
            });
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

        const user = JSON.parse(localStorage.getItem("user"));

        try {
            await fetch(`https://localhost:5288/api/yeucauxuatkho/duyet/${id}?chucVu=${user.tenChucVu}`, {
                method: "PUT"
            });

            alert("✅ Đã duyệt yêu cầu!");

            // ✅ Cập nhật trạng thái cho popup và danh sách
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
        const matchDL = searchDaiLy ? yc.daiLy?.tenDaiLy?.toLowerCase().includes(searchDaiLy.toLowerCase()) : true;
        const matchDate =
            (!fromDate || new Date(yc.ngayYeuCau) >= new Date(fromDate)) &&
            (!toDate || new Date(yc.ngayYeuCau) <= new Date(toDate));
        return matchMa && matchDL && matchDate;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = locDanhSach.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(locDanhSach.length / itemsPerPage);

    const handlePopup = async (yc) => {
        try {
            const res = await fetch(`https://localhost:5288/api/yeucauxuatkho/chitiet/${yc.idYeuCauXuatKho}`);
            const chiTiet = await res.json();
            setPopupData({ ...yc, chiTietYeuCauXuatKhos: chiTiet });
        } catch (err) {
            console.error("❌ Lỗi khi lấy chi tiết:", err);
            alert("Không thể tải chi tiết sản phẩm.");
        }
    };


    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <div className="main-layout">
                    <Navbar />
                    <div className="container">
                        <h1 className="title">Quản lý yêu cầu xuất kho</h1>

                        <div className="search-form">
                            <input type="text" placeholder="Mã yêu cầu"
                                value={searchMaYC} onChange={(e) => setSearchMaYC(e.target.value)} className="search-input" />

                            <input type="text" placeholder="Tên đại lý"
                                value={searchDaiLy} onChange={(e) => setSearchDaiLy(e.target.value)} className="search-input" />

                            <div className="date-group">
                                <label>Từ ngày:</label>
                                <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="date-input" />
                            </div>
                            <div className="date-group">
                                <label>Đến ngày:</label>
                                <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="date-input" />
                            </div>

                            <button className="search-button">🔍 Tìm</button>
                            <button className="reset-button" onClick={() => {
                                setSearchMaYC("");
                                setSearchDaiLy("");
                                setFromDate("");
                                setToDate("");
                            }}>🗑 Reset</button>
                        </div>

                        <button className="add-button" onClick={() => navigate("/tao-yeu-cau-xuat-kho")}>+ Gửi yêu cầu mới</button>

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
                                        <td>{yc.idTrangThaiXacNhan === 1 ? '⏳ Chờ duyệt' :
                                            yc.idTrangThaiXacNhan === 2 ? '✅ Đã duyệt' :
                                                yc.idTrangThaiXacNhan === 3 ? '🚚 Đã xuất kho' : '---'}</td>
                                        <td>
                                            <button className="view-btn" onClick={() => handlePopup(yc)}>🔍</button>
                                            <button className="edit-btn" onClick={() => navigate(`/sua-yeu-cau-xuat-kho/${yc.idYeuCauXuatKho}`)}>✏️</button>
                                            <button className="delete-btn" onClick={() => handleXoa(yc.idYeuCauXuatKho)}>🗑</button>
                                            {isThuKho && yc.idTrangThaiXacNhan === 1 && (
                                                <button className="approve-btn" onClick={() => handleDuyet(yc.idYeuCauXuatKho)}>✔️ Duyệt</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="pagination">
                            {[...Array(totalPages).keys()].map(n => (
                                <button
                                    key={n}
                                    className={n + 1 === currentPage ? "active-page" : ""}
                                    onClick={() => setCurrentPage(n + 1)}>{n + 1}</button>
                            ))}
                        </div>

                        {popupData && (
                            <div className="popup">
                                <div className="popup-inner">
                                    <h3>Chi tiết yêu cầu #{popupData.idYeuCauXuatKho}</h3>
                                    <p><strong>Đại lý:</strong> {popupData.daiLy?.tenDaiLy}</p>
                                    <p><strong>Thời gian:</strong> {new Date(popupData.ngayYeuCau).toLocaleString()}</p>
                                    <p><strong>Ghi chú:</strong> {popupData.ghiChu || 'Không có'}</p>
                                    <p><strong>Trạng thái:</strong> {popupData.idTrangThaiXacNhan === 1 ? 'Chờ duyệt' : popupData.idTrangThaiXacNhan === 2 ? 'Đã duyệt' : 'Đã xuất kho'}</p>

                                    <h4>📦 Sản phẩm trong yêu cầu:</h4>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Tên SP</th>
                                                <th>SL yêu cầu</th>
                                                <th>Tồn kho</th>
                                                <th>Ghi chú</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {popupData.chiTietYeuCauXuatKhos?.map((ct, idx) => {
                                                const ten = ct.sanPham?.tenSanPham || '---';
                                                const yc = ct.soLuong;
                                                const ton = tonKhoMap[ct.idSanPham];
                                                const ok = typeof ton === 'number' && ton >= yc;
                                                return (
                                                    <tr key={idx}>
                                                        <td>{ten}</td>
                                                        <td>{yc}</td>
                                                        <td>{ton}</td>
                                                        <td style={{ color: !ok ? 'red' : 'green' }}>
                                                            {ton === 'Lỗi' ? '⚠️ Không lấy được' : !ok ? 'Không đủ' : '✔️ Đủ'}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>

                                    {isThuKho && popupData.idTrangThaiXacNhan === 1 &&
                                        popupData.chiTietYeuCauXuatKhos?.every(ct => {
                                            const ton = tonKhoMap[ct.idSanPham];
                                            return typeof ton === 'number' && ton >= ct.soLuong;
                                        }) && (
                                            <button onClick={() => handleDuyet(popupData.idYeuCauXuatKho)} className="approve-btn">
                                                ✔️ Duyệt yêu cầu
                                            </button>
                                        )}
                                    {isThuKho && popupData.idTrangThaiXacNhan === 2 && (
                                        <button onClick={() => handleTaoPhieuXuat(popupData)} className="export-btn">
                                            📦 Tạo phiếu xuất
                                        </button>
                                    )}

                                    <button onClick={() => setPopupData(null)} className="close-btn">Đóng</button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuanLyYeuCauXuatKho;
