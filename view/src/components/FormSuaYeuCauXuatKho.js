import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './FormTaoPhieuNhap.css';

const FormSuaYeuCauXuatKho = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [chiTiet, setChiTiet] = useState([]);
    const [sanPhamList, setSanPhamList] = useState([]);
    const [ghiChu, setGhiChu] = useState("");
    const [yeuCau, setYeuCau] = useState({});

    useEffect(() => {
        axios.get(`https://localhost:5288/api/yeucauxuatkho/${id}`)
            .then(res => {
                setYeuCau(res.data);
                setChiTiet(res.data.chiTietYeuCauXuatKhos || []);
                setGhiChu(res.data.ghiChu || "");
            });

        axios.get(`https://localhost:5288/api/sanpham`)
            .then(res => setSanPhamList(res.data));
    }, [id]);

    const handleChange = (index, key, value) => {
        const updated = [...chiTiet];

        if (key === 'tenSanPham') {
            const found = sanPhamList.find(sp => sp.tenSanPham === value);
            updated[index].idSanPham = found?.idSanPham || '';
            updated[index].tenSanPham = value;
        } else {
            updated[index][key] = value;
        }

        setChiTiet(updated);
    };

    const handleXoa = (index) => {
        const updated = [...chiTiet];
        updated.splice(index, 1);
        setChiTiet(updated);
    };

    const handleThemDong = () => {
        setChiTiet([...chiTiet, { idSanPham: '', tenSanPham: '', soLuong: 1 }]);
    };

    const handleUpdate = async () => {
        const payload = {
            ...yeuCau,
            ghiChu,
            chiTietYeuCauXuatKhos: chiTiet.map(ct => ({
                idSanPham: parseInt(ct.idSanPham),
                soLuong: parseInt(ct.soLuong)
            }))
        };

        try {
            await axios.put(`https://localhost:5288/api/yeucauxuatkho/${id}`, payload);
            alert("✅ Cập nhật yêu cầu thành công!");
            navigate("/quanlyyeucauxuat");
        } catch (err) {
            console.error("❌ Lỗi cập nhật:", err);
            alert("Cập nhật thất bại!");
        }
    };

    const tongSoLuong = chiTiet.reduce((sum, ct) => sum + parseInt(ct.soLuong || 0), 0);

    const findTenSP = (id) => {
        return sanPhamList.find(sp => sp.idSanPham === parseInt(id))?.tenSanPham || '';
    };

    const isDuplicate = (idSanPham, index) => {
        return chiTiet.filter((ct, i) => ct.idSanPham === idSanPham && i !== index).length > 0;
    };

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <div className="content-area2">
                    <div className="main-layout">
                        <Navbar />
                        <div className="form-container">
                            <h2>📝 Chỉnh sửa yêu cầu xuất kho #{id} – {yeuCau?.daiLy?.tenDaiLy || 'Đại lý chưa xác định'}</h2>

                            <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="form-grid">

                                <div className="form-section full-width">
                                    <label>Ghi chú</label>
                                    <textarea
                                        value={ghiChu}
                                        onChange={(e) => setGhiChu(e.target.value)}
                                        placeholder="Nhập ghi chú (nếu có)"
                                    />
                                </div>

                                <div className="added-products full-width">
                                    <h3>Sản phẩm yêu cầu:</h3>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Sản phẩm</th>
                                                <th>Số lượng</th>
                                                <th>Xoá</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {chiTiet.length === 0 ? (
                                                <tr><td colSpan={3}>Chưa có sản phẩm nào</td></tr>
                                            ) : (
                                                chiTiet.map((sp, i) => (
                                                    <tr key={i} style={{
                                                        backgroundColor: isDuplicate(sp.idSanPham, i) ? '#fff3cd' : 'inherit'
                                                    }}>
                                                        <td>
                                                            <input
                                                                list="danhSachSP"
                                                                value={findTenSP(sp.idSanPham)}
                                                                onChange={(e) => handleChange(i, 'tenSanPham', e.target.value)}
                                                                placeholder="Nhập tên sản phẩm"
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                min={1}
                                                                value={sp.soLuong}
                                                                onChange={(e) => handleChange(i, 'soLuong', e.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <button type="button" onClick={() => handleXoa(i)}>🗑</button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                    <datalist id="danhSachSP">
                                        {sanPhamList.map(sp => (
                                            <option key={sp.idSanPham} value={sp.tenSanPham} />
                                        ))}
                                    </datalist>

                                    <div className="form-actions">
                                        <button type="button" className="add-button" onClick={handleThemDong}>+ Thêm sản phẩm</button>
                                    </div>
                                </div>

                                <div className="form-summary full-width">
                                    <p><strong>Tổng số lượng:</strong> {tongSoLuong}</p>
                                </div>

                                <div className="form-actions full-width">
                                    <button type="button" className="cancel-button" onClick={() => navigate(-1)}>Hủy</button>
                                    <button type="submit" className="submit-button">💾 Cập nhật</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormSuaYeuCauXuatKho;
