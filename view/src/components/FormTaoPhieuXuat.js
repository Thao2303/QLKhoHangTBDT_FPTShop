// ✅ BẢN ĐÃ SỬA: HỖ TRỢ CHỌN NHIỀU VỊ TRÍ CHO MỖI SẢN PHẨM
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './FormTaoPhieuNhap.css';

const FormTaoPhieuXuat = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const tuYeuCau = location.state?.tuYeuCau;
    const dsSanPham = location.state?.dsSanPham || [];

    const [ghiChu, setGhiChu] = useState("");
    const [ngayXuat, setNgayXuat] = useState(new Date().toISOString().slice(0, 10));
    const [viTriMap, setViTriMap] = useState({});
    const [phanBo, setPhanBo] = useState({}); // { idSanPham: [{ idViTri, soLuong }] }

    useEffect(() => {
        dsSanPham.forEach(sp => {
            axios.get(`https://localhost:5288/api/phieuxuat/vitri-sanpham/${sp.idSanPham}`)
                .then(res => {
                    setViTriMap(prev => ({
                        ...prev,
                        [sp.idSanPham]: removeDuplicates(res.data)
                    }));
                })
                .catch(err => console.error('Lỗi lấy vị trí:', err));
        });
    }, [dsSanPham]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const chiTietPhieuXuats = [];

        for (const sp of dsSanPham) {
            const danhSach = phanBo[sp.idSanPham] || [];
            const tong = danhSach.reduce((sum, p) => sum + p.soLuong, 0);
            if (tong !== sp.soLuong) {
                alert(`⚠️ Sản phẩm "${sp.tenSanPham}" cần xuất ${sp.soLuong}, nhưng bạn mới phân bổ ${tong}.`);
                return;
            }
            for (const p of danhSach) {
                chiTietPhieuXuats.push({
                    idSanPham: sp.idSanPham,
                    soLuong: p.soLuong,
                    idViTri: p.idViTri
                });
            }
        }

        const payload = {
            idYeuCauXuatKho: tuYeuCau.idYeuCauXuatKho,
            ngayXuat,
            ghiChu,
            nguoiTao: "admin", // có thể lấy từ context đăng nhập sau này
            chiTietPhieuXuats
        };

        try {
            await axios.post("https://localhost:5288/api/phieuxuat/kiemtra-tonkho", chiTietPhieuXuats);
            await axios.post("https://localhost:5288/api/phieuxuat", payload);
            alert("✅ Phiếu xuất đã được tạo thành công!");
            navigate("/quanlyphieuxuat");
        } catch (err) {
            alert("❌ Không thể tạo phiếu: " + (err.response?.data || "Lỗi không xác định"));
            console.error(err);
        }
    };

    const removeDuplicates = (arr) => {
        const seen = new Set();
        return arr.filter(item => {
            const key = `${item.idViTri}-${item.idSanPham}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    };

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area5">
                <Navbar />
                <div className="form-container">
                    <h2>Tạo Phiếu Xuất Kho từ Yêu Cầu #{tuYeuCau?.idYeuCauXuatKho}</h2>
                    <form onSubmit={handleSubmit} className="form-grid">
                        <div className="form-section">
                            <label>Ngày xuất</label>
                            <input type="date" value={ngayXuat} onChange={(e) => setNgayXuat(e.target.value)} />
                        </div>

                        <div className="form-section full-width">
                            <label>Ghi chú</label>
                            <textarea value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} />
                        </div>

                        <div className="added-products full-width">
                            <h3>Danh sách sản phẩm xuất:</h3>
                            {dsSanPham.map(sp => (
                                <div key={sp.idSanPham} className="phanbo-sp">
                                    <h4>{sp.tenSanPham} (Cần: {sp.soLuong})</h4>
                                    <table>
                                        <thead>
                                            <tr><th>Vị trí</th><th>Số lượng còn</th><th>Số lượng xuất</th></tr>
                                        </thead>
                                        <tbody>
                                            {viTriMap[sp.idSanPham]?.map((v, idx) => (
                                                <tr key={v.idViTri}>
                                                    <td>Dãy {v.day} - Cột {v.cot} - Tầng {v.tang}</td>
                                                    <td>{v.soLuongCon}</td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max={v.soLuongCon}
                                                            value={
                                                                phanBo[sp.idSanPham]?.find(p => p.idViTri === v.idViTri)?.soLuong || ''
                                                            }
                                                            onChange={(e) => {
                                                                const value = parseInt(e.target.value || 0);
                                                                setPhanBo(prev => {
                                                                    const list = prev[sp.idSanPham] || [];
                                                                    const updated = list.filter(p => p.idViTri !== v.idViTri);
                                                                    if (value > 0) updated.push({ idViTri: v.idViTri, soLuong: value });
                                                                    return { ...prev, [sp.idSanPham]: updated };
                                                                });
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>

                        <div className="form-actions full-width">
                            <button type="submit" className="submit-button">✅ Xác nhận xuất kho</button>
                            <button type="button" className="cancel-button" onClick={() => navigate(-1)}>Quay lại</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormTaoPhieuXuat;
