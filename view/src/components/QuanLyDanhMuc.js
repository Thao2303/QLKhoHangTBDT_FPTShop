﻿import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "./FormTaoPhieuNhap.css";
import "./QuanLyPhieuNhapKho.css";

const removeVietnameseTones = (str) => {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d").replace(/Đ/g, "D")
        .toLowerCase();
};

const QuanLyDanhMuc = () => {
    const [danhMucs, setDanhMucs] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [popupAdd, setPopupAdd] = useState(false);
    const [popupEdit, setPopupEdit] = useState(null);
    const [tenDanhMuc, setTenDanhMuc] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const navigate = useNavigate();
    const API_URL = "https://localhost:5288/api/danhmuc";

    const fetchDanhMuc = () => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => setDanhMucs(data))
            .catch(() => alert("❌ Lỗi khi tải danh mục"));
    };

    useEffect(() => {
        fetchDanhMuc();
    }, []);

    const handleAdd = async () => {
        if (!tenDanhMuc.trim()) return alert("Tên không hợp lệ");
        try {
            await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tenDanhMuc })
            });
            alert("✅ Thêm danh mục thành công");
            setTenDanhMuc("");
            setPopupAdd(false);
            fetchDanhMuc();
        } catch {
            alert("❌ Lỗi khi thêm");
        }
    };

    const handleEdit = async () => {
        if (!tenDanhMuc.trim()) return alert("Tên không hợp lệ");
        try {
            await fetch(`${API_URL}/${popupEdit.idDanhMuc}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idDanhMuc: popupEdit.idDanhMuc, tenDanhMuc })
            });
            alert("✅ Cập nhật thành công");
            setPopupEdit(null);
            setTenDanhMuc("");
            fetchDanhMuc();
        } catch {
            alert("❌ Lỗi khi sửa");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xoá danh mục này?")) return;
        try {
            await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            fetchDanhMuc();
        } catch {
            alert("❌ Lỗi khi xoá");
        }
    };

    const danhMucLoc = danhMucs.filter(dm =>
        removeVietnameseTones(dm.tenDanhMuc).includes(removeVietnameseTones(searchText))
    );

    const totalPages = Math.ceil(danhMucLoc.length / itemsPerPage);
    const paginatedData = danhMucLoc.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <Navbar />
                <div className="container">
                    <h1 className="title">Quản lý danh mục</h1>

                    <div className="search-form">
                        <input
                            className="search-input"
                            placeholder="🔍 Tên danh mục"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <button className="reset-button" onClick={() => setSearchText("")}>🗑</button>
                    </div>

                    <button className="add-button" onClick={() => {
                        setPopupAdd(true);
                        setTenDanhMuc("");
                    }}>➕ Thêm danh mục</button>

                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên danh mục</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((dm, idx) => (
                                <tr key={dm.idDanhMuc}>
                                    <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                                    <td>{dm.tenDanhMuc}</td>
                                    <td>
                                        <button className="edit-btn" onClick={() => {
                                            setPopupEdit(dm);
                                            setTenDanhMuc(dm.tenDanhMuc);
                                        }}>✏️</button>
                                        <button className="delete-btn" onClick={() => handleDelete(dm.idDanhMuc)}>🗑</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={{ marginTop: 20 }}>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                style={{
                                    marginRight: 6,
                                    padding: "6px 12px",
                                    backgroundColor: currentPage === i + 1 ? "#617BAD" : "#e0e0e0",
                                    color: currentPage === i + 1 ? "#fff" : "#333",
                                    border: "none",
                                    borderRadius: 4,
                                    cursor: "pointer"
                                }}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    {(popupAdd || popupEdit) && (
                        <div className="popup">
                            <div className="popup-inner">
                                <h3>{popupAdd ? "➕ Thêm danh mục" : "✏️ Sửa danh mục"}</h3>
                                <div className="info-row">
                                    <label>Tên danh mục:</label>
                                    <input
                                        className="search-input"
                                        value={tenDanhMuc}
                                        onChange={(e) => setTenDanhMuc(e.target.value)}
                                    />
                                </div>
                                <button className="add-button" onClick={popupAdd ? handleAdd : handleEdit}>
                                    💾 Lưu
                                </button>
                                <button className="close-btn" onClick={() => {
                                    setPopupAdd(false);
                                    setPopupEdit(null);
                                }}>Đóng</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuanLyDanhMuc;
