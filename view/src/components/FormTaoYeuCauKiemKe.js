import React, { useEffect, useState } from "react";
import axios from "axios";
import { Autocomplete, TextField } from "@mui/material";
import "./popup-style.css";

const FormYeuCauKiemKePopup = ({ visible, onClose, onSubmit, initialData = null }) => {
    const [sanPhamList, setSanPhamList] = useState([]);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [dsTaiKhoan, setDsTaiKhoan] = useState([]);
    const [tuKhoa, setTuKhoa] = useState(""); // ✅ Thêm state tìm kiếm
    const [form, setForm] = useState({
        mucDich: "",
        viTriKiemKe: "",
        ghiChu: "",
        tenTruongBan: "",
        tenUyVien1: "",
        tenUyVien2: ""
    });

    useEffect(() => {
        axios.get("https://qlkhohangtbdt-fptshop-be2.onrender.com/api/kiemke/tonghop")
            .then(res => setSanPhamList(res.data))
            .catch(() => alert("❌ Lỗi tải sản phẩm"));

        axios.get("https://qlkhohangtbdt-fptshop-be2.onrender.com/api/yeucaukiemke/taikhoan")
            .then(res => setDsTaiKhoan(res.data))
            .catch(() => alert("❌ Lỗi tải tài khoản"));
    }, []);
    const removeVietnameseTones = (str) => {
        return str.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D");
    };

    useEffect(() => {
        if (initialData) {
            setForm({
                mucDich: initialData.mucDich || "",
                viTriKiemKe: initialData.viTriKiemKe || "",
                ghiChu: initialData.ghiChu || "",
                tenTruongBan: initialData.tenTruongBan || "",
                tenUyVien1: initialData.tenUyVien1 || "",
                tenUyVien2: initialData.tenUyVien2 || ""
            });
            setSelectedIds(new Set((initialData.chiTietYeuCau || []).map(sp => sp.idSanPham)));
        } else {
            setForm({ mucDich: "", viTriKiemKe: "", ghiChu: "", tenTruongBan: "", tenUyVien1: "", tenUyVien2: "" });
            setSelectedIds(new Set());
        }
    }, [initialData, visible]);

    const toggleSanPham = (id) => {
        const newSet = new Set(selectedIds);
        newSet.has(id) ? newSet.delete(id) : newSet.add(id);
        setSelectedIds(newSet);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            trangThai: 0,
            nguoiTao: 1,
            chiTietYeuCau: Array.from(selectedIds).map(id => ({ idSanPham: id }))
        };

        try {
            if (initialData) {
                await axios.put(`https://qlkhohangtbdt-fptshop-be2.onrender.com/api/yeucaukiemke/${initialData.idYeuCauKiemKe}`, payload);
                alert("✅ Cập nhật yêu cầu thành công");
            } else {
                await axios.post("https://qlkhohangtbdt-fptshop-be2.onrender.com/api/yeucaukiemke", payload);
                alert("✅ Đã tạo yêu cầu");
            }
            onSubmit();
        } catch {
            alert("❌ Gửi yêu cầu thất bại");
        }
    };

    if (!visible) return null;

    const sanPhamLoc = sanPhamList.filter(sp =>
        removeVietnameseTones(sp.tenSanPham.toLowerCase()).includes(
            removeVietnameseTones(tuKhoa.toLowerCase())
        )
    );


    return (
        <div className="popup-overlay">
            <form className="popup-box" onSubmit={handleSubmit}>
                <h2 className="popup-title">{initialData ? "✏️ Sửa yêu cầu" : "📋 Tạo yêu cầu kiểm kê"}</h2>

                <label>Mục đích</label>
                <input className="input" value={form.mucDich} onChange={(e) => setForm({ ...form, mucDich: e.target.value })} required />

                <label>Vị trí kiểm kê</label>
                <input className="input" value={form.viTriKiemKe} onChange={(e) => setForm({ ...form, viTriKiemKe: e.target.value })} required />

                <label>Trưởng ban</label>
                <Autocomplete
                    options={dsTaiKhoan}
                    value={form.tenTruongBan}
                    onChange={(e, val) => setForm({ ...form, tenTruongBan: val || "" })}
                    renderInput={(params) => <TextField {...params} label="Chọn trưởng ban" />}
                />

                <label>Ủy viên 1</label>
                <Autocomplete
                    options={dsTaiKhoan}
                    value={form.tenUyVien1}
                    onChange={(e, val) => setForm({ ...form, tenUyVien1: val || "" })}
                    renderInput={(params) => <TextField {...params} label="Chọn ủy viên 1" />}
                />

                <label>Ủy viên 2</label>
                <Autocomplete
                    options={dsTaiKhoan}
                    value={form.tenUyVien2}
                    onChange={(e, val) => setForm({ ...form, tenUyVien2: val || "" })}
                    renderInput={(params) => <TextField {...params} label="Chọn ủy viên 2" />}
                />

                <label>Ghi chú</label>
                <textarea className="input" value={form.ghiChu} onChange={(e) => setForm({ ...form, ghiChu: e.target.value })} />

                <h3>📦 Chọn sản phẩm cần kiểm kê</h3>

                {/* ✅ Thanh tìm kiếm sản phẩm */}
                <div style={{ margin: "10px 0" }}>
                    <TextField
                        label="🔍 Tìm kiếm sản phẩm"
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={tuKhoa}
                        onChange={(e) => setTuKhoa(e.target.value)}
                    />
                </div>

                <div className="table-scroll">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.size === sanPhamList.length}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedIds(new Set(sanPhamList.map(sp => sp.idSanPham)));
                                            } else {
                                                setSelectedIds(new Set());
                                            }
                                        }}
                                    />
                                </th>
                                <th>Tên sản phẩm</th>
                                <th>Số lượng hiện có</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sanPhamLoc.map(sp => (
                                <tr key={sp.idSanPham}>
                                    <td><input type="checkbox" checked={selectedIds.has(sp.idSanPham)} onChange={() => toggleSanPham(sp.idSanPham)} /></td>
                                    <td>{sp.tenSanPham}</td>
                                    <td>{sp.soLuongHienCon}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {selectedIds.size > 0 && (
                    <div style={{ marginTop: 20 }}>
                        <h4>✅ Danh sách sản phẩm đã chọn</h4>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Số lượng hiện có</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from(selectedIds).map((id, idx) => {
                                    const sp = sanPhamList.find(sp => sp.idSanPham === id);
                                    return sp ? (
                                        <tr key={id}>
                                            <td>{idx + 1}</td>
                                            <td>{sp.tenSanPham}</td>
                                            <td>{sp.soLuongHienCon}</td>
                                        </tr>
                                    ) : null;
                                })}
                            </tbody>
                        </table>
                        <p><strong>Tổng sản phẩm được chọn:</strong> {selectedIds.size}</p>
                    </div>
                )}

                <div className="popup-actions">
                    <button type="button" className="btn btn-cancel" onClick={onClose}>Huỷ</button>
                    <button type="submit" className="btn btn-primary">Lưu</button>
                </div>
            </form>
        </div>
    );
};

export default FormYeuCauKiemKePopup;
