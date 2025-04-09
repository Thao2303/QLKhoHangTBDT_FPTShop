import React, { useEffect, useState } from "react";

const FormViTri = ({ visible, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        day: "",
        cot: 1,
        tang: 1,
        sucChua: 1000,
        daDung: 0,
        trangThai: "1",
        chieuDai: 0,
        chieuRong: 0,
        chieuCao: 0,
    });

    useEffect(() => {
        if (initialData) {
            setFormData((prev) => ({
                ...prev,
                day: initialData.day || "",
                cot: initialData.cot || 1,
                tang: initialData.tang || 1,
                sucChua: initialData.sucChua || 1000,
                daDung: initialData.daDung || 0,
                trangThai: initialData.trangThai || "1",
                chieuDai: initialData.chieuDai || 0,
                chieuRong: initialData.chieuRong || 0,
                chieuCao: initialData.chieuCao || 0,
            }));
        }
    }, [initialData]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-lg">
                <h2 className="text-lg font-semibold mb-4">{initialData ? "Sửa vị trí" : "Thêm vị trí"}</h2>

                <div className="grid grid-cols-2 gap-4">
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
                        <label className="block mb-1">Sức chứa</label>
                        <input type="number" name="sucChua" value={formData.sucChua} onChange={handleChange} className="input" required />
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
                        <label className="block mb-1">Chiều dài</label>
                        <input type="number" name="chieuDai" value={formData.chieuDai} onChange={handleChange} className="input" />
                    </div>
                    <div>
                        <label className="block mb-1">Chiều rộng</label>
                        <input type="number" name="chieuRong" value={formData.chieuRong} onChange={handleChange} className="input" />
                    </div>
                    <div>
                        <label className="block mb-1">Chiều cao</label>
                        <input type="number" name="chieuCao" value={formData.chieuCao} onChange={handleChange} className="input" />
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