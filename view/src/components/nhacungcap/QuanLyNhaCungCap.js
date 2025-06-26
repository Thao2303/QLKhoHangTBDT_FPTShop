import React, { useEffect, useState } from "react";
import Sidebar from "../common/Sidebar/Sidebar";
import Navbar from "../common/Navbar/Navbar";
import Pagination from "../common/Pagination/Pagination";
import "../taikhoan/account-style.css";


const QuanLyNhaCungCap = () => {
    const [ds, setDs] = useState([]);
    const [xaMap, setXaMap] = useState({});
    const [huyenMap, setHuyenMap] = useState({});
    const [tinhMap, setTinhMap] = useState({});

    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState({ tenNhaCungCap: "", diaChi: "", email: "", nhanVienLienHe: "", sdt: "", idPhuongXa: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const [tinhList, setTinhList] = useState([]);
    const [huyenList, setHuyenList] = useState([]);
    const [xaList, setXaList] = useState([]);
    const [selectedTinh, setSelectedTinh] = useState("");
    const [selectedHuyen, setSelectedHuyen] = useState("");
    const itemsPerPage = 10;
    const API = "https://localhost:5288/api/nhacungcap";

    useEffect(() => {
        fetch(API).then(res => res.json()).then(setDs);

        fetch("https://localhost:5288/api/tinhthanh")
            .then(res => res.json())
            .then(data => {
                setTinhList(data);
                const map = {};
                data.forEach(t => map[t.idTinhThanh] = t.tenTinhThanh);
                setTinhMap(map);
            });

        fetch("https://localhost:5288/api/quanhuyen")
            .then(res => res.json())
            .then(data => {
                const map = {};
                data.forEach(q => map[q.idQuanHuyen] = { ten: q.tenQuanHuyen, idTinhThanh: q.idTinhThanh });
                setHuyenMap(map);
            });

        fetch("https://localhost:5288/api/phuongxa")
            .then(res => res.json())
            .then(data => {
                const map = {};
                data.forEach(p => map[p.idPhuongXa] = { ten: p.tenPhuongXa, idQuanHuyen: p.idQuanHuyen });
                setXaMap(map);
            });
    }, []);


    const handleTinhChange = (e) => {
        const id = e.target.value;
        setHuyenList([]);
        setXaList([]);
        setForm({ ...form, idPhuongXa: "" });
        fetch(`https://localhost:5288/api/quanhuyen?tinhId=${id}`)
            .then(res => res.json())
            .then(setHuyenList);
    };

    const handleHuyenChange = (e) => {
        const id = e.target.value;
        setXaList([]);
        setForm({ ...form, idPhuongXa: "" });
        fetch(`https://localhost:5288/api/phuongxa?huyenId=${id}`)
            .then(res => res.json())
            .then(setXaList);
    };

    const normalize = (str) => str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
    const keyword = normalize(search.trim());

    const filtered = ds.filter(ncc =>
        normalize(ncc.tenNhaCungCap).includes(keyword) ||
        normalize(ncc.diaChi).includes(keyword) ||
        ncc.email?.toLowerCase().includes(search.toLowerCase()) ||
        ncc.sdt?.includes(search)
    );

    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const getDiaChiDayDu = (ncc) => {
        const xa = xaMap[ncc.idPhuongXa];
        const huyen = xa ? huyenMap[xa.idQuanHuyen] : null;
        const tinh = huyen ? tinhMap[huyen.idTinhThanh] : null;
        return [ncc.diaChi, xa?.ten, huyen?.ten, tinh].filter(Boolean).join(", ");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = selected ? "PUT" : "POST";
        const url = selected ? `${API}/${selected.idNhaCungCap}` : API;
        const body = selected
            ? { ...form, idNhaCungCap: selected.idNhaCungCap }
            : form;

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!res.ok) return alert("Lỗi khi lưu nhà cung cấp");

        const newList = await fetch(API).then(r => r.json());
        setDs(newList);
        setShowForm(false);
        setSelected(null);
        setForm({ tenNhaCungCap: "", diaChi: "", email: "", nhanVienLienHe: "", sdt: "", idPhuongXa: "" });
    };

    const handleEdit = (ncc) => {
        const xa = xaMap[ncc.idPhuongXa];
        const huyenId = xa?.idQuanHuyen;
        const tinhId = huyenId ? huyenMap[huyenId]?.idTinhThanh : null;

        if (tinhId) {
            fetch(`https://localhost:5288/api/quanhuyen?tinhId=${tinhId}`)
                .then(res => res.json())
                .then(data => {
                    setHuyenList(data);
                    setSelectedTinh(tinhId);
                });
        }
        if (huyenId) {
            fetch(`https://localhost:5288/api/phuongxa?huyenId=${huyenId}`)
                .then(res => res.json())
                .then(data => {
                    setXaList(data);
                    setSelectedHuyen(huyenId);
                });
        }

        setSelected(ncc);
        setForm({
            tenNhaCungCap: ncc.tenNhaCungCap,
            diaChi: ncc.diaChi,
            email: ncc.email,
            nhanVienLienHe: ncc.nhanVienLienHe,
            sdt: ncc.sdt,
            idPhuongXa: ncc.idPhuongXa
        });
        setShowForm(true);
    };


    const handleDelete = async (id) => {
        if (!window.confirm("Xoá nhà cung cấp này?")) return;
        await fetch(`${API}/${id}`, { method: "DELETE" });
        setDs(ds.filter(ncc => ncc.idNhaCungCap !== id));
    };

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <Navbar />
                <div className="container">
                    <h1 className="title">QUẢN LÝ NHÀ CUNG CẤP</h1>

                    <div className="search-form" style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "16px" }}>
                        <input className="input" placeholder="Tìm kiếm nhà cung cấp..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        <button className="btn btn-cancel" onClick={() => setSearch("")}>🔄 Reset</button>
                        <button className="btn btn-primary" onClick={() => { setSelected(null); setForm({ tenNhaCungCap: "", diaChi: "", email: "", nhanVienLienHe: "", sdt: "", idPhuongXa: "" }); setShowForm(true); }}>+ Thêm NCC</button>
                    </div>

                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên NCC</th>
                                <th>Địa chỉ</th>
                                <th>Email</th>
                                <th>Người liên hệ</th>
                                <th>SĐT</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.map((ncc, i) => (
                                <tr key={ncc.idNhaCungCap}>
                                    <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                                    <td>{ncc.tenNhaCungCap}</td>
                                    <td>{getDiaChiDayDu(ncc)}</td>
                                    <td>{ncc.email}</td>
                                    <td>{ncc.nhanVienLienHe}</td>
                                    <td>{ncc.sdt}</td>
                                    <td>
                                        <button className="btn" onClick={() => handleEdit(ncc)}>✏️</button>
                                        <button className="btn btn-cancel" onClick={() => handleDelete(ncc.idNhaCungCap)}>🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <Pagination currentPage={currentPage} totalPages={Math.ceil(filtered.length / itemsPerPage)} onPageChange={setCurrentPage} />

                    {showForm && (
                        <div className="popup-overlay">
                            <form className="popup-box" onSubmit={handleSubmit}>
                                <h2 className="popup-title">{selected ? "Chỉnh sửa" : "Thêm"} NCC</h2>
                                <input className="input" placeholder="Tên nhà cung cấp" required value={form.tenNhaCungCap} onChange={(e) => setForm({ ...form, tenNhaCungCap: e.target.value })} />
                                <input className="input" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                                <input className="input" placeholder="Người liên hệ" value={form.nhanVienLienHe} onChange={(e) => setForm({ ...form, nhanVienLienHe: e.target.value })} />
                                <input className="input" placeholder="Số điện thoại" value={form.sdt} onChange={(e) => setForm({ ...form, sdt: e.target.value })} />

                                <select className="input" value={selectedTinh} onChange={(e) => { setSelectedTinh(e.target.value); handleTinhChange(e); }}>
                                    <option value="">-- Chọn Tỉnh/TP --</option>
                                    {tinhList.map(t => (
                                        <option key={t.idTinhThanh} value={t.idTinhThanh}>{t.tenTinhThanh}</option>
                                    ))}
                                </select>

                                <select className="input" value={selectedHuyen} onChange={(e) => { setSelectedHuyen(e.target.value); handleHuyenChange(e); }}>
                                    <option value="">-- Chọn Quận/Huyện --</option>
                                    {huyenList.map(h => (
                                        <option key={h.idQuanHuyen} value={h.idQuanHuyen}>{h.tenQuanHuyen}</option>
                                    ))}
                                </select>

                                <select className="input" value={form.idPhuongXa || ""} onChange={(e) => setForm({ ...form, idPhuongXa: e.target.value })}>
                                    <option value="">-- Chọn Phường/Xã --</option>
                                    {xaList.map(x => (
                                        <option key={x.idPhuongXa} value={x.idPhuongXa}>{x.tenPhuongXa}</option>
                                    ))}
                                </select>

                                <input className="input" placeholder="Số nhà/Đường..." required value={form.diaChi} onChange={(e) => setForm({ ...form, diaChi: e.target.value })} />

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

export default QuanLyNhaCungCap;