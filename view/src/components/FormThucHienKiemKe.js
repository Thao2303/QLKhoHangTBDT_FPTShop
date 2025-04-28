import React, { useState, useEffect } from 'react';

export default function FormThucHienKiemKe() {
    const [yeuCau, setYeuCau] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [ngayKiem, setNgayKiem] = useState('');
    const [ghiChu, setGhiChu] = useState('');
    const [chiTiet, setChiTiet] = useState([]);

    useEffect(() => {
        fetch('https://localhost:5288/api/yeucaukiemke')
            .then(res => res.json())
            .then(data => setYeuCau(data));
    }, []);

    useEffect(() => {
        if (!selectedId) return;
        fetch(`https://localhost:5288/api/yeucaukiemke/${selectedId}`)
            .then(res => res.json())
            .then(data => {
                setChiTiet(data.chiTiet.map(sp => ({
                    ...sp,
                    soLuongThucTe: '',
                    phamChat: '',
                    chenhLech: 0
                })));
            });
    }, [selectedId]);

    const handleChange = (index, field, value) => {
        const updated = [...chiTiet];
        updated[index][field] = value;
        if (field === 'soLuongThucTe') {
            const slHeThong = parseInt(updated[index].soLuong || 0);
            updated[index].chenhLech = parseInt(value || 0) - slHeThong;
        }

        setChiTiet(updated);
    };

    const handleSubmit = async () => {
        const payload = {
            idYeuCauKiemKe: selectedId,
            ngayKiemKe: ngayKiem,
            ghiChu: ghiChu,
            chiTiet: chiTiet.map(sp => ({
                idSanPham: sp.idSanPham,
                soLuongThucTe: parseInt(sp.soLuongThucTe || 0),
                phamChat: sp.phamChat
            }))
        };

        const res = await fetch('https://localhost:5288/api/kiemke', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) alert('Lưu phiếu kiểm kê thành công!');
        else alert('Lỗi khi lưu phiếu kiểm kê.');
    };

    return (
        <div className="p-4 bg-white max-w-5xl mx-auto rounded shadow">
            <h2 className="text-xl font-bold mb-4">📋 Thực hiện kiểm kê</h2>
            <div className="flex gap-4 mb-4">
                <select value={selectedId} onChange={e => setSelectedId(e.target.value)}>
                    <option value=''>Chọn yêu cầu kiểm kê</option>
                    {yeuCau.map(yc => (
                        <option key={yc.idYeuCauKiemKe} value={yc.idYeuCauKiemKe}>#{yc.idYeuCauKiemKe} - {yc.ghiChu}</option>
                    ))}
                </select>
                <input type="date" value={ngayKiem} onChange={e => setNgayKiem(e.target.value)} />
            </div>

            <table className="w-full border text-sm">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="border">Sản phẩm</th>
                        <th className="border">SL hệ thống</th>
                        <th className="border">SL thực tế</th>
                        <th className="border">Chênh lệch</th>
                        <th className="border">Phẩm chất</th>
                    </tr>
                </thead>
                <tbody>
                    {chiTiet.map((sp, i) => (
                        <tr key={i}>
                            <td className="border px-2 py-1">{sp.tenSanPham}</td>
                            <td className="border text-center">{sp.soLuong}</td>
                            <td className="border text-center">
                                <input value={sp.soLuongThucTe} onChange={e => handleChange(i, 'soLuongThucTe', e.target.value)} className="w-16 text-center" />
                            </td>
                            <td className="border text-center">{sp.chenhLech}</td>
                            <td className="border text-center">
                                <input value={sp.phamChat} onChange={e => handleChange(i, 'phamChat', e.target.value)} className="text-center" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4">
                <textarea className="w-full border p-2" rows={3} placeholder="Ghi chú" value={ghiChu} onChange={e => setGhiChu(e.target.value)} />
            </div>

            <div className="mt-4 flex gap-2">
                <button onClick={handleSubmit} className="bg-green-600 text-white px-6 py-2 rounded">💾 Lưu phiếu kiểm kê</button>
            </div>
        </div>
    );
}