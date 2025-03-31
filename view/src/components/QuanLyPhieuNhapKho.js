import React, { useEffect, useState } from "react";
import "./QuanLyPhieuNhapKho.css";
// QuanLyPhieuNhapKho.js
import { useNavigate } from 'react-router-dom';


const PhieuNhapList = () => {
    const [phieuNhaps, setPhieuNhaps] = useState([]);
    const [searchMaPhieu, setSearchMaPhieu] = useState("");
    const [selectedNhaCungCap, setSelectedNhaCungCap] = useState("");
    const [nhaCungCapList, setNhaCungCapList] = useState([]);
    const [filterStatus, setFilterStatus] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const API_BASE_URL = "https://localhost:5288/api";
    const navigate = useNavigate();

    // Chuyển hướng đến trang tạo phiếu nhập
    const handleAddPhieuNhap = () => {
        navigate("/them-phieu-nhap");
    };


    useEffect(() => {
        fetch(`${API_BASE_URL}/phieunhap`)
            .then((res) => res.json())
            .then((data) => setPhieuNhaps(data))
            .catch((error) => console.error("Lỗi lấy dữ liệu:", error));

        fetch(`${API_BASE_URL}/nhacungcap`)
            .then((res) => res.json())
            .then((data) => setNhaCungCapList(data))
            .catch((error) => console.error("Lỗi lấy NCC:", error));
    }, []);

    // 🔄 Reset bộ lọc tìm kiếm
    const resetSearch = () => {
        setSearchMaPhieu("");
        setSelectedNhaCungCap("");
        setFilterStatus("");
        setFromDate("");
        setToDate("");
    };

    // 🔄 Lọc dữ liệu theo điều kiện tìm kiếm
    const filteredPhieuNhaps = phieuNhaps.filter((phieu) => {
        const matchMaPhieu = phieu.idPhieuNhap.toString().includes(searchMaPhieu);
        const matchNhaCungCap = selectedNhaCungCap
            ? phieu.nhaCungCap && phieu.nhaCungCap.tenNhaCungCap === selectedNhaCungCap
            : true;
        const matchStatus = filterStatus ? phieu.trangThai.toString() === filterStatus : true;
        const matchDate =
            (!fromDate || new Date(phieu.ngayNhap) >= new Date(fromDate)) &&
            (!toDate || new Date(phieu.ngayNhap) <= new Date(toDate));

        return matchMaPhieu && matchNhaCungCap && matchStatus && matchDate;
    });

    return (
        <div className="container">
            <h1 className="title">Quản lý phiếu nhập kho</h1>

            {/* 🔍 Form tìm kiếm */}
            <div className="search-form">
                {/* HÀNG 1 */}
                <input
                    type="text"
                    placeholder="Mã phiếu"
                    value={searchMaPhieu}
                    onChange={(e) => setSearchMaPhieu(e.target.value)}
                    className="search-input"
                />

                <input
                    list="nhacungcap-list"
                    placeholder="Nhà cung cấp"
                    value={selectedNhaCungCap}
                    onChange={(e) => setSelectedNhaCungCap(e.target.value)}
                    className="search-input"
                />
                <datalist id="nhacungcap-list">
                    {nhaCungCapList.map((ncc) => (
                        <option key={ncc.idNhaCungCap} value={ncc.tenNhaCungCap} />
                    ))}
                </datalist>

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select"
                >
                    <option value="">-- Trạng thái --</option>
                    <option value="1">Chờ duyệt</option>
                    <option value="2">Đã duyệt</option>
                    <option value="3">Từ chối</option>
                    <option value="4">Hoàn hàng</option>
                </select>

                {/* HÀNG 2 */}
                <div className="date-group">
                    <label htmlFor="from-date">Từ ngày:</label>
                    <input
                        id="from-date"
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="date-input"
                    />
                </div>

                <div className="date-group">
                    <label htmlFor="to-date">Đến ngày:</label>
                    <input
                        id="to-date"
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="date-input"
                    />
                </div>


                {/* Button "Tìm kiếm" và "Xóa tìm kiếm" */}
                <div style={{ display: "flex", gap: "10px" }}>
                    <button className="search-button">🔍 Tìm kiếm</button>
                    <button className="reset-button" onClick={resetSearch}>🗑 Xóa tìm kiếm</button>
                </div>
            </div>

            {/* Button tạo phiếu nhập */}
            <button className="add-button" onClick={handleAddPhieuNhap}>+ Tạo phiếu nhập kho</button>

            {/* 🔽 Bảng danh sách phiếu nhập */}
            <table className="data-table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã phiếu</th>
                        <th>Nhà cung cấp</th>
                        <th>Giá trị</th>
                        <th>Thời gian</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPhieuNhaps.map((phieu, index) => {
                        return (
                            <tr key={phieu.idPhieuNhap}>
                                <td>{index + 1}</td>
                                <td>{phieu.idPhieuNhap}</td>
                                <td>{phieu.nhaCungCap ? phieu.nhaCungCap.tenNhaCungCap : "Không có NCC"}</td>
                                <td>50.000.000</td>
                                <td>{new Date(phieu.ngayNhap).toLocaleString()}</td>
                                <td>{phieu.trangThai === 1 ? "Chờ duyệt" :
                                    phieu.trangThai === 2 ? "Đã duyệt" :
                                        phieu.trangThai === 3 ? "Từ chối" :
                                            "Hoàn hàng"}</td>
                                <td>
                                    <button className="edit-btn">✏️</button>
                                    <button className="delete-btn">🗑</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default PhieuNhapList;
