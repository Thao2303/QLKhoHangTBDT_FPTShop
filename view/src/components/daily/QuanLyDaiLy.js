// ✅ QUẢN LÝ ĐẠI LÝ - Giao diện giống trang tài khoản
import React, { useEffect, useState } from "react";
import Sidebar from "../common/Sidebar/Sidebar";
import Navbar from "../common/Navbar/Navbar";
import Pagination from "../common/Pagination/Pagination";
import "../taikhoan/account-style.css";
import "../nhapkho/QuanLyPhieuNhapKho.css"; // hoặc tương tự



const removeVietnameseTones = (str) => {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // xóa dấu thanh
        .replace(/đ/g, "d").replace(/Đ/g, "D")
        .toLowerCase();
};

const QuanLyDaiLy = () => {
    const [danhSach, setDanhSach] = useState([]);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState({ tenDaiLy: "", diaChi: "", sdt: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const API = "https://qlkhohangtbdt-fptshop-be2.onrender.com/api/daily";

    useEffect(() => {
        fetch(API)
            .then((res) => res.json())
            .then(setDanhSach)
            .catch(() => alert("Lỗi khi tải danh sách đại lý"));
    }, []);

    const keyword = removeVietnameseTones(search.trim());

    const filtered = danhSach.filter(dl =>
        removeVietnameseTones(dl.tenDaiLy).includes(keyword) ||
        removeVietnameseTones(dl.diaChi).includes(keyword) ||
        dl.sdt.includes(search)
    );


    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSubmit = async (data) => {
        const method = selected ? "PUT" : "POST";
        const url = selected ? `${API}/${selected.idDaiLy}` : API;
        const payload = selected
            ? { ...data, idDaiLy: selected.idDaiLy }
            : data;

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) return alert("Lỗi khi lưu đại lý");

        const newList = await fetch(API).then(r => r.json());
        setDanhSach(newList);
        setShowForm(false);
        setSelected(null);
    };


    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xoá?")) return;
        await fetch(`${API}/${id}`, { method: "DELETE" });
        setDanhSach(danhSach.filter(dl => dl.idDaiLy !== id));
    };
    const handleEdit = (dl) => {
        setSelected(dl);
        setForm({ tenDaiLy: dl.tenDaiLy, diaChi: dl.diaChi, sdt: dl.sdt });

        setShowForm(true);
    };
    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <Navbar />
                <div className="container">
                    <h1 className="title">QUẢN LÝ ĐẠI LÝ</h1>
                    <div className="search-form" style={{ display: "center", justifyContent: "center", gap: "10px"}}>
                        <input
                            className="input"
                            style={{ width: "300px" }}
                            placeholder="Tìm kiếm tên đại lý..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="btn btn-cancel"  onClick={() => setSearch("")} >🔄 Reset</button>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
                        <button className="btn btn-primary" onClick={() => {
                            setSelected(null);
                            setForm({ tenDaiLy: "", diaChi: "", sdt: "" });
                            setShowForm(true);
                        }}>
                            + Thêm đại lý
                        </button>
                    </div>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên đại lý</th>
                                    <th>Địa chỉ</th>
                                    <th>SĐT</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.map((dl, i) => (
                                    <tr key={dl.idDaiLy}>
                                        <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                                        <td>{dl.tenDaiLy}</td>
                                        <td>{dl.diaChi}</td>
                                        <td>{dl.sdt}</td>
                                        <td>
                                            <button className="btn" onClick={() => handleEdit(dl)}>✏️</button>
                                            <button className="btn btn-cancel" onClick={() => handleDelete(dl.idDaiLy)}>🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>

                    <Pagination currentPage={currentPage} totalPages={Math.ceil(filtered.length / itemsPerPage)} onPageChange={setCurrentPage} />

                    {showForm && (
                        <div className="popup-overlay">
                            <form className="popup-box" onSubmit={(e) => { e.preventDefault(); handleSubmit(form); }}>

                                <h2 className="popup-title">{selected ? "Chỉnh sửa" : "Thêm"} đại lý</h2>
                                <input
                                    className="input"
                                    placeholder="Tên đại lý"
                                    required
                                    value={form.tenDaiLy}
                                    onChange={(e) => setForm({ ...form, tenDaiLy: e.target.value })}
                                />

                                <input
                                    className="input"
                                    placeholder="Địa chỉ"
                                    required
                                    value={form.diaChi}
                                    onChange={(e) => setForm({ ...form, diaChi: e.target.value })}
                                />

                                <input
                                    className="input"
                                    placeholder="SĐT"
                                    required
                                    value={form.sdt}
                                    onChange={(e) => setForm({ ...form, sdt: e.target.value })}
                                />
<div className="popup-actions">
                                    <button type="submit" className="btn btn-primary">Lưu</button>
                                    <button type="button" className="btn btn-cancel" onClick={() => setShowForm(false)}>Huỷ</button>
                                </div>
                            </form>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default QuanLyDaiLy;
