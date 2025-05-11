import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "./FormTaoPhieuNhap.css";
import "./QuanLyPhieuNhapKho.css";

const removeVietnameseTones = (str) => {
    return str.normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/đ/g, "d").replace(/Đ/g, "D")
        .toLowerCase();
};

const labelMap = {
    tenSanPham: "Tên sản phẩm",
    sku: "SKU",
    moTa: "Mô tả",
    mauSac: "Màu sắc",
    khoiLuong: "Khối lượng (kg)",
    chieuDai: "Chiều dài (cm)",
    chieuRong: "Chiều rộng (cm)",
    chieuCao: "Chiều cao (cm)",
    donGiaBan: "Đơn giá bán",
    soLuongHienCon: "SL hiện còn",
    soLuongToiThieu: "SL tối thiểu",
    ngaySanXuat: "Ngày sản xuất",
    idDanhMuc: "Danh mục",
    idThuongHieu: "Thương hiệu",
    idNhaCungCap: "Nhà cung cấp",
    idDonViTinh: "Đơn vị tính",
    idViTri: "Vị trí lưu trữ"
};

const QuanLySanPham = () => {
    const [sanPhams, setSanPhams] = useState([]);
    const [danhMucs, setDanhMucs] = useState([]);
    const [thuongHieus, setThuongHieus] = useState([]);
    const [nhaCungCaps, setNhaCungCaps] = useState([]);
    const [donViTinhs, setDonViTinhs] = useState([]);

    const [searchText, setSearchText] = useState("");
    const [filterDanhMuc, setFilterDanhMuc] = useState("");
    const [filterThuongHieu, setFilterThuongHieu] = useState("");
    const [filterNhaCungCap, setFilterNhaCungCap] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const [popup, setPopup] = useState(false);
    const [form, setForm] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const API = "https://localhost:5288/api";

    const [thongSoList, setThongSoList] = useState([]); // Danh sách tất cả thông số từ API
    const [dsThongSo, setDsThongSo] = useState([]);     // Danh sách thông số đã chọn
    const [thongSoTam, setThongSoTam] = useState({ idThongSo: "", giaTriThongSo: "" });
    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        try {
            const [sp, dm, th, ncc, dvt, tskt] = await Promise.all([
                fetch(`${API}/sanpham`).then(r => r.json()),
                fetch(`${API}/danhmuc`).then(r => r.json()),
                fetch(`${API}/thuonghieu`).then(r => r.json()),
                fetch(`${API}/nhacungcap`).then(r => r.json()),
                fetch(`${API}/donvitinh`).then(r => r.json()),
                fetch(`${API}/thongso`).then(r => r.json())
            ]);
            console.log({ sp, dm, th, ncc, dvt, tskt }); // 👈 THÊM DÒNG NÀY
            setSanPhams(sp);
            setDanhMucs(dm);
            setThuongHieus(th);
            setNhaCungCaps(ncc);
            setDonViTinhs(dvt);
            setThongSoList(tskt);
        } catch (err) {
            console.error("LỖI FETCH:", err);
        }
    };


    const handleSubmit = async () => {
        const method = isEdit ? "PUT" : "POST";
        const url = isEdit ? `${API}/sanpham/${form.idSanPham}` : `${API}/sanpham`;
        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            const idSanPham = isEdit ? form.idSanPham : data.id;

            // Lưu thông số kỹ thuật
            if (dsThongSo.length > 0) {
                const payload = dsThongSo.map(ts => ({
                    idSanPham,
                    idThongSo: parseInt(ts.idThongSo),
                    giaTriThongSo: ts.giaTriThongSo
                }));
                await fetch(`${API}/thongso-chi-tiet`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            }

            alert("✅ Lưu thành công");
            setPopup(false);
            setForm({});
            setDsThongSo([]);
            fetchAll();
        } catch {
            alert("❌ Lỗi khi lưu");
        }
    };
    useEffect(() => {
        if (popup && isEdit && form.idSanPham) {
            fetch(`${API}/thongso-chi-tiet/${form.idSanPham}`)
                .then(res => res.json())
                .then(data => {
                    const list = data.map(x => ({ idThongSo: x.idThongSo.toString(), giaTriThongSo: x.giaTriThongSo }));
                    setDsThongSo(list);
                });
        } else {
            setDsThongSo([]);
        }
    }, [popup, isEdit, form]);
    const handleDelete = async (id) => {
        if (!window.confirm("Xoá sản phẩm này?")) return;
        await fetch(`${API}/sanpham/${id}`, { method: "DELETE" });
        fetchAll();
    };

    const filtered = sanPhams.filter(sp => {
        const textMatch = removeVietnameseTones(sp.tenSanPham).includes(removeVietnameseTones(searchText)) ||
            removeVietnameseTones(sp.sku).includes(removeVietnameseTones(searchText));

        const matchDanhMuc = filterDanhMuc ? sp.idDanhMuc === parseInt(filterDanhMuc) : true;
        const matchThuongHieu = filterThuongHieu ? sp.idThuongHieu === parseInt(filterThuongHieu) : true;
        const matchNCC = filterNhaCungCap ? sp.idNhaCungCap === parseInt(filterNhaCungCap) : true;

        const nsx = sp.ngaySanXuat ? new Date(sp.ngaySanXuat) : null;
        const matchDate = (!fromDate || (nsx && nsx >= new Date(fromDate))) &&
            (!toDate || (nsx && nsx <= new Date(toDate)));

        return textMatch && matchDanhMuc && matchThuongHieu && matchNCC && matchDate;
    });

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <Navbar />
                <div className="container">
                    <h1 className="title">Quản lý sản phẩm</h1>

                    <div className="search-form">
                        <input
                            className="search-input"
                            placeholder="🔍 Tên sản phẩm hoặc SKU"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <select className="filter-select" value={filterDanhMuc} onChange={(e) => setFilterDanhMuc(e.target.value)}>
                            <option value="">-- Danh mục --</option>
                            {danhMucs.map(dm => (
                                <option key={dm.idDanhMuc} value={dm.idDanhMuc}>{dm.tenDanhMuc}</option>
                            ))}
                        </select>
                        <select className="filter-select" value={filterThuongHieu} onChange={(e) => setFilterThuongHieu(e.target.value)}>
                            <option value="">-- Thương hiệu --</option>
                            {thuongHieus.map(th => (
                                <option key={th.idThuongHieu} value={th.idThuongHieu}>{th.tenThuongHieu}</option>
                            ))}
                        </select>
                        <select className="filter-select" value={filterNhaCungCap} onChange={(e) => setFilterNhaCungCap(e.target.value)}>
                            <option value="">-- Nhà cung cấp --</option>
                            {nhaCungCaps.map(ncc => (
                                <option key={ncc.idNhaCungCap} value={ncc.idNhaCungCap}>{ncc.tenNhaCungCap}</option>
                            ))}
                        </select>
                        <div className="date-group">
                            <label>Từ ngày:</label>
                            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="date-input" />
                        </div>
                        <div className="date-group">
                            <label>Đến ngày:</label>
                            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="date-input" />
                        </div>
                        <button className="reset-button" onClick={() => {
                            setSearchText("");
                            setFilterDanhMuc("");
                            setFilterThuongHieu("");
                            setFilterNhaCungCap("");
                            setFromDate("");
                            setToDate("");
                        }}>🗑</button>
                    </div>

                    <button className="add-button" onClick={() => {
                        setForm({});
                        setIsEdit(false);
                        setPopup(true);
                    }}>➕ Thêm sản phẩm</button>

                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên</th>
                                <th>SKU</th>
                                <th>Danh mục</th>
                                <th>Thương hiệu</th>
                                <th>Nhà cung cấp</th>
                                <th>SL</th>
                                <th>Giá</th>
                                <th>ĐVT</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.map((sp, idx) => (
                                <tr key={sp.idSanPham}>
                                    <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                                    <td>{sp.tenSanPham}</td>
                                    <td>{sp.sku}</td>
                                    <td>{sp.danhMuc?.tenDanhMuc || sp.idDanhMuc}</td>
                                    <td>{sp.thuongHieu?.tenThuongHieu || sp.idThuongHieu}</td>
                                    <td>{sp.nhaCungCap?.tenNhaCungCap || sp.idNhaCungCap}</td>
                                    <td>{sp.soLuongHienCon}</td>
                                    <td>{sp.donGiaBan}</td>
                                    <td>{sp.donViTinh?.tenDonViTinh || sp.idDonViTinh}</td>
                                    <td>
                                        <button className="edit-btn" onClick={() => {
                                            setForm(sp);
                                            setIsEdit(true);
                                            setPopup(true);
                                        }}>✏️</button>
                                        <button className="delete-btn" onClick={() => handleDelete(sp.idSanPham)}>🗑</button>
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
                                    borderRadius: 4
                                }}
                            >{i + 1}</button>
                        ))}
                    </div>

                    {popup && (
                        <div className="popup">
                            <div className="popup-inner">
                                <h3>{isEdit ? "✏️ Sửa sản phẩm" : "➕ Thêm sản phẩm"}</h3>

                                {["tenSanPham", "sku", "moTa", "mauSac"].map(key => (
                                    <div key={key} style={{ marginBottom: 8 }}>
                                        <label style={{ fontWeight: 500 }}>{labelMap[key]}</label>
                                        <input
                                            className="search-input"
                                            value={form[key] || ""}
                                            onChange={e => setForm({ ...form, [key]: e.target.value })}
                                        />
                                    </div>
                                ))}

                                {["khoiLuong", "chieuDai", "chieuRong", "chieuCao", "donGiaBan", "soLuongToiThieu", "soLuongHienCon"].map(key => (
                                    <div key={key} style={{ marginBottom: 8 }}>
                                        <label style={{ fontWeight: 500 }}>{labelMap[key]}</label>
                                        <input
                                            className="search-input"
                                            type="number"
                                            value={form[key] || 0}
                                            onChange={e => setForm({ ...form, [key]: parseFloat(e.target.value) })}
                                        />
                                    </div>
                                ))}

                                <div style={{ marginBottom: 8 }}>
                                    <label style={{ fontWeight: 500 }}>{labelMap.ngaySanXuat}</label>
                                    <input
                                        className="search-input"
                                        type="date"
                                        value={form.ngaySanXuat?.slice(0, 10) || ""}
                                        onChange={e => setForm({ ...form, ngaySanXuat: e.target.value })}
                                    />
                                </div>

                                {["idDanhMuc", "idThuongHieu", "idNhaCungCap", "idDonViTinh"].map(key => (
                                    <div key={key} style={{ marginBottom: 8 }}>
                                        <label style={{ fontWeight: 500 }}>{labelMap[key]}</label>
                                        <select
                                            className="search-input"
                                            value={form[key] || ""}
                                            onChange={e => setForm({ ...form, [key]: parseInt(e.target.value) })}
                                        >
                                            <option value="">Chọn {labelMap[key]}</option>
                                            {(key === "idDanhMuc" ? danhMucs :
                                                key === "idThuongHieu" ? thuongHieus :
                                                    key === "idNhaCungCap" ? nhaCungCaps :
                                                        donViTinhs).map(opt => (
                                                            <option key={opt.idDanhMuc || opt.idThuongHieu || opt.idNhaCungCap || opt.idDonViTinh}
                                                                value={opt.idDanhMuc || opt.idThuongHieu || opt.idNhaCungCap || opt.idDonViTinh}>
                                                                {opt.tenDanhMuc || opt.tenThuongHieu || opt.tenNhaCungCap || opt.tenDonViTinh}
                                                            </option>
                                                        ))}
                                        </select>
                                    </div>
                                ))}
                                <div style={{ marginTop: 16, padding: 12, border: "1px solid #ccc", borderRadius: 8 }}>
                                    <h4>🧬 Thông số kỹ thuật</h4>
                                    <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                                        <select
                                            className="search-input"
                                            value={thongSoTam.idThongSo}
                                            onChange={e => setThongSoTam({ ...thongSoTam, idThongSo: e.target.value })}
                                        >
                                            <option value="">-- Chọn thông số --</option>
                                            {thongSoList.map(ts => (
                                                <option key={ts.idThongSo} value={ts.idThongSo}>{ts.tenThongSo}</option>
                                            ))}
                                        </select>
                                        <input
                                            className="search-input"
                                            placeholder="Giá trị"
                                            value={thongSoTam.giaTriThongSo}
                                            onChange={e => setThongSoTam({ ...thongSoTam, giaTriThongSo: e.target.value })}
                                        />
                                        <button
                                            onClick={() => {
                                                if (!thongSoTam.idThongSo || !thongSoTam.giaTriThongSo.trim()) return;
                                                setDsThongSo([...dsThongSo, thongSoTam]);
                                                setThongSoTam({ idThongSo: "", giaTriThongSo: "" });
                                            }}
                                        >➕</button>
                                        <button
                                            onClick={() => {
                                                const ten = prompt("Tên thông số mới:");
                                                if (!ten) return;
                                                fetch(`${API}/thongso`, {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({ tenThongSo: ten })
                                                }).then(() => fetch(`${API}/thongso`).then(r => r.json()).then(setThongSoList));
                                            }}
                                        >➕ Thông số mới</button>
                                    </div>
                                    <ul style={{ marginLeft: 16 }}>
                                        {dsThongSo.map((ts, idx) => {
                                            const tsName = thongSoList.find(t => t.idThongSo == ts.idThongSo)?.tenThongSo || ts.idThongSo;
                                            return (
                                                <li key={idx}>
                                                    <strong>{tsName}:</strong> {ts.giaTriThongSo}
                                                    <button onClick={() => setDsThongSo(dsThongSo.filter((_, i) => i !== idx))}>❌</button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                                <button className="add-button" onClick={handleSubmit}>💾 Lưu</button>
                                <button className="close-btn" onClick={() => setPopup(false)}>Đóng</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuanLySanPham;