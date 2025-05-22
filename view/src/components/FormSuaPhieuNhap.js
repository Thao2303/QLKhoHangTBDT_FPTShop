import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './FormTaoPhieuNhap.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { FaHome, FaFileAlt, FaEdit } from "react-icons/fa";

const FormSuaPhieuNhap = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState('');
    const [categoriesList, setCategoriesList] = useState([]);
    const [product, setProduct] = useState('');
    const [supplier, setSupplier] = useState('');
    const [supplierName, setSupplierName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [realQuantity, setRealQuantity] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [note, setNote] = useState('');
    const [nguoiGiaoHang, setNguoiGiaoHang] = useState('');
    const [productsList, setProductsList] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [addedProducts, setAddedProducts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [suppliersList, setSuppliersList] = useState([]);
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setUsername(user.tenTaiKhoan);
            setUserId(user.idTaiKhoan);
        }

        axios.get('https://localhost:5288/api/nhacungcap')
            .then(res => setSuppliersList(res.data));

        axios.get('https://localhost:5288/api/sanpham')
            .then(res => {
                setProductsList(res.data);
                setFilteredProducts(res.data);
            });

        axios.get('https://localhost:5288/api/danhmuc')
            .then(res => setCategoriesList(res.data));

        axios.get(`https://localhost:5288/api/phieunhap/${id}`)
            .then(res => {
                const phieu = res.data;
                setSupplier(phieu.idNhaCungCap);
                setSupplierName(phieu.nhaCungCap?.tenNhaCungCap || '');
            });

        axios.get(`https://localhost:5288/api/phieunhap/chitiet/${id}`)
            .then(res => {
                const details = res.data.map(item => ({
                    idSanPham: item.idSanPham,
                    soLuongTheoChungTu: item.soLuongTheoChungTu,
                    soLuongThucNhap: item.soLuongThucNhap,
                    donGia: item.donGia,
                    ghiChu: item.ghiChu || '',
                    nguoiGiao: item.nguoiGiao || '',
                    idDanhMuc: item.sanPham?.DanhMuc?.idDanhMuc || ''
                }));
                setAddedProducts(details);
            });
    }, [id]);

    useEffect(() => {
        if (!category) {
            setFilteredProducts(productsList);
        } else {
            const filtered = productsList.filter(p => p.idDanhMuc?.toString() === category);
            setFilteredProducts(filtered);
        }
    }, [category, productsList]);

    const handleAddProduct = () => {
        if (!product || !quantity || !unitPrice) return;

        const newProduct = {
            idSanPham: product,
            soLuongTheoChungTu: Number(quantity),
            soLuongThucNhap: Number(realQuantity),
            donGia: Number(unitPrice),
            ghiChu: note,
            nguoiGiao: nguoiGiaoHang
        };

        if (isEditing) {
            const updated = [...addedProducts];
            updated[editIndex] = newProduct;
            setAddedProducts(updated);
            setIsEditing(false);
            setEditIndex(null);
        } else {
            const existing = addedProducts.find(p => p.idSanPham === product);
            if (existing) {
                alert("Sản phẩm đã tồn tại trong danh sách.");
                return;
            }
            setAddedProducts([...addedProducts, newProduct]);
        }

        setProduct('');
        setQuantity('');
        setRealQuantity('');
        setUnitPrice('');
    };

    const handleEditProduct = (index) => {
        const p = addedProducts[index];
        setProduct(p.idSanPham);
        setQuantity(p.soLuongTheoChungTu);
        setRealQuantity(p.soLuongThucNhap);
        setUnitPrice(p.donGia);
        const matched = productsList.find(sp => sp.idSanPham === p.idSanPham);
        setCategory(matched?.idDanhMuc?.toString() || '');
        setNguoiGiaoHang(p.nguoiGiao || '');
        setNote(p.ghiChu || '');

        setIsEditing(true);
        setEditIndex(index);
    };

    const handleRemoveProduct = (idSanPham) => {
        setAddedProducts(addedProducts.filter(p => p.idSanPham !== idSanPham));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`https://localhost:5288/api/phieunhap/update-full/${id}`, {
                idPhieuNhap: id,
                ngayNhap: new Date().toISOString(),
                chiTietPhieuNhaps: addedProducts.map(p => ({
                    idSanPham: p.idSanPham,
                    soLuong: p.soLuongThucNhap || p.soLuongTheoChungTu,
                    donGia: p.donGia,
                    ghiChu: p.ghiChu || '',
                    nguoiGiaoHang: p.nguoiGiao || ''
                }))

            });
            alert('✔️ Đã cập nhật phiếu nhập!');
            navigate('/goiyvitri', {
                state: {
                    idPhieuNhap: id,
                    sanPhams: addedProducts.map(p => {
                        const sp = productsList.find(s => s.idSanPham === p.idSanPham);
                        return {
                            idSanPham: p.idSanPham,
                            soLuong: p.soLuongThucNhap || p.soLuongTheoChungTu,
                            chieuDai: sp?.chieuDai || 1,
                            chieuRong: sp?.chieuRong || 1,
                            chieuCao: sp?.chieuCao || 1
                        };
                    })
                }
            });

        } catch (error) {
            console.error(error);
            alert('❌ Lỗi khi cập nhật!');
        }
    };

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <Navbar />
                <div className="breadcrumb">
                    <Link to="/dashboard"><FaHome className="breadcrumb-icon" /> Trang chủ</Link>
                    <span>/</span>
                    <Link to="/quanlyphieunhap"><FaFileAlt className="breadcrumb-icon" /> Quản lý phiếu nhập</Link>
                    <span>/</span>
                    <span><FaEdit className="breadcrumb-icon" /> Sửa phiếu nhập</span>
                </div>

                <div className="form-container">
                    <h1 className="title">📦 Sửa Phiếu Nhập #{id}</h1>
               
                    <form onSubmit={handleSubmit} className="form-grid">
                        <div className="form-section">
                            <label>Nhà cung cấp</label>
                            <select value={supplier} onChange={(e) => setSupplier(e.target.value)} disabled={addedProducts.length > 0}>
                                <option value="">-- Chọn --</option>
                                {suppliersList.map(sup => (
                                    <option key={sup.idNhaCungCap} value={sup.idNhaCungCap}>
                                        {sup.tenNhaCungCap}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-section">
                            <label>Người giao hàng</label>
                            <input type="text" value={nguoiGiaoHang} onChange={(e) => setNguoiGiaoHang(e.target.value)} />
                        </div>

                        <div className="form-section full-width">
                            <label>Ghi chú</label>
                            <textarea value={note} onChange={(e) => setNote(e.target.value)} />
                        </div>

                        <div className="form-section">
                            <label>Danh mục</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="">-- Chọn danh mục --</option>
                                {categoriesList.map(cat => (
                                    <option key={cat.idDanhMuc} value={cat.idDanhMuc}>{cat.tenDanhMuc}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-section">
                            <label>Sản phẩm</label>
                            <select value={product} onChange={(e) => setProduct(e.target.value)}>
                                <option value="">-- Chọn --</option>
                                {filteredProducts.map(sp => (
                                    <option key={sp.idSanPham} value={sp.idSanPham}>{sp.tenSanPham}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-section">
                            <label>SL chứng từ</label>
                            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                        </div>

                        <div className="form-section">
                            <label>SL thực nhập</label>
                            <input type="number" value={realQuantity} onChange={(e) => setRealQuantity(e.target.value)} />
                        </div>

                        <div className="form-section">
                            <label>Đơn giá</label>
                            <input type="number" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} />
                        </div>

                        <div className="form-section full-width">
                            <button type="button" className="add-button" onClick={handleAddProduct}>{isEditing ? "💾 Lưu thay đổi" : "➕ Thêm sản phẩm"}</button>
                        </div>

                        <div className="added-products full-width">
                            <h3>Danh sách sản phẩm</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Tên SP</th>
                                        <th>SL CT</th>
                                        <th>SL thực</th>
                                        <th>Đơn giá</th>
                                        <th>Xoá</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {addedProducts.map((p, index) => {
                                        const sp = productsList.find(sp => sp.idSanPham === p.idSanPham);
                                        return (
                                            <tr key={index} style={{ backgroundColor: index === editIndex ? '#e6f7ff' : 'transparent' }}>
                                                <td>{sp?.tenSanPham || p.idSanPham}</td>
                                                <td>{p.soLuongTheoChungTu}</td>
                                                <td>{p.soLuongThucNhap}</td>
                                                <td>{p.donGia}</td>
                                                <td>
                                                    <button type="button" onClick={() => handleEditProduct(index)}>📝</button>
                                                    <button type="button" onClick={() => {
                                                        if (window.confirm('Bạn có chắc muốn xoá sản phẩm này?')) handleRemoveProduct(p.idSanPham);
                                                    }}>🗑</button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="form-actions full-width">
                            <button type="button" className="cancel-button" onClick={() => navigate('/quanlyphieunhap')}>Huỷ</button>
                            <button type="submit" className="submit-button">💾 Cập nhật</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormSuaPhieuNhap;
