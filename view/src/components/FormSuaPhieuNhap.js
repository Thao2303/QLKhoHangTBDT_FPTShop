import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './FormTaoPhieuNhap.css';

const FormSuaPhieuNhapFull = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [suppliersList, setSuppliersList] = useState([]);
    const [productsList, setProductsList] = useState([]);
    const [supplier, setSupplier] = useState('');
    const [supplierName, setSupplierName] = useState('');
    const [ngayNhap, setNgayNhap] = useState('');
    const [addedProducts, setAddedProducts] = useState([]);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) setUsername(user.tenTaiKhoan);

        axios.get('https://localhost:5288/api/nhacungcap')
            .then(res => setSuppliersList(res.data));

        axios.get('https://localhost:5288/api/sanpham')
            .then(res => setProductsList(res.data));

        axios.get(`https://localhost:5288/api/phieunhap/${id}`)
            .then(res => {
                setSupplier(res.data.idNhaCungCap);
                setNgayNhap(res.data.ngayNhap);
            });

        axios.get(`https://localhost:5288/api/phieunhap/chitiet/${id}`)
            .then(res => {
                const mapped = res.data.map(x => ({
                    idSanPham: x.idSanPham,
                    soLuong: x.soLuongThucNhap,
                    donGia: x.donGia,
                    ghiChu: x.nguoiGiaoHang || ''
                }));
                setAddedProducts(mapped);
            });
    }, [id]);

    const handleChange = (index, field, value) => {
        const updated = [...addedProducts];
        updated[index][field] = value;
        setAddedProducts(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            idPhieuNhap: parseInt(id),
            ngayNhap,
            chiTietPhieuNhaps: addedProducts.map(p => ({
                idSanPham: p.idSanPham,
                soLuong: parseInt(p.soLuong),
                donGia: parseFloat(p.donGia),
                ghiChu: p.ghiChu
            }))
        };

        try {
            const res = await axios.put(`https://localhost:5288/api/phieunhap/update-full/${id}`, payload);
            alert(res.data.message);

            // ✅ Chuyển đến trang sửa vị trí lưu trữ
            const sanPhams = addedProducts.map(p => {
                const sp = productsList.find(s => s.idSanPham === p.idSanPham);
                return {
                    idSanPham: p.idSanPham,
                    soLuong: parseInt(p.soLuong),
                    tenSanPham: sp?.tenSanPham || `SP${p.idSanPham}`,
                    chieuDai: sp?.chieuDai || 1,
                    chieuRong: sp?.chieuRong || 1,
                    chieuCao: sp?.chieuCao || 1
                };
            });

            navigate('/sua-vitri-luutru', {
                state: {
                    sanPhams: sanPhams.map(sp => ({ ...sp, idPhieuNhap: parseInt(id) }))
                }
            });

        } catch (err) {
            console.error("❌ Lỗi khi cập nhật phiếu nhập:", err);
            alert("❌ Cập nhật thất bại");
        }
    };

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area5">
                <Navbar />
                <div className="form-container">
                    <h2>Sửa Phiếu Nhập #{id}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-section">
                            <label>Nhà cung cấp</label>
                            <select value={supplier} disabled>
                                {suppliersList.map(sup => (
                                    <option key={sup.idNhaCungCap} value={sup.idNhaCungCap}>{sup.tenNhaCungCap}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-section">
                            <label>Ngày nhập</label>
                            <input type="datetime-local" value={ngayNhap.slice(0, 16)} onChange={(e) => setNgayNhap(e.target.value)} />
                        </div>

                        <h3>Chi tiết sản phẩm</h3>
                        <table className="added-products">
                            <thead>
                                <tr>
                                    <th>Sản phẩm</th>
                                    <th>SL</th>
                                    <th>Đơn giá</th>
                                    <th>Người giao</th>
                                </tr>
                            </thead>
                            <tbody>
                                {addedProducts.map((p, index) => (
                                    <tr key={index}>
                                        <td>{productsList.find(sp => sp.idSanPham === p.idSanPham)?.tenSanPham || p.idSanPham}</td>
                                        <td><input type="number" value={p.soLuong} onChange={(e) => handleChange(index, 'soLuong', e.target.value)} /></td>
                                        <td><input type="number" value={p.donGia} onChange={(e) => handleChange(index, 'donGia', e.target.value)} /></td>
                                        <td><input type="text" value={p.ghiChu} onChange={(e) => handleChange(index, 'ghiChu', e.target.value)} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="form-actions full-width">
                            <button type="submit" className="submit-button">💾 Cập nhật phiếu nhập</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormSuaPhieuNhapFull;
