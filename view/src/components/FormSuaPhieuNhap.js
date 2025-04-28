import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./FormTaoPhieuNhap.css";

const FormSuaPhieuNhap = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [ngayNhap, setNgayNhap] = useState("");
    const [ghiChu, setGhiChu] = useState("");
    const [sanPhamList, setSanPhamList] = useState([]);
    const [selectedSanPham, setSelectedSanPham] = useState("");
    const [soLuong, setSoLuong] = useState("");
    const [donGia, setDonGia] = useState("");
    const [ghiChuCT, setGhiChuCT] = useState("");
    const [chiTietList, setChiTietList] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);

    useEffect(() => {
        Promise.all([
            axios.get(`https://localhost:5288/api/phieunhap/${id}`),
            axios.get("https://localhost:5288/api/sanpham")
        ]).then(([phieuRes, spRes]) => {
            const phieu = phieuRes.data;
            const dsSanPham = spRes.data;

            setSanPhamList(dsSanPham);
            setNgayNhap(phieu.ngayNhap?.slice(0, 10));
            setGhiChu(phieu.ghiChu);

            const enrichedChiTiet = (phieu.chiTietPhieuNhaps || []).map(item => ({
                ...item,
                sanPham: dsSanPham.find(sp => sp.id === item.idSanPham),
                thanhTien: item.soLuong * item.donGia
            }));

            setChiTietList(enrichedChiTiet);
        });
    }, [id]);

    const handleThemHoacCapNhat = () => {
        if (!selectedSanPham || !soLuong || !donGia) {
            alert("Vui lòng điền đầy đủ thông tin sản phẩm.");
            return;
        }

        const sanPham = sanPhamList.find(sp => sp.id === Number(selectedSanPham));
        const newItem = {
            sanPham,
            idSanPham: Number(selectedSanPham),
            soLuong: Number(soLuong),
            donGia: Number(donGia),
            ghiChu: ghiChuCT,
            thanhTien: Number(soLuong) * Number(donGia),
        };

        const isDuplicate = chiTietList.some((ct, i) => ct.idSanPham === newItem.idSanPham && i !== editingIndex);
        if (isDuplicate) {
            alert("Sản phẩm đã tồn tại trong phiếu.");
            return;
        }

        if (editingIndex !== null) {
            const updated = [...chiTietList];
            updated[editingIndex] = newItem;
            setChiTietList(updated);
            setEditingIndex(null);
        } else {
            setChiTietList([...chiTietList, newItem]);
        }

        setSelectedSanPham("");
        setSoLuong("");
        setDonGia("");
        setGhiChuCT("");
    };

    const handleChonDong = (index) => {
        const item = chiTietList[index];
        setSelectedSanPham(item.idSanPham);
        setSoLuong(item.soLuong);
        setDonGia(item.donGia);
        setGhiChuCT(item.ghiChu);
        setEditingIndex(index);
    };

    const handleXoaDong = (index) => {
        const updated = chiTietList.filter((_, i) => i !== index);
        setChiTietList(updated);
        if (editingIndex === index) setEditingIndex(null);
    };

    const handleLuuPhieu = () => {
        if (!ngayNhap) {
            alert("Vui lòng chọn ngày nhập.");
            return;
        }
        if (chiTietList.length === 0) {
            alert("Phiếu nhập phải có ít nhất một sản phẩm.");
            return;
        }

        const payload = {
            id: Number(id),
            ngayNhap,
            ghiChu,
            chiTietPhieuNhaps: chiTietList.map(ct => ({
                idSanPham: ct.idSanPham,
                soLuong: ct.soLuong,
                donGia: ct.donGia,
                ghiChu: ct.ghiChu
            }))
        };

        axios.put(`https://localhost:5288/api/phieunhap/${id}`, payload)
            .then(() => navigate("/quanlyphieunhap"));
    };

    return (
        <div className="form-phieu">
            <h2 className="title">SỬA PHIẾU NHẬP #{id}</h2>

            <div className="form-group">
                <label>Ngày nhập:</label>
                <input type="date" value={ngayNhap} onChange={(e) => setNgayNhap(e.target.value)} />
            </div>

            <div className="form-group">
                <label>Ghi chú:</label>
                <textarea value={ghiChu} onChange={(e) => setGhiChu(e.target.value)}></textarea>
            </div>

            <div className="form-section">
                <select value={selectedSanPham} onChange={(e) => setSelectedSanPham(e.target.value)}>
                    <option value="">-- Chọn sản phẩm --</option>
                    {sanPhamList.map(sp => (
                        <option key={sp.id} value={sp.id}>{sp.tenSanPham}</option>
                    ))}
                </select>
                <input type="number" placeholder="Số lượng" value={soLuong} onChange={(e) => setSoLuong(e.target.value)} />
                <input type="number" placeholder="Đơn giá" value={donGia} onChange={(e) => setDonGia(e.target.value)} />
                <input type="text" placeholder="Ghi chú" value={ghiChuCT} onChange={(e) => setGhiChuCT(e.target.value)} />
                <button onClick={handleThemHoacCapNhat}>{editingIndex !== null ? "Cập nhật" : "Thêm"}</button>
            </div>

            <table className="product-table">
                <thead>
                    <tr>
                        <th>Sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Đơn giá</th>
                        <th>Thành tiền</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {chiTietList.map((ct, index) => (
                        <tr key={`${ct.idSanPham}-${index}`}>
                            <td onClick={() => handleChonDong(index)}>{ct.sanPham?.tenSanPham || ct.idSanPham}</td>
                            <td>{ct.soLuong}</td>
                            <td>{ct.donGia}</td>
                            <td>{ct.thanhTien}</td>
                            <td><button onClick={() => handleXoaDong(index)}>Xoá</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="actions">
                <button onClick={() => navigate("/quanlyphieunhap")} className="btn-cancel">Huỷ</button>
                <button onClick={handleLuuPhieu} className="btn-save">Lưu phiếu</button>
            </div>
        </div>
    );
};

export default FormSuaPhieuNhap;
