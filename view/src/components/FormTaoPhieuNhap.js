import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './FormTaoPhieuNhap.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const FormTaoPhieuNhap = () => {
    const [category, setCategory] = useState('');
    const [product, setProduct] = useState('');
    const [supplier, setSupplier] = useState('');
    const [supplierName, setSupplierName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [realQuantity, setRealQuantity] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [note, setNote] = useState('');
    const [soLo, setSoLo] = useState('');
    const [nguoiGiaoHang, setNguoiGiaoHang] = useState('');
    const [productsList, setProductsList] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categoriesList, setCategoriesList] = useState([]);
    const [suppliersList, setSuppliersList] = useState([]);
    const [addedProducts, setAddedProducts] = useState([]);
    const [account, setAccount] = useState('');
    const [username, setUsername] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [showPopupSanPham, setShowPopupSanPham] = useState(false);
    const [showPopupDanhMuc, setShowPopupDanhMuc] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setAccount(user.idTaiKhoan);
            setUsername(user.tenTaiKhoan);
        }

        axios.get('https://localhost:5288/api/nhacungcap')
            .then(response => setSuppliersList(response.data))
            .catch(error => console.error("Lỗi khi lấy danh sách nhà cung cấp", error));

        axios.get('https://localhost:5288/api/sanpham')
            .then(response => setProductsList(response.data))
            .catch(error => console.error("Lỗi khi lấy danh sách sản phẩm", error));

        axios.get('https://localhost:5288/api/danhmuc')
            .then(response => setCategoriesList(response.data))
            .catch(error => console.error("Lỗi khi lấy danh mục", error));
    }, []);

    useEffect(() => {
        if (category) {
            setFilteredProducts(productsList.filter(p => p.idDanhMuc === parseInt(category)));
        } else {
            setFilteredProducts([]);
        }
    }, [category, productsList]);

    const generateSoLo = (supplierId) => {
        const today = new Date();
        const yyyyMMdd = today.toISOString().slice(0, 10).replace(/-/g, '');
        const maNcc = `NCC${supplierId.toString().padStart(2, '0')}`;
        const soThuTu = "01";
        return `LO-${maNcc}-${yyyyMMdd}-${soThuTu}`;
    };

    const handleSupplierChange = (value) => {
        setSupplierName(value);
        const found = suppliersList.find(s => s.tenNhaCungCap === value);
        if (found) {
            setSupplier(found.idNhaCungCap);
            const soLoMoi = generateSoLo(found.idNhaCungCap);
            setSoLo(soLoMoi);
        } else {
            setSupplier('');
            setSoLo('');
        }
    };

    const handleSaveProduct = () => {
        if (!product || !quantity || !realQuantity || !unitPrice || !nguoiGiaoHang) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const selectedProduct = filteredProducts.find(p => p.tenSanPham === product);
        if (!selectedProduct) {
            alert("Tên sản phẩm không hợp lệ!");
            return;
        }

        const totalPrice = unitPrice * realQuantity;
        const newProduct = {
            product: selectedProduct.idSanPham,
            supplier,
            quantity,
            realQuantity,
            unitPrice,
            totalPrice,
            note,
            nguoiGiaoHang
        };

        if (isEditing && typeof editIndex === 'number') {
            const updated = [...addedProducts];
            updated[editIndex] = newProduct;
            setAddedProducts(updated);
            setIsEditing(false);
            setEditIndex(null);
        } else {
            if (addedProducts.some(p => parseInt(p.product) === newProduct.product)) {
                alert("Sản phẩm đã tồn tại trong danh sách!");
                return;
            }
            setAddedProducts([...addedProducts, newProduct]);
        }

        setProduct('');
        setQuantity('');
        setRealQuantity('');
        setUnitPrice('');
    };

    const handleEdit = (index) => {
        const sp = addedProducts[index];
        const tenSP = productsList.find(p => p.idSanPham === parseInt(sp.product))?.tenSanPham || sp.product;
        setProduct(tenSP);
        setQuantity(sp.quantity);
        setRealQuantity(sp.realQuantity);
        setUnitPrice(sp.unitPrice);
        setIsEditing(true);
        setEditIndex(index);
    };

    const handleDelete = (index) => {
        const updated = [...addedProducts];
        updated.splice(index, 1);
        setAddedProducts(updated);
        if (editIndex === index) {
            setIsEditing(false);
            setEditIndex(null);
            setProduct('');
            setQuantity('');
            setRealQuantity('');
            setUnitPrice('');
        }
    };

    const getTongTien = () => {
        return addedProducts.reduce((sum, p) => sum + Number(p.totalPrice), 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!supplier || addedProducts.length === 0) {
            alert("Chọn nhà cung cấp và thêm sản phẩm!");
            return;
        }

        const phieuNhap = {
            idTaiKhoan: parseInt(account),
            idNhaCungCap: parseInt(supplier),
            ngayNhap: new Date().toISOString(),
            products: addedProducts.map(p => ({
                product: parseInt(p.product),
                quantity: parseInt(p.quantity),
                realQuantity: parseInt(p.realQuantity),
                unitPrice: parseFloat(p.unitPrice),
                note: p.note,
                nguoiGiaoHang: p.nguoiGiaoHang
            }))
        };

        axios.post('https://localhost:5288/api/phieunhap', phieuNhap)
            .then(res => {
                alert(`✅ Đã tạo phiếu nhập\n👤 Người tạo: ${username}\n📦 Số lô: ${soLo}`);
                const sanPhams = addedProducts.map(p => {
                    const sp = productsList.find(s => s.idSanPham === parseInt(p.product));
                    return {
                        idSanPham: parseInt(p.product),
                        soLuong: parseInt(p.realQuantity),
                        chieuDai: sp?.chieuDai || 1,
                        chieuRong: sp?.chieuRong || 1,
                        chieuCao: sp?.chieuCao || 1
                    };
                });
                navigate('/goiyvitri', { state: { sanPhams } });
            })
            .catch(err => {
                console.error("Lỗi khi lưu phiếu nhập", err);
                alert("❌ Lỗi khi lưu phiếu nhập");
            });
    };

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area5">
                <Navbar />
                <div className="form-container">
                    <h2>Tạo Phiếu Nhập Kho</h2>
                    <form onSubmit={handleSubmit} className="form-grid">
                        <div className="form-section">
                            <label>Danh mục</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="">Chọn danh mục</option>
                                {categoriesList.map(cat => (
                                    <option key={cat.idDanhMuc} value={cat.idDanhMuc}>
                                        {cat.tenDanhMuc}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-section">
                            <label>Sản phẩm</label>
                            <input
                                list="sanpham-list"
                                value={product}
                                onChange={(e) => {
                                    if (!category) {
                                        alert("Vui lòng chọn Danh mục trước!");
                                        return;
                                    }
                                    setProduct(e.target.value);
                                }}
                                placeholder="Nhập hoặc chọn tên sản phẩm theo Danh mục"
                            />

                            <datalist id="sanpham-list">
                                {filteredProducts.map(prod => (
                                    <option key={prod.idSanPham} value={prod.tenSanPham} />
                                ))}
                            </datalist>
                        </div>

                        <div className="form-section">
                            <label>Nhà cung cấp</label>
                            <input
                                list="nhacungcap-list"
                                value={supplierName}
                                onChange={(e) => handleSupplierChange(e.target.value)}
                                placeholder="Nhập hoặc chọn nhà cung cấp"
                                disabled={addedProducts.length > 0}
                            />
                            <datalist id="nhacungcap-list">
                                {suppliersList.map(sup => (
                                    <option key={sup.idNhaCungCap} value={sup.tenNhaCungCap} />
                                ))}
                            </datalist>
                        </div>

                        <div className="form-section">
                            <label>Số lô</label>
                            <input type="text" value={soLo} disabled />
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

                        <div className="form-section">
                            <label>Người giao</label>
                            <input type="text" value={nguoiGiaoHang} onChange={(e) => setNguoiGiaoHang(e.target.value)} disabled={addedProducts.length > 0} />
                        </div>

                        <div className="form-section full-width">
                            <label>Ghi chú</label>
                            <textarea value={note} onChange={(e) => setNote(e.target.value)} disabled={addedProducts.length > 0} />
                        </div>

                        <div className="form-actions">
                            <button type="button" onClick={handleSaveProduct} className={isEditing ? "edit-button" : "add-button"}>
                                {isEditing ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
                            </button>
                        </div>

                        <div className="added-products full-width">
                            <h3>Danh sách sản phẩm đã thêm:</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>SL chứng từ</th>
                                        <th>SL thực nhập</th>
                                        <th>Đơn giá</th>
                                        <th>Người giao</th>
                                        <th>Thành tiền</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {addedProducts.map((prod, idx) => (
                                        <tr key={idx}>
                                            <td>{productsList.find(p => p.idSanPham === parseInt(prod.product))?.tenSanPham || prod.product}</td>
                                            <td>{prod.quantity}</td>
                                            <td>{prod.realQuantity}</td>
                                            <td>{prod.unitPrice}</td>
                                            <td>{prod.nguoiGiaoHang}</td>
                                            <td>{prod.totalPrice}</td>
                                            <td>
                                                <button type="button" onClick={() => handleEdit(idx)}>✏️</button>
                                                <button type="button" onClick={() => handleDelete(idx)}>🗑</button>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'right', fontWeight: 'bold' }}>Tổng tiền:</td>
                                        <td>{getTongTien()}</td>
                                        <td></td>
                                    </tr>
                                </tfoot>

                            </table>
                        </div>

                        <div className="form-actions full-width">
                            <button type="reset" className="cancel-button">Hủy</button>
                            <button type="submit" className="submit-button">Lưu phiếu nhập</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormTaoPhieuNhap;
