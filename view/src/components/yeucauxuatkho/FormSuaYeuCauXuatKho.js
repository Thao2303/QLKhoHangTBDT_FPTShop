// ... phần import giữ nguyên
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Sidebar from '../common/Sidebar/Sidebar';
import Navbar from '../common/Navbar/Navbar';
import '../nhapkho/FormTaoPhieuNhap.css';
import { FaHome, FaFileAlt, FaEdit } from "react-icons/fa";

function FormSuaYeuCauXuatKho() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [yeuCau, setYeuCau] = useState(null);
    const [chiTiet, setChiTiet] = useState([]);
    const [ghiChu, setGhiChu] = useState("");
    const [danhMuc, setDanhMuc] = useState('');
    const [donViTinh, setDonViTinh] = useState('');
    const [diaChi, setDiaChi] = useState('');
    const [lyDoXuat, setLyDoXuat] = useState('');
    const [hinhThucXuat, setHinhThucXuat] = useState('');
    const [phuongThucVC, setPhuongThucVC] = useState('');
    const [danhMucList, setDanhMucList] = useState([]);
    const [donViTinhList, setDonViTinhList] = useState([]);
    const [sanPhamList, setSanPhamList] = useState([]);
    const [sanPham, setSanPham] = useState('');
    const [soLuong, setSoLuong] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        axios.get(`https://localhost:5288/api/yeucauxuatkho/${id}`).then((res) => {
            setYeuCau(res.data);
            setChiTiet(res.data.chiTietYeuCauXuatKhos);
            setGhiChu(res.data.ghiChu || "");
            setDanhMuc(res.data.idDanhMuc?.toString() || '');
            setDonViTinh(res.data.idDonViTinh?.toString() || '');
            setDiaChi(res.data.diaChi || '');
            setLyDoXuat(res.data.lyDoXuat || '');
            setHinhThucXuat(res.data.hinhThucXuat || '');
            setPhuongThucVC(res.data.phuongThucVanChuyen || '');
        });

        axios.get('https://localhost:5288/api/yeucauxuatkho/danhmuc').then(res => setDanhMucList(res.data));
        axios.get('https://localhost:5288/api/yeucauxuatkho/donvitinh').then(res => setDonViTinhList(res.data));
    }, [id]);

    useEffect(() => {
        if (danhMuc) {
            axios.get(`https://localhost:5288/api/yeucauxuatkho/sanpham/danhmuc/${danhMuc}`).then(res => setSanPhamList(res.data));
        } else {
            setSanPhamList([]);
        }
    }, [danhMuc]);

    const handleUpdate = () => {
        const payload = {
            ...yeuCau,
            idDanhMuc: parseInt(danhMuc),
            idDonViTinh: parseInt(donViTinh),
            diaChi,
            lyDoXuat,
            hinhThucXuat,
            phuongThucVanChuyen: phuongThucVC,
            ghiChu,
            chiTietYeuCauXuatKhos: chiTiet.map((ct) => ({
                idSanPham: parseInt(ct.idSanPham),
                soLuong: parseInt(ct.soLuong),
                tenSanPham: ct.tenSanPham // 👈 thêm nếu cần (nếu model yêu cầu)
            }))

        };

        axios.put(`https://localhost:5288/api/yeucauxuatkho/${id}`, payload)
            .then(() => {
                alert("✔️ Đã cập nhật yêu cầu xuất kho!");
                navigate("/quanlyyeucauxuat");
            })
            .catch(err => {
                console.error("❌ Lỗi khi cập nhật:", err.response?.data || err.message);
                alert("❌ Cập nhật thất bại!");
            });

    };

    const handleEdit = (index) => {
        const sp = chiTiet[index];
        setSanPham(sp.idSanPham.toString());
        setSoLuong(sp.soLuong);
        setIsEditing(true);
        setEditIndex(index);
    };

    const handleAddOrUpdate = () => {
        if (!sanPham || !soLuong) return;
        const sp = sanPhamList.find(p => p.idSanPham.toString() === sanPham);
        if (!sp) return;

        const newSP = {
            idSanPham: sp.idSanPham,
            tenSanPham: sp.tenSanPham,
            soLuong: parseInt(soLuong)
        };

        const newList = [...chiTiet];
        if (isEditing && editIndex !== null) {
            newList[editIndex] = newSP;
        } else {
            newList.push(newSP);
        }
        setChiTiet(newList);
        setSanPham('');
        setSoLuong('');
        setIsEditing(false);
        setEditIndex(null);
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
                    <Link to="/quanlyyeucauxuat">
                        <FaFileAlt className="breadcrumb-icon" /> Quản lý yêu cầu xuất kho
                    </Link>
                    <span>/</span>
                    <span>
                        <FaEdit className="breadcrumb-icon" /> Sửa yêu cầu xuất kho
                    </span>
                </div>

                <div className="form-container">
                    <h1 className="title">✏️ Sửa Yêu Cầu Xuất Kho #{id}</h1>
                  
                    <div className="form-grid">
                        <div className="form-section">
                            <label>Danh mục</label>
                            <select value={danhMuc} onChange={(e) => setDanhMuc(e.target.value)}>
                                <option value="">-- Chọn danh mục --</option>
                                {danhMucList.map((dm) => (
                                    <option key={dm.idDanhMuc} value={dm.idDanhMuc}>{dm.tenDanhMuc}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-row">
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
                                <input
                                    type="number"
                                    min={1}
                                    value={soLuong}
                                    onChange={(e) => setSoLuong(e.target.value)}
                                    className="input-padding-right"
                                />
                            </div>
                            <div className="form-section">
                                <label>Đơn vị tính</label>
                                <select value={donViTinh} onChange={(e) => setDonViTinh(e.target.value)}>
                                    <option value="">-- Chọn đơn vị --</option>
                                    {donViTinhList.map((dvt) => (
                                        <option key={dvt.idDonViTinh} value={dvt.idDonViTinh}>{dvt.tenDonViTinh}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-section">
                                <label>&nbsp;</label>
                                <button type="button" className="add-button full-width" onClick={handleAddOrUpdate}>
                                    {isEditing ? '✔️ Cập nhật' : '+ Thêm sản phẩm'}
                                </button>
                            </div>
                        </div>

                   
                        
                        <div className="form-section">
                            <label>Địa chỉ giao</label>
                            <input value={diaChi} onChange={(e) => setDiaChi(e.target.value)} />
                        </div>

                        <div className="form-section">
                            <label>Lý do xuất kho</label>
                            <input value={lyDoXuat} onChange={(e) => setLyDoXuat(e.target.value)} />
                        </div>

                        <div className="form-section">
                            <label>Hình thức xuất</label>
                            <input value={hinhThucXuat} onChange={(e) => setHinhThucXuat(e.target.value)} />
                        </div>

                        <div className="form-section">
                            <label>Phương thức vận chuyển</label>
                            <input value={phuongThucVC} onChange={(e) => setPhuongThucVC(e.target.value)} />
                        </div>

                        <div className="form-section full-width">
                            <label>Ghi chú</label>
                            <textarea value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} />
                        </div>

                        {chiTiet.length > 0 && (
                            <div className="added-products full-width">
                                <h3>Danh sách sản phẩm:</h3>
                                <table>
                                    <thead>
                                        <tr><th>Tên sản phẩm</th><th>Số lượng</th><th>Sửa</th><th>Xoá</th></tr>
                                    </thead>
                                    <tbody>
                                        {chiTiet.map((sp, i) => (
                                            <tr key={i}>
                                                <td>{sp.tenSanPham || sp.idSanPham}</td>
                                                <td>{sp.soLuong}</td>
                                                <td>
                                                    <button type="button" onClick={() => handleEdit(i)}>✏️</button>
                                                </td>
                                                <td>
                                                    <button type="button" onClick={() => setChiTiet(prev => prev.filter((_, index) => index !== i))}>🗑</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="form-actions full-width">
                            <button type="button" onClick={() => navigate('/quanlyyeucauxuat')}>Huỷ</button>
                            <button type="button" onClick={handleUpdate}>💾 Cập nhật</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FormSuaYeuCauXuatKho;
