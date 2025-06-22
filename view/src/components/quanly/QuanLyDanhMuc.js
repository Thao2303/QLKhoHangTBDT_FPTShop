import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../common/Navbar/Navbar';
import Sidebar from '../common/Sidebar/Sidebar';
import "../nhapkho/FormTaoPhieuNhap.css";
import "../nhapkho/QuanLyPhieuNhapKho.css";
import Pagination from "../common/Pagination/Pagination";

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
    const itemsPerPage = 10;
    const navigate = useNavigate();
    const API_URL = "https://qlkhohangtbdt-fptshop-be2.onrender.com/api/danhmuc";

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
                    <h1 className="title">QUẢN LÝ DANH MỤC SẢN PHẨM</h1>

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

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                    />


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
