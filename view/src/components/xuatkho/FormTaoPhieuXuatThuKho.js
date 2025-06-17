import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../common/Sidebar/Sidebar';
import Navbar from '../common/Navbar/Navbar';
import "../nhapkho/FormTaoPhieuNhap.css";
import { useNavigate } from 'react-router-dom';

const FormTaoPhieuXuatThuKho = () => {
    const navigate = useNavigate();
    const [ngayXuat, setNgayXuat] = useState(new Date().toISOString().slice(0, 10));
    const [ghiChu, setGhiChu] = useState('');
    const [danhMucList, setDanhMucList] = useState([]);
    const [sanPhamList, setSanPhamList] = useState([]);
    const [viTriMap, setViTriMap] = useState({});
    const [idDanhMuc, setIdDanhMuc] = useState('');
    const [idSanPham, setIdSanPham] = useState('');
    const [soLuong, setSoLuong] = useState('');
    const [phanBo, setPhanBo] = useState({}); // {idSanPham: [{idViTri, soLuong}]}
    const [dsSanPham, setDsSanPham] = useState([]);

    useEffect(() => {
        axios.get('https://localhost:5288/api/phieuxuat/danhmuc').then(res => {
            setDanhMucList(res.data);
        });
    }, []);

    useEffect(() => {
        if (idDanhMuc)
            axios.get(`https://localhost:5288/api/phieuxuat/sanpham/danhmuc/${idDanhMuc}`).then(res => {
                setSanPhamList(res.data);
            });
    }, [idDanhMuc]);

    useEffect(() => {
        if (!idSanPham) return;

        axios.get(`https://localhost:5288/api/phieuxuat/vitri-sanpham/${idSanPham}`).then(res => {
            const viTris = res.data.sort((a, b) => new Date(a.thoiGianLuu) - new Date(b.thoiGianLuu));
            setViTriMap(prev => ({ ...prev, [idSanPham]: viTris }));
        });
    }, [idSanPham]);

    const themSanPham = () => {
        if (!idSanPham || !soLuong || isNaN(soLuong) || soLuong <= 0) return alert("Thông tin chưa hợp lệ");

        let soLuongCan = +soLuong;
        const gợiÝ = [];

        for (const vt of viTriMap[idSanPham] || []) {
            if (soLuongCan <= 0) break;
            const lay = Math.min(vt.soLuongCon, soLuongCan);
            gợiÝ.push({ idViTri: vt.idViTri, soLuong: lay });
            soLuongCan -= lay;
        }

        if (soLuongCan > 0) return alert('❌ Không đủ tồn kho theo vị trí để phân bổ.');

        setDsSanPham(prev => [...prev, { idSanPham, tenSanPham: sanPhamList.find(sp => sp.idSanPham === +idSanPham)?.tenSanPham, soLuong: +soLuong, phanBo: gợiÝ }]);
        setIdSanPham('');
        setSoLuong('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const chiTietPhieuXuats = [];
        for (const sp of dsSanPham) {
            for (const p of sp.phanBo) {
                chiTietPhieuXuats.push({
                    idSanPham: sp.idSanPham,
                    idViTri: p.idViTri,
                    soLuong: p.soLuong,
                });
            }
        }

        const payload = {
            idYeuCauXuatKho: null,
            ngayXuat,
            ghiChu,
            nguoiTao: "admin",
            chiTietPhieuXuats,
        };

        try {
            await axios.post('https://localhost:5288/api/phieuxuat/kiemtra-tonkho', chiTietPhieuXuats);
            await axios.post('https://localhost:5288/api/phieuxuat', payload);
            alert('✅ Đã tạo phiếu xuất thành công!');
            navigate('/quanlyphieuxuat');
        } catch (err) {
            alert("❌ Không thể tạo phiếu: " + (err.response?.data || "Lỗi không xác định"));
            console.error(err);
        }
    };

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area5">
                <Navbar />
                <div className="form-container">
                    <h2>Tạo Phiếu Xuất Kho (Không cần yêu cầu)</h2>
                    <form onSubmit={handleSubmit} className="form-grid">
                        <div className="form-section">
                            <label>Ngày xuất</label>
                            <input type="date" value={ngayXuat} onChange={(e) => setNgayXuat(e.target.value)} />
                        </div>
                        <div className="form-section full-width">
                            <label>Ghi chú</label>
                            <textarea value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} />
                        </div>

                        <div className="form-section full-width">
                            <label>Danh mục</label>
                            <select value={idDanhMuc} onChange={(e) => setIdDanhMuc(e.target.value)}>
                                <option value="">-- Chọn danh mục --</option>
                                {danhMucList.map(dm => (
                                    <option key={dm.idDanhMuc} value={dm.idDanhMuc}>{dm.tenDanhMuc}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-section full-width">
                            <label>Sản phẩm</label>
                            <select value={idSanPham} onChange={(e) => setIdSanPham(e.target.value)}>
                                <option value="">-- Chọn sản phẩm --</option>
                                {sanPhamList.map(sp => (
                                    <option key={sp.idSanPham} value={sp.idSanPham}>{sp.tenSanPham}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-section full-width">
                            <label>Số lượng</label>
                            <input type="number" value={soLuong} onChange={(e) => setSoLuong(e.target.value)} />
                        </div>

                        <div className="form-section full-width">
                            <button type="button" onClick={themSanPham} className="submit-button">+ Thêm sản phẩm</button>
                        </div>

                        {dsSanPham.length > 0 && (
                            <div className="added-products full-width">
                                <h3>Danh sách sản phẩm đã thêm:</h3>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Tên sản phẩm</th>
                                            <th>Số lượng</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dsSanPham.map((sp, idx) => (
                                            <tr key={idx}>
                                                <td>{sp.tenSanPham}</td>
                                                <td>{sp.soLuong}</td>
                                                <td><button onClick={() => {
                                                    setDsSanPham(prev => prev.filter((_, i) => i !== idx));
                                                }}>🗑️</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="form-actions full-width">
                            <button type="submit" className="submit-button">✅ Tạo phiếu xuất</button>
                            <button type="button" className="cancel-button" onClick={() => navigate(-1)}>Quay lại</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormTaoPhieuXuatThuKho;
