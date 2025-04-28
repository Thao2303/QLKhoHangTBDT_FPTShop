import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './FormTaoPhieuNhap.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const FormTaoPhieuNhap = () => {
    const [product, setProduct] = useState('');
    const [supplier, setSupplier] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [note, setNote] = useState('');
    const [productsList, setProductsList] = useState([]);
    const [suppliersList, setSuppliersList] = useState([]);
    const [addedProducts, setAddedProducts] = useState([]);
    const [account, setAccount] = useState('');
    const [username, setUsername] = useState('');

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
    }, []);

    const handleAddProduct = () => {
        if (addedProducts.length > 0 && supplier !== addedProducts[0].supplier) {
            alert("Chỉ được chọn sản phẩm từ cùng một nhà cung cấp!");
            return;
        }

        if (addedProducts.some(p => p.product === product)) {
            alert("Sản phẩm này đã được thêm vào phiếu nhập!");
            return;
        }

        const totalPrice = unitPrice * quantity;
        const newProduct = {
            product,
            supplier,
            quantity,
            unitPrice,
            totalPrice,
            note
        };

        setAddedProducts([...addedProducts, newProduct]);
        setProduct('');
        setQuantity('');
        setUnitPrice('');
        setNote('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!supplier || addedProducts.length === 0) {
            alert("Vui lòng chọn nhà cung cấp và thêm ít nhất một sản phẩm!");
            return;
        }

        const phieuNhap = {
            idTaiKhoan: parseInt(account),
            idNhaCungCap: parseInt(supplier),
            ngayNhap: new Date().toISOString(),
            products: addedProducts.map(p => ({
                product: parseInt(p.product),
                quantity: parseInt(p.quantity),
                unitPrice: parseFloat(p.unitPrice),
                note: p.note
            }))
        };

        axios.post('https://localhost:5288/api/phieunhap', phieuNhap)
            .then(response => {
                const message = `✅ Phiếu nhập đã được tạo thành công!\n\n👤 Người tạo: ${username}\n🕒 Ngày tạo: ${new Date().toLocaleString()}`;
                alert(message);

                const sanPhams = addedProducts.map(p => {
                    const sp = productsList.find(s => s.idSanPham === parseInt(p.product));
                    return {
                        idSanPham: parseInt(p.product),
                        soLuong: parseInt(p.quantity),
                        chieuDai: sp?.chieuDai || 1,
                        chieuRong: sp?.chieuRong || 1,
                        chieuCao: sp?.chieuCao || 1
                    };
                });
                navigate('/goiyvitri', { state: { sanPhams } });

            })
            .catch(error => {
                console.error("Lỗi khi lưu phiếu nhập kho", error);
                alert("Lỗi khi lưu phiếu nhập kho");
            });
    };

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <div className="content-area2">
        <div className="main-layout">
                <Navbar />
                <div className="form-container">
                    <h2>Tạo Phiếu Nhập Kho</h2>

                    <form onSubmit={handleSubmit} className="form-grid">
                        <div className="form-section">
                            <label>Sản phẩm</label>
                            <select value={product} onChange={(e) => setProduct(e.target.value)}>
                                <option value="">Chọn sản phẩm</option>
                                {productsList.map((prod) => (
                                    <option key={prod.idSanPham} value={prod.idSanPham}>
                                        {prod.tenSanPham}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-section">
                            <label>Nhà cung cấp</label>
                            <select
                                value={supplier}
                                onChange={(e) => setSupplier(e.target.value)}
                                disabled={addedProducts.length > 0}
                            >
                                <option value="">Chọn nhà cung cấp</option>
                                {suppliersList.map((ncc) => (
                                    <option key={ncc.idNhaCungCap} value={ncc.idNhaCungCap}>
                                        {ncc.tenNhaCungCap}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-section">
                            <label>Số lượng SP</label>
                            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Nhập số lượng" />
                        </div>
                        <div className="form-section">
                            <label>Đơn giá</label>
                            <input type="number" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} placeholder="Nhập đơn giá" />
                        </div>
                        <div className="form-section full-width">
                            <label>Ghi chú</label>
                            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Nhập ghi chú" />
                        </div>
                        <div className="form-actions">
                            <button type="button" onClick={handleAddProduct} className="add-button">Thêm</button>
                        </div>

                        <div className="added-products full-width">
                            <h3>Sản phẩm đã thêm:</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Tên sản phẩm</th>
                                        <th>Số lượng</th>
                                        <th>Đơn giá</th>
                                        <th>Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {addedProducts.map((prod, index) => {
                                        const productInfo = productsList.find(p => p.idSanPham.toString() === prod.product);
                                        return (
                                            <tr key={index}>
                                                <td>{productInfo ? productInfo.tenSanPham : prod.product}</td>
                                                <td>{prod.quantity}</td>
                                                <td>{prod.unitPrice}</td>
                                                <td>{prod.totalPrice}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="form-actions full-width">
                            <button type="reset" className="cancel-button">Hủy</button>
                            <button type="submit" className="submit-button">Lưu</button>
                        </div>
                    </form>
                </div>
            </div>
                </div>
                </div>
            </div>
       
    );
};

export default FormTaoPhieuNhap;