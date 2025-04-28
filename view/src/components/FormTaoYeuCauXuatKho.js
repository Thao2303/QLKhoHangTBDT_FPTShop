import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './FormTaoPhieuNhap.css';

const FormTaoYeuCauXuatKho = () => {
    const [sanPham, setSanPham] = useState('');
    const [soLuong, setSoLuong] = useState('');
    const [ghiChu, setGhiChu] = useState('');
    const [danhSachSP, setDanhSachSP] = useState([]);
    const [danhSachThem, setDanhSachThem] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get('https://localhost:5288/api/sanpham')
            .then(res => setDanhSachSP(res.data))
            .catch(err => console.error('❌ Lỗi tải sản phẩm:', err));
    }, []);

    const handleThem = () => {
        if (!sanPham || !soLuong || soLuong <= 0) {
            alert("Vui lòng chọn sản phẩm và nhập số lượng hợp lệ!");
            return;
        }

        if (danhSachThem.some(sp => sp.idSanPham === sanPham)) {
            alert("Sản phẩm đã được thêm trước đó!");
            return;
        }

        const sp = danhSachSP.find(item => item.idSanPham.toString() === sanPham);
        setDanhSachThem([...danhSachThem, {
            idSanPham: sanPham,
            tenSanPham: sp.tenSanPham,
            soLuong: parseInt(soLuong)
        }]);

        setSanPham('');
        setSoLuong('');
    };

    const handleXoa = (id) => {
        setDanhSachThem(prev => prev.filter(sp => sp.idSanPham !== id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (danhSachThem.length === 0) {
            alert("Vui lòng thêm ít nhất một sản phẩm!");
            return;
        }

        const user = JSON.parse(localStorage.getItem("user"));
        const payload = {
            idDaiLy: user?.idDaiLy || 1,
            idTrangThaiXacNhan: 1,
            ghiChu,
            chiTietYeuCauXuatKhos: danhSachThem.map(sp => ({
                idSanPham: parseInt(sp.idSanPham),
                soLuong: parseInt(sp.soLuong)
            }))
        };

        try {
            await axios.post("https://localhost:5288/api/yeucauxuatkho/tao", payload);
            alert("✅ Gửi yêu cầu xuất kho thành công!");
            navigate("/quanlyyeucauxuat");
        } catch (err) {
            console.error("❌ Lỗi gửi yêu cầu:", err);
            alert("Gửi yêu cầu thất bại!");
        }
    };

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <div className="content-area2">
                    <div className="main-layout">
                        <Navbar />
                        <div className="form-container">
                            <h2>📦 Gửi yêu cầu xuất kho</h2>

                            <form onSubmit={handleSubmit} className="form-grid">
                                <div className="form-section">
                                    <label>Sản phẩm</label>
                                    <select value={sanPham} onChange={(e) => setSanPham(e.target.value)}>
                                        <option value="">Chọn sản phẩm</option>
                                        {danhSachSP.map(sp => (
                                            <option key={sp.idSanPham} value={sp.idSanPham}>
                                                {sp.tenSanPham}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-section">
                                    <label>Số lượng</label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={soLuong}
                                        onChange={(e) => setSoLuong(e.target.value)}
                                        placeholder="Nhập số lượng"
                                    />
                                </div>

                                <div className="form-section full-width">
                                    <label>Ghi chú</label>
                                    <textarea
                                        value={ghiChu}
                                        onChange={(e) => setGhiChu(e.target.value)}
                                        placeholder="Ghi chú (nếu có)"
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="button" onClick={handleThem} className="add-button">+ Thêm</button>
                                </div>

                                {danhSachThem.length > 0 && (
                                    <div className="added-products full-width">
                                        <h3>Sản phẩm đã thêm:</h3>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Tên sản phẩm</th>
                                                    <th>Số lượng</th>
                                                    <th>Xóa</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {danhSachThem.map((sp, index) => (
                                                    <tr key={index}>
                                                        <td>{sp.tenSanPham}</td>
                                                        <td>{sp.soLuong}</td>
                                                        <td>
                                                            <button type="button" onClick={() => handleXoa(sp.idSanPham)}>🗑</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                <div className="form-actions full-width">
                                    <button type="reset" className="cancel-button" onClick={() => {
                                        setDanhSachThem([]);
                                        setSanPham('');
                                        setSoLuong('');
                                        setGhiChu('');
                                    }}>Hủy</button>
                                    <button type="submit" className="submit-button">📨 Gửi yêu cầu</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormTaoYeuCauXuatKho;
