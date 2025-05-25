// 📁 FormChinhSuaYeuCauKiemKe.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const FormChinhSuaYeuCauKiemKe = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        mucDich: "",
        viTriKiemKe: "",
        tenTruongBan: "",
        tenUyVien1: "",
        tenUyVien2: "",
        chiTietYeuCau: []
    });
    const [dsSanPham, setDsSanPham] = useState([]);

    useEffect(() => {
        axios.get(`https://qlkhohangtbdt-fptshop-be2.onrender.com/api/yeucaukiemke/${id}`)
            .then(res => setForm({
                ...res.data,
                chiTietYeuCau: res.data.chiTietYeuCau.map(sp => sp.idSanPham)
            }))
            .catch(() => alert("Không tìm thấy yêu cầu."));

        axios.get("https://qlkhohangtbdt-fptshop-be2.onrender.com/api/sanpham")
            .then(res => setDsSanPham(res.data))
            .catch(() => { });
    }, [id]);

    const handleChange = e => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const toggleSanPham = idSP => {
        setForm(prev => ({
            ...prev,
            chiTietYeuCau: prev.chiTietYeuCau.includes(idSP)
                ? prev.chiTietYeuCau.filter(x => x !== idSP)
                : [...prev.chiTietYeuCau, idSP]
        }));
    };

    const handleSubmit = async () => {
        const payload = {
            mucDich: form.mucDich,
            viTriKiemKe: form.viTriKiemKe,
            tenTruongBan: form.tenTruongBan,
            tenUyVien1: form.tenUyVien1,
            tenUyVien2: form.tenUyVien2,
            ngayTao: form.ngayTao,
            chiTietYeuCau: form.chiTietYeuCau.map(idSanPham => ({ idSanPham }))
        };

        try {
            await axios.put(`https://qlkhohangtbdt-fptshop-be2.onrender.com/api/yeucaukiemke/${id}`, payload);
            alert("✅ Cập nhật yêu cầu thành công");
            navigate("/quan-ly-yeu-cau-kiem-ke");
        } catch {
            alert("❌ Cập nhật thất bại");
        }
    };

    return (
        <div className="container">
            <h2>✏️ Chỉnh sửa yêu cầu kiểm kê #{id}</h2>

            <label>Mục đích:</label>
            <input name="mucDich" value={form.mucDich} onChange={handleChange} />

            <label>Vị trí kiểm kê:</label>
            <input name="viTriKiemKe" value={form.viTriKiemKe} onChange={handleChange} />

            <label>Trưởng ban:</label>
            <input name="tenTruongBan" value={form.tenTruongBan} onChange={handleChange} />

            <label>Ủy viên 1:</label>
            <input name="tenUyVien1" value={form.tenUyVien1} onChange={handleChange} />

            <label>Ủy viên 2:</label>
            <input name="tenUyVien2" value={form.tenUyVien2} onChange={handleChange} />

            <h4>📦 Danh sách sản phẩm:</h4>
            <div className="checkbox-list">
                {dsSanPham.map(sp => (
                    <label key={sp.idSanPham}>
                        <input
                            type="checkbox"
                            checked={form.chiTietYeuCau.includes(sp.idSanPham)}
                            onChange={() => toggleSanPham(sp.idSanPham)}
                        />
                        {sp.tenSanPham}
                    </label>
                ))}
            </div>

            <button onClick={handleSubmit}>💾 Lưu thay đổi</button>
        </div>
    );
};

export default FormChinhSuaYeuCauKiemKe;
