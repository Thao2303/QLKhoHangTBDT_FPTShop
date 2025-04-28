import React, { useEffect, useState } from "react";
import "./QuanLyPhieuNhapKho.css";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import FormPhieuXuat from "./FormPhieuXuat";
import PopupChiTietPhieuXuat from "./PopupChiTietPhieuXuat";

const QuanLyPhieuXuat = () => {
    const [list, setList] = useState([]);
    const [daiLyList, setDaiLyList] = useState([]);
    const [popup, setPopup] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [searchMa, setSearchMa] = useState("");
    const [searchDaiLy, setSearchDaiLy] = useState("");
    const [status, setStatus] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

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

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa phiếu xuất này không?")) {
            await fetch(`https://localhost:5288/api/phieuxuat/${id}`, {
                method: "DELETE",
            });
            fetchData();
        }
    };

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <div className="main-layout">
                    <Navbar />
                    <div className="container">
                        <h1 className="title">Quản lý phiếu xuất kho</h1>

                        {/* 🔍 Form tìm kiếm */}
                        <div className="search-form">
                            <input
                                type="text"
                                placeholder="Mã phiếu"
                                value={searchMa}
                                onChange={(e) => setSearchMa(e.target.value)}
                                className="search-input"
                            />
                            <input
                                list="dai-ly-list"
                                placeholder="Đại lý"
                                value={searchDaiLy}
                                onChange={(e) => setSearchDaiLy(e.target.value)}
                                className="search-input"
                            />
                            <datalist id="dai-ly-list">
                                {daiLyList.map((dl) => (
                                    <option key={dl.idDaiLy} value={dl.tenDaiLy} />
                                ))}
                            </datalist>

                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">-- Trạng thái --</option>
                                <option>Chưa duyệt</option>
                                <option>Đã xác nhận</option>
                                <option>Đã tạo phiếu xuất</option>
                            </select>

                            <div className="date-group">
                                <label>Từ ngày:</label>
                                <input
                                    type="date"
                                    className="date-input"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                />
                            </div>

                            <div className="date-group">
                                <label>Đến ngày:</label>
                                <input
                                    type="date"
                                    className="date-input"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                />
                            </div>

                            <div style={{ display: "flex", gap: "10px" }}>
                                <button className="search-button">🔍 Tìm kiếm</button>
                                <button
                                    className="reset-button"
                                    onClick={() => {
                                        setSearchMa("");
                                        setSearchDaiLy("");
                                        setStatus("");
                                        setFromDate("");
                                        setToDate("");
                                    }}
                                >
                                    🗑 Xóa tìm kiếm
                                </button>
                            </div>
                        </div>

                        {/* Nút tạo phiếu */}
                        <button className="add-button" onClick={() => setShowForm(!showForm)}>
                            + Tạo phiếu xuất kho
                        </button>

                        {/* Bảng phiếu xuất */}
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mã PX</th>
                                    <th>Đại lý</th>
                                    <th>Thời gian</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((px, idx) => (
                                    <tr key={px.idPhieuXuat}>
                                        <td>{idx + 1}</td>
                                        <td>{px.idPhieuXuat}</td>
                                        <td>{px.yeuCauXuatKho?.daiLy?.tenDaiLy}</td>
                                        <td>{new Date(px.ngayXuat).toLocaleString()}</td>
                                        <td>{px.yeuCauXuatKho?.trangThaiXacNhan?.tenTrangThai}</td>
                                        <td>
                                            <button className="edit-btn" onClick={() => setPopup(px)}>👁️</button>
                                            <button className="delete-btn" onClick={() => handleDelete(px.idPhieuXuat)}>🗑</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Form tạo phiếu xuất */}
                        {showForm && <FormPhieuXuat onCreated={fetchData} />}

                        {/* Xem chi tiết */}
                        {popup && (
                            <PopupChiTietPhieuXuat
                                phieuXuat={popup}
                                onClose={() => setPopup(null)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuanLyPhieuXuat;
