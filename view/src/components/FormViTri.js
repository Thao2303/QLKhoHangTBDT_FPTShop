// ✅ FormViTri - Popup Đẹp Gọn + Gán khu vực
import React, { useEffect, useState } from "react";
import "./popup-style.css";
import { useNavigate } from "react-router-dom";


const FormViTri = ({ visible, onClose, onSubmit, initialData }) => {

    const [formData, setFormData] = useState({
        day: "",
        cot: 1,
        tang: 1,
        daDung: 0,
        trangThai: "1",
        chieuDai: 1200,
        chieuRong: 1000,
        chieuCao: 1300,
        sucChua: 1200 * 1000 * 1300,
        idKhuVuc: ""
    });

    // ⬇⬇⬇ THÊM SAU useState
    const updateKichThuoc = (field, value) => {
        const newData = { ...formData, [field]: Number(value) };
        newData.sucChua = newData.chieuDai * newData.chieuRong * newData.chieuCao;
        setFormData(newData);
    };



    const [khuVucList, setKhuVucList] = useState([]);

    useEffect(() => {
        if (initialData) {
            setFormData((prev) => ({
                ...prev,
                idViTri: initialData.idViTri || null,  // 👈 thêm dòng này
                day: initialData.day || "",
                cot: initialData.cot || 1,
                tang: initialData.tang || 1,
                sucChua: initialData.sucChua || 1000,
                daDung: initialData.daDung || 0,
                trangThai: initialData.trangThai || "1",
                chieuDai: initialData.chieuDai || 0,
                chieuRong: initialData.chieuRong || 0,
                chieuCao: initialData.chieuCao || 0,
                idKhuVuc: initialData.idKhuVuc || ""
            }));
        }

        // Gọi API lấy danh sách khu vực
        fetch("https://qlkhohangtbdt-fptshop-be2.onrender.com/api/khuvuc")
            .then((res) => res.json())
            .then((data) => setKhuVucList(data))
            .catch((err) => console.error("Lỗi load khu vực:", err));
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            idKhuVuc: Number(formData.idKhuVuc)
        });

    };

    if (!visible) return null;

    return (
        <div className="popup-overlay">
            <form onSubmit={handleSubmit} className="popup-form">
                <h2 className="text-lg font-semibold mb-4">
                    {initialData ? "Sửa vị trí" : "Thêm vị trí"}
                </h2>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px"
                }}>
                    <div>
                        <label className="block mb-1">Dãy</label>
                        <input type="text" name="day" value={formData.day} onChange={handleChange} className="input" required />
                    </div>
                    <div>
                        <label className="block mb-1">Cột</label>
                        <input type="number" name="cot" value={formData.cot} onChange={handleChange} className="input" required />
                    </div>
                    <div>
                        <label className="block mb-1">Tầng</label>
                        <input type="number" name="tang" value={formData.tang} onChange={handleChange} className="input" required />
                    </div>

                    <div>
                        <label className="block mb-1">Đã dùng</label>
                        <input type="number" name="daDung" value={formData.daDung} onChange={handleChange} className="input" disabled />
                    </div>
                    <div>
                        <label className="block mb-1">Trạng thái</label>
                        <select name="trangThai" value={formData.trangThai} onChange={handleChange} className="input">
                            <option value="1">Còn trống</option>
                            <option value="0">Đã khoá</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1">Chiều dài (mm)</label>
                        <input type="number" name="chieuDai" value={formData.chieuDai} onChange={(e) => updateKichThuoc("chieuDai", e.target.value)} className="input" />
                    </div>
                    <div>
                        <label className="block mb-1">Chiều rộng (mm)</label>
                        <input type="number" name="chieuRong" value={formData.chieuRong} onChange={(e) => updateKichThuoc("chieuRong", e.target.value)} className="input" />
                    </div>
                    <div>
                        <label className="block mb-1">Chiều cao (mm)</label>
                        <input type="number" name="chieuCao" value={formData.chieuCao} onChange={(e) => updateKichThuoc("chieuCao", e.target.value)} className="input" />
                    </div>
                    <div>
                        <label className="block mb-1">Sức chứa (mm³)</label>
                        <input type="number" name="sucChua" value={formData.sucChua} className="input" readOnly />

                    </div>
                    <div>
                        <label className="block mb-1">Khu vực</label>
                        <select name="idKhuVuc" value={formData.idKhuVuc || ""} onChange={handleChange} className="input" required>
                            <option value="">-- Chọn khu vực --</option>
                            {khuVucList.map((kv) => (
                                <option key={kv.idKhuVuc} value={kv.idKhuVuc}>
                                    {kv.tenKhuVuc}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                        Huỷ
                    </button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Lưu
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormViTri;
