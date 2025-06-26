// 📁 FormSuaYeuCauKiemKe.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const FormSuaYeuCauKiemKe = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({ mucDich: "", ghiChu: "", viTri: "" });
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`https://qlkhohangtbdt-fptshop-be2.onrender.com/api/yeucaukiemke/${id}`)
            .then((res) => res.json())
            .then((data) => setFormData(data))
            .catch((err) => console.error("Lỗi lấy yêu cầu:", err));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(`https://qlkhohangtbdt-fptshop-be2.onrender.com/api/yeucaukiemke/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });
        if (res.ok) {
            alert("✅ Cập nhật thành công");
            navigate("/yeu-cau-kiem-ke");
        } else {
            alert("❌ Cập nhật thất bại");
        }
    };

    return (
        <div className="form-container">
            <h2>SỬA YÊU CẦU KIỂM KÊ</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Mục đích:</label>
                    <input name="mucDich" value={formData.mucDich} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Ghi chú:</label>
                    <textarea name="ghiChu" value={formData.ghiChu} onChange={handleChange}></textarea>
                </div>
                <div className="form-group">
                    <label>Vị trí kiểm kê:</label>
                    <input name="viTri" value={formData.viTri} onChange={handleChange} />
                </div>
                <button type="submit">💾 Lưu thay đổi</button>
            </form>
        </div>
    );
};

export default FormSuaYeuCauKiemKe;