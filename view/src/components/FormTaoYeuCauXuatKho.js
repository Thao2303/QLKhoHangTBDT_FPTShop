// FormTaoYeuCauXuatKho.js - giao diện giống phiếu nhập
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './FormTaoPhieuNhap.css';
import { Link } from "react-router-dom";
import { FaHome, FaFileAlt, FaPlus } from "react-icons/fa";
const FormTaoYeuCauXuatKho = () => {
    const [danhMucList, setDanhMucList] = useState([]);
    const [donViTinhList, setDonViTinhList] = useState([]);
    const [danhMuc, setDanhMuc] = useState('');
    const [donViTinh, setDonViTinh] = useState('');
    const [sanPhamList, setSanPhamList] = useState([]);
    const [sanPham, setSanPham] = useState('');
    const [soLuong, setSoLuong] = useState('');
    const [danhSachThem, setDanhSachThem] = useState([]);
    const [ghiChu, setGhiChu] = useState('');
    const [diaChi, setDiaChi] = useState('');
    const [lyDoXuat, setLyDoXuat] = useState('');
    const [hinhThucXuat, setHinhThucXuat] = useState('');
    const [phuongThucVC, setPhuongThucVC] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get('https://localhost:5288/api/yeucauxuatkho/danhmuc').then(res => setDanhMucList(res.data));
        axios.get('https://localhost:5288/api/yeucauxuatkho/donvitinh').then(res => setDonViTinhList(res.data));
    }, []);

    useEffect(() => {
        if (danhMuc) {
            axios.get(`https://localhost:5288/api/yeucauxuatkho/sanpham/danhmuc/${danhMuc}`).then(res => setSanPhamList(res.data));
        } else {
            setSanPhamList([]);
        }
    }, [danhMuc]);

    const handleThem = () => {
        if (!sanPham || !soLuong) return;
        const sp = sanPhamList.find(p => p.idSanPham.toString() === sanPham);
        const newSP = {
            idSanPham: sp.idSanPham,
            tenSanPham: sp.tenSanPham,
            soLuong: parseInt(soLuong)
        };

        if (isEditing && editIndex !== null) {
            const updatedList = [...danhSachThem];
            updatedList[editIndex] = newSP;
            setDanhSachThem(updatedList);
            setIsEditing(false);
            setEditIndex(null);
        } else {
            if (danhSachThem.some(item => item.idSanPham === newSP.idSanPham)) {
                alert("Sản phẩm đã có trong danh sách!");
                return;
            }
            setDanhSachThem([...danhSachThem, newSP]);
        }

        setSanPham('');
        setSoLuong('');
    };

    const handleEdit = (index) => {
        const item = danhSachThem[index];
        setSanPham(item.idSanPham.toString());
        setSoLuong(item.soLuong.toString());
        setIsEditing(true);
        setEditIndex(index);
    };


    const generateMaPhieu = () => {
        const now = new Date();
        return 'MP' + now.getFullYear().toString().slice(2)
            + (now.getMonth() + 1).toString().padStart(2, '0')
            + now.getDate().toString().padStart(2, '0')
            + '-' + Math.floor(Math.random() * 1000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (danhSachThem.length === 0) return alert('Vui lòng thêm sản phẩm');
        const user = JSON.parse(localStorage.getItem("user"));
        const payload = {
            idDaiLy: user?.idDaiLy || 1,
            idTrangThaiXacNhan: 1,
            idDanhMuc: parseInt(danhMuc),
            idDonViTinh: parseInt(donViTinh),
            diaChi,
            lyDoXuat,
            hinhThucXuat,
            phuongThucVanChuyen: phuongThucVC,
            nguoiYeuCau: user?.tenNguoiDung || 'Ẩn danh',
            idNguoiTao: user?.idTaiKhoan, // ✅ BỔ SUNG DÒNG NÀY
            maPhieu: generateMaPhieu(),
            ghiChu,
            chiTietYeuCauXuatKhos: danhSachThem.map(sp => ({
                idSanPham: parseInt(sp.idSanPham),
                soLuong: parseInt(sp.soLuong)
            }))
        };


        try {
            await axios.post(
  `https://localhost:5288/api/yeucauxuatkho/tao?chucVu=${user.tenChucVu}`,
  payload
);

            alert('Gửi yêu cầu thành công');
            navigate('/quanlyyeucauxuat');
        } catch (err) {
            console.error(err);
            alert('Gửi thất bại');
        }
    };

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <Navbar />

                <div className="breadcrumb">
                    <Link to="/dashboard">
                        <FaHome className="breadcrumb-icon" /> Trang chủ
                    </Link>
                    <span>/</span>
                    <Link to="/quanlyphieuxuat">
                        <FaFileAlt className="breadcrumb-icon" /> Quản lý yêu cầu xuất kho
                    </Link>
                    <span>/</span>
                    <span>
                        <FaPlus className="breadcrumb-icon" /> Tạo yêu cầu xuất kho
                    </span>
                </div>
                <div className="form-container">
                    <h2>📦 Gửi Yêu Cầu Xuất Kho</h2>
                    <form onSubmit={handleSubmit} className="form-grid">
                        <div className="form-section">
                            <label>Danh mục</label>
                            <select value={danhMuc} onChange={(e) => setDanhMuc(e.target.value)}>
                                <option value="">-- Chọn danh mục --</option>
                                {danhMucList.map(dm => (
                                    <option key={dm.idDanhMuc} value={dm.idDanhMuc}>{dm.tenDanhMuc}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-section">
                            <label>Sản phẩm</label>
                            <select value={sanPham} onChange={(e) => setSanPham(e.target.value)}>
                                <option value="">-- Chọn sản phẩm --</option>
                                {sanPhamList.map(sp => (
                                    <option key={sp.idSanPham} value={sp.idSanPham}>{sp.tenSanPham}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-section">
                            <label>Số lượng</label>
                            <input type="number" min={1} value={soLuong} onChange={(e) => setSoLuong(e.target.value)} />
                        </div>
                        <div className="form-section">
                            <label>Đơn vị tính</label>
                            <select value={donViTinh} onChange={(e) => setDonViTinh(e.target.value)}>
                                <option value="">-- Chọn đơn vị --</option>
                                {donViTinhList.map(dvt => (
                                    <option key={dvt.idDonViTinh} value={dvt.idDonViTinh}>{dvt.tenDonViTinh}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-section">
                            <label>Địa chỉ giao</label>
                            <input value={diaChi} onChange={(e) => setDiaChi(e.target.value)} placeholder="Nhập địa chỉ nhận hàng" />
                        </div>

                        <div className="form-section">
                            <label>Lý do xuất kho</label>
                            <input value={lyDoXuat} onChange={(e) => setLyDoXuat(e.target.value)} placeholder="VD: Bán hàng, chuyển kho..." />
                        </div>

                        <div className="form-section">
                            <label>Hình thức xuất</label>
                            <input value={hinhThucXuat} onChange={(e) => setHinhThucXuat(e.target.value)} placeholder="VD: Xuất bán, điều chuyển..." />
                        </div>

                        <div className="form-section">
                            <label>Phương thức vận chuyển</label>
                            <input value={phuongThucVC} onChange={(e) => setPhuongThucVC(e.target.value)} placeholder="VD: GHTK, nội bộ..." />
                        </div>

                        <div className="form-section full-width">
                            <label>Ghi chú</label>
                            <textarea value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} />
                        </div>

                        

                        <div className="form-actions full-width">
                            <button type="button" className="add-button" onClick={handleThem}>
                                {isEditing ? "✔️ Cập nhật sản phẩm" : "+ Thêm sản phẩm"}
                            </button>

                        </div>
                     
                            <div className="added-products full-width">
                                <h3>Danh sách sản phẩm đã thêm:</h3>
                                <table>
                                    <thead>
                                        <tr><th>Tên sản phẩm</th><th>Số lượng</th><th>Xoá</th></tr>
                                    </thead>
                                    <tbody>
                                        {danhSachThem.map((sp, i) => (
                                            <tr key={i}>
                                                <td>{sp.tenSanPham}</td>
                                                <td>{sp.soLuong}</td>
                                                <td>
                                                    <button type="button" onClick={() => handleEdit(i)}>✏️</button>
                                                    <button type="button" onClick={() => setDanhSachThem(prev => prev.filter(item => item.idSanPham !== sp.idSanPham))}>🗑</button>
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                     

                      

                        <div className="form-actions full-width">
                            <button type="submit" className="submit-button">📨 Gửi yêu cầu</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormTaoYeuCauXuatKho;