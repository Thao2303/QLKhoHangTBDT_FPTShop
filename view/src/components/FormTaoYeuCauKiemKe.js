import React, { useState } from 'react';

export default function FormTaoYeuCauKiemKe() {
    const [form, setForm] = useState({
        mucDich: '',
        ngayKiem: '',
        viTriKiemKe: '',
        tenTruongBan: '',
        chucVuTruongBan: '',
        tenUyVien1: '',
        chucVuUyVien1: '',
        tenUyVien2: '',
        chucVuUyVien2: '',
        sanPham: '',
        soLuong: '',
        danhSachSanPham: []
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAddSanPham = () => {
        if (!form.sanPham || !form.soLuong) return;
        const newList = [...form.danhSachSanPham, {
            tenSanPham: form.sanPham,
            soLuong: parseInt(form.soLuong)
        }];
        setForm({ ...form, danhSachSanPham: newList, sanPham: '', soLuong: '' });
    };

    const handleSubmit = async () => {
        const payload = {
            mucDich: form.mucDich,
            ngayKiem: form.ngayKiem,
            viTriKiemKe: form.viTriKiemKe,
            tenTruongBan: form.tenTruongBan,
            chucVuTruongBan: form.chucVuTruongBan,
            tenUyVien1: form.tenUyVien1,
            chucVuUyVien1: form.chucVuUyVien1,
            tenUyVien2: form.tenUyVien2,
            chucVuUyVien2: form.chucVuUyVien2,
            chiTietYeuCau: form.danhSachSanPham
        };

        const res = await fetch('https://localhost:5288/api/yeucaukiemke', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) alert('Tạo yêu cầu thành công!');
        else alert('Lỗi khi tạo yêu cầu.');
    };

    return (
        <div className="p-4 bg-white rounded shadow max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Tạo yêu cầu kiểm kê</h2>
            <div className="grid grid-cols-2 gap-4">
                <input name="mucDich" placeholder="Mục đích" value={form.mucDich} onChange={handleChange} />
                <input name="ngayKiem" type="date" value={form.ngayKiem} onChange={handleChange} />

                <input name="tenTruongBan" placeholder="Tên trưởng ban" value={form.tenTruongBan} onChange={handleChange} />
                <input name="chucVuTruongBan" placeholder="Chức vụ" value={form.chucVuTruongBan} onChange={handleChange} />

                <input name="tenUyVien1" placeholder="Tên ủy viên 1" value={form.tenUyVien1} onChange={handleChange} />
                <input name="chucVuUyVien1" placeholder="Chức vụ" value={form.chucVuUyVien1} onChange={handleChange} />

                <input name="tenUyVien2" placeholder="Tên ủy viên 2" value={form.tenUyVien2} onChange={handleChange} />
                <input name="chucVuUyVien2" placeholder="Chức vụ" value={form.chucVuUyVien2} onChange={handleChange} />

                <input name="viTriKiemKe" placeholder="Vị trí kiểm kê" value={form.viTriKiemKe} onChange={handleChange} className="col-span-2" />
            </div>

            <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold mb-2">Danh sách sản phẩm</h3>
                <div className="flex gap-2">
                    <input name="sanPham" placeholder="Sản phẩm" value={form.sanPham} onChange={handleChange} />
                    <input name="soLuong" placeholder="Số lượng" value={form.soLuong} onChange={handleChange} />
                    <button onClick={handleAddSanPham} className="bg-blue-500 text-white px-4 rounded">Thêm</button>
                </div>
                <ul className="mt-4 list-disc list-inside">
                    {form.danhSachSanPham.map((sp, i) => (
                        <li key={i}>{sp.tenSanPham} - SL: {sp.soLuong}</li>
                    ))}
                </ul>
            </div>

            <div className="mt-6">
                <button onClick={handleSubmit} className="bg-green-600 text-white px-6 py-2 rounded">Tạo yêu cầu</button>
            </div>
        </div>
    );
}
