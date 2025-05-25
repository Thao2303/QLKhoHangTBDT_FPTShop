import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FormTaoPhieuNhap.css';

const FormPhieuXuat = ({ onCreated }) => {
    const [yeuCauList, setYeuCauList] = useState([]);
    const [selectedYC, setSelectedYC] = useState('');
    const [chiTietYC, setChiTietYC] = useState([]);

    useEffect(() => {
        axios.get("https://qlkhohangtbdt-fptshop-be2.onrender.com/api/yeucauxuatkho")
            .then(res => {
                const list = res.data.filter(x => x.idTrangThaiXacNhan === 2);
                setYeuCauList(list);
            });
    }, []);

    const handleSelectYeuCau = async (id) => {
        setSelectedYC(id);
        const res = await axios.get(`https://qlkhohangtbdt-fptshop-be2.onrender.com/api/yeucauxuatkho/chitiet/${id}`);
        setChiTietYC(res.data);
    };

    const handleTaoPhieuXuat = async () => {
        if (!selectedYC || chiTietYC.length === 0) {
            alert("Vui lòng chọn yêu cầu và có sản phẩm!");
            return;
        }

        const payload = {
            idYeuCauXuatKho: parseInt(selectedYC),
            chiTietPhieuXuats: chiTietYC.map(ct => ({
                idSanPham: ct.idSanPham,
                soLuong: ct.soLuong
            }))
        };

        try {
            await axios.post("https://qlkhohangtbdt-fptshop-be2.onrender.com/api/phieuxuat/kiemtra-tonkho", payload.chiTietPhieuXuats);
            await axios.post("https://qlkhohangtbdt-fptshop-be2.onrender.com/api/phieuxuat", payload);
            alert("✅ Đã tạo phiếu xuất thành công!");
            setSelectedYC('');
            setChiTietYC([]);
            if (onCreated) onCreated();
        } catch (err) {
            alert("❌ Không thể tạo phiếu: " + (err.response?.data || "Lỗi không xác định"));
        }
    };

    return (
        <div className="form-container">
            <h2>Tạo Phiếu Xuất Kho</h2>
            <div className="form-section">
                <label>Yêu cầu xuất kho đã xác nhận</label>
                <select value={selectedYC} onChange={(e) => handleSelectYeuCau(e.target.value)}>
                    <option value="">-- Chọn yêu cầu --</option>
                    {yeuCauList.map((yc) => (
                        <option key={yc.idYeuCauXuatKho} value={yc.idYeuCauXuatKho}>
                            #{yc.idYeuCauXuatKho} - {yc.daiLy?.tenDaiLy}
                        </option>
                    ))}
                </select>
            </div>

            {chiTietYC.length > 0 && (
                <div className="added-products">
                    <h3>Sản phẩm cần xuất:</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Tên sản phẩm</th>
                                <th>Số lượng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chiTietYC.map((sp, i) => (
                                <tr key={i}>
                                    <td>{sp.sanPham?.tenSanPham || `SP #${sp.idSanPham}`}</td>
                                    <td>{sp.soLuong}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="form-actions">
                <button className="cancel-button" onClick={() => {
                    setSelectedYC('');
                    setChiTietYC([]);
                }}>Hủy</button>
                <button className="submit-button" onClick={handleTaoPhieuXuat}>Lưu</button>
            </div>
        </div>
    );
};

export default FormPhieuXuat;