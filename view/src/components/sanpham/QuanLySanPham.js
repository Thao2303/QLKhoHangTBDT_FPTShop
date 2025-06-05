import React, { useEffect, useState } from "react";
import Sidebar from '../common/Sidebar/Sidebar';
import Navbar from '../common/Navbar/Navbar';
import "../nhapkho/FormTaoPhieuNhap.css";
import"../nhapkho/QuanLyPhieuNhapKho.css";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
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
    chieuDai: "Chiều dài (mm)",
    chieuRong: "Chiều rộng (mm)",
    chieuCao: "Chiều cao (mm)",
    donGiaBan: "Đơn giá bán",
    soLuongHienCon: "Số lượng hiện có",
    soLuongToiThieu: "Số lượng tối thiểu",
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
    const itemsPerPage = 10;
    const [detailPopup, setDetailPopup] = useState(false);
    const [spChiTiet, setSpChiTiet] = useState(null);

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
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // ✅ Giới hạn kích thước file (2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert("❌ File quá lớn! Giới hạn 2MB.");
            return;
        }

        // ✅ Giới hạn loại file
        const validTypes = ["image/jpeg", "image/png"];
        if (!validTypes.includes(file.type)) {
            alert("❌ Chỉ cho phép file JPG hoặc PNG.");
            return;
        }

        // ✅ Resize ảnh trước khi upload (Canvas)
        const resizeImage = (file, maxWidth = 600) => {
            return new Promise((resolve) => {
                const img = new Image();
                const reader = new FileReader();

                reader.onload = (e) => {
                    img.onload = () => {
                        const scale = maxWidth / img.width;
                        const canvas = document.createElement("canvas");
                        canvas.width = maxWidth;
                        canvas.height = img.height * scale;

                        const ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        canvas.toBlob(resolve, file.type, 0.9);
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            });
        };

        try {
            const resizedBlob = await resizeImage(file);
            const formData = new FormData();
            formData.append("file", resizedBlob, file.name);

            const res = await fetch("https://localhost:5288/api/upload/image", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (data?.url) {
                // 🧹 Xoá ảnh cũ nếu có
                if (form.hinhAnh && form.hinhAnh.startsWith("/images/")) {
                    await fetch(`https://localhost:5288/api/upload/delete?fileName=${form.hinhAnh.split("/").pop()}`, { method: "DELETE" });
                }
                setForm((prev) => ({ ...prev, hinhAnh: data.url }));
            }
        } catch (error) {
            alert("❌ Upload ảnh thất bại");
            console.error(error);
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
    const handleEdit = (sp) => {
        setForm(sp);
        setIsEdit(true);
        setPopup(true);
    };
    const handleShowDetail = async (sp) => {
        const res = await fetch(`${API}/thongso-chi-tiet/${sp.idSanPham}`);
        const data = await res.json();
        const dsThongSoFormatted = data.map(ts => ({
            tenThongSo: ts.tenThongSo || ts.idThongSo,
            giaTri: ts.giaTriThongSo
        }));
        setSpChiTiet({ ...sp, dsThongSo: dsThongSoFormatted });
        setDetailPopup(true);
    };

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
                        <Select
                            options={danhMucs.map(dm => ({ value: dm.idDanhMuc, label: dm.tenDanhMuc }))}
                            value={filterDanhMuc ? { value: filterDanhMuc, label: danhMucs.find(d => d.idDanhMuc === +filterDanhMuc)?.tenDanhMuc } : null}
                            onChange={(selected) => setFilterDanhMuc(selected ? selected.value : "")}
                            placeholder="Danh mục"
                            isClearable
                            className="search-select"
                        />

                        <Select
                            className="search-select"
                            placeholder="-- Thương hiệu --"
                            options={thuongHieus.map(th => ({
                                value: th.idThuongHieu,
                                label: th.tenThuongHieu
                            }))}
                            value={filterThuongHieu ? {
                                value: filterThuongHieu,
                                label: thuongHieus.find(th => th.idThuongHieu === +filterThuongHieu)?.tenThuongHieu
                            } : null}
                            onChange={(selected) => setFilterThuongHieu(selected ? selected.value : "")}
                            isClearable
                        />

                        <Select
                            className="search-select"
                            placeholder="-- Nhà cung cấp --"
                            options={nhaCungCaps.map(ncc => ({
                                value: ncc.idNhaCungCap,
                                label: ncc.tenNhaCungCap
                            }))}
                            value={filterNhaCungCap ? {
                                value: filterNhaCungCap,
                                label: nhaCungCaps.find(ncc => ncc.idNhaCungCap === +filterNhaCungCap)?.tenNhaCungCap
                            } : null}
                            onChange={(selected) => setFilterNhaCungCap(selected ? selected.value : "")}
                            isClearable
                        />


                        <button className="reset-button" onClick={() => {
                            setSearchText("");
                            setFilterDanhMuc("");
                            setFilterThuongHieu("");
                            setFilterNhaCungCap("");
                    
                        }}>🗑</button>
                    </div>

                    <button className="add-button" onClick={() => {
                        setForm({});
                        setIsEdit(false);
                        setPopup(true);
                    }}>➕ Thêm sản phẩm</button>
                    <p style={{ marginTop: 10 }}>
                        🔍 Tổng kết quả: <strong>{filtered.length}</strong>
                    </p>

                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Ảnh</th>
                                <th>Tên</th>
                                <th>SKU</th>
                                <th>Giá bán</th>
                                <th>Số lượng</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.map((sp, index) => (
                                <tr key={sp.idSanPham}>
                                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                    <td>
                                        {sp.hinhAnh ? (
                                            <img
                                                src={sp.hinhAnh.startsWith("http") ? sp.hinhAnh : `https://localhost:5288${sp.hinhAnh}`}
                                                alt="ảnh"
                                                style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }}
                                            />
                                        ) : (
                                            <span style={{ fontStyle: "italic", color: "#888" }}>Không có</span>
                                        )}
                                    </td>

                                    <td>{sp.tenSanPham}</td>
                                    <td>{sp.sku}</td>
                                    <td>{Number(sp.donGiaBan || 0).toLocaleString()}đ</td>
                                    <td>{sp.soLuongHienCon}</td>
                                    <td>
                                        <button onClick={() => handleShowDetail(sp)}>👁️</button>

                                        <button onClick={() => handleEdit(sp)}>✏️</button>
                                        <button onClick={() => handleDelete(sp.idSanPham)}>🗑</button>
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
                                {/* Nút đóng cố định */}
                                <button
                                    className="close-fixed"
                                    onClick={() => setPopup(false)}
                                    title="Đóng"
                                >
                                    ❌
                                </button>

                                <h3 style={{ marginTop: 12 }}>{isEdit ? "✏️ Sửa sản phẩm" : "➕ Thêm sản phẩm"}</h3>

                                {/* Nội dung cuộn */}
                                <div style={{ maxHeight: "70vh", overflowY: "auto", paddingRight: 10 }}>

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
                                                                <option
                                                                    key={opt.idDanhMuc || opt.idThuongHieu || opt.idNhaCungCap || opt.idDonViTinh}
                                                                    value={opt.idDanhMuc || opt.idThuongHieu || opt.idNhaCungCap || opt.idDonViTinh}
                                                                >
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

                                    <div style={{ marginBottom: 8 }}>
                                        <label style={{ fontWeight: 500 }}>Ảnh sản phẩm (upload từ máy)</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e)}
                                            className="search-input"
                                        />
                                    </div>
                                    {form.hinhAnh && (
                                        <div style={{ marginBottom: 12 }}>
                                            <img
                                                src={form.hinhAnh.startsWith("http") ? form.hinhAnh : `https://localhost:5288${form.hinhAnh}`}
                                                alt="preview"
                                                style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8, border: "1px solid #ccc" }}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Footer cố định */}
                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                                    <button className="add-button" onClick={handleSubmit}>💾 Lưu</button>
                                    <button className="close-btn" onClick={() => setPopup(false)}>Hủy</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {detailPopup && spChiTiet && (
                        <div className="popup">
                            <div className="popup-inner" style={{ maxWidth: 650, maxHeight: '90vh', overflowY: 'auto', padding: 24, position: 'relative' }}>

                                {/* Nút X góc phải */}
                                <button
                                    onClick={() => setDetailPopup(false)}
                                    style={{
                                        position: 'absolute',
                                        top: 10,
                                        right: 16,
                                        background: 'transparent',
                                        fontSize: 18,
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >❌</button>
                                <h2 className="title"> {spChiTiet.tenSanPham}
                                </h2>
                                {/* Hình ảnh sản phẩm */}
                                {spChiTiet.hinhAnh && (
                                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                                        <img
                                            src={spChiTiet.hinhAnh.startsWith('http') ? spChiTiet.hinhAnh : `https://localhost:5288${spChiTiet.hinhAnh}`}
                                            alt="Hình ảnh sản phẩm"
                                            style={{
                                                width: 160,
                                                height: 160,
                                                objectFit: 'cover',
                                                borderRadius: 12,
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                            }}
                                        />
                                    </div>
                                )}
                              

                                <div style={{ lineHeight: 1.6, color: '#333' }}>
                                    <p><strong>Tên:</strong> {spChiTiet.tenSanPham}</p>
                                    <p><strong>SKU:</strong> {spChiTiet.sku}</p>
                                    <p><strong>Màu sắc:</strong> {spChiTiet.mauSac}</p>
                                    <p><strong>Mô tả:</strong> {spChiTiet.moTa}</p>
                                    <p><strong>Khối lượng:</strong> {spChiTiet.khoiLuong} kg</p>
                                    <p><strong>Kích thước:</strong> {spChiTiet.chieuDai} x {spChiTiet.chieuRong} x {spChiTiet.chieuCao} cm</p>
                                    <p><strong>Đơn giá bán:</strong> {Number(spChiTiet.donGiaBan || 0).toLocaleString()}đ</p>
                                    <p><strong>SL hiện còn:</strong> {spChiTiet.soLuongHienCon}</p>
                                    <p><strong>SL tối thiểu:</strong> {spChiTiet.soLuongToiThieu}</p>
                                    <p><strong>Ngày sản xuất:</strong> {spChiTiet.ngaySanXuat?.slice(0, 10)}</p>
                                    <p><strong>Thương hiệu:</strong> {thuongHieus.find(th => th.idThuongHieu === spChiTiet.idThuongHieu)?.tenThuongHieu || 'Không có'}</p>
                                    <p><strong>Nhà cung cấp:</strong> {nhaCungCaps.find(ncc => ncc.idNhaCungCap === spChiTiet.idNhaCungCap)?.tenNhaCungCap || 'Không có'}</p>
                                    <p><strong>Đơn vị tính:</strong> {donViTinhs.find(dvt => dvt.idDonViTinh === spChiTiet.idDonViTinh)?.tenDonViTinh || 'Không có'}</p>
                                </div>

                                {/* Thông số kỹ thuật */}
                                {spChiTiet.dsThongSo?.length > 0 && (
                                    <div style={{ marginTop: 16 }}>
                                        <h4 style={{ marginBottom: 8 }}>🔬 Thông số kỹ thuật</h4>
                                        <ul style={{ paddingLeft: 20 }}>
                                            {spChiTiet.dsThongSo.map((ts, idx) => (
                                                <li key={idx}><strong>{ts.tenThongSo}:</strong> {ts.giaTri}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Nút đóng cố định */}
                                <div style={{
                                    position: 'sticky',
                                    bottom: 0,
                                    background: '#fff',
                                    paddingTop: 6,
                                    paddingBottom: 38,
                                    marginTop: 4,
                                    textAlign: 'center',
                                    borderTop: '1px solid #eee'
                                }}>
                                    <button
                                        className="close-btn"
                                        onClick={() => setDetailPopup(false)}
                                        style={{
                                            padding: "8px 20px",
                                            backgroundColor: "#617BAD",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: 6,
                                            cursor: "pointer"
                                        }}
                                    >
                                        Đóng
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}



                </div>
            </div>
        </div>
    );
};

export default QuanLySanPham;