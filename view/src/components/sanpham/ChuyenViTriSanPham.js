import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from '../common/Sidebar/Sidebar';
import Navbar from '../common/Navbar/Navbar';
import "../nhapkho/FormTaoPhieuNhap.css";
import { useNavigate, useLocation } from "react-router-dom";

const ChuyenViTriSanPham = () => {
    const [sanPhams, setSanPhams] = useState([]);
    const [idSanPham, setIdSanPham] = useState("");
    const [sanPhamChon, setSanPhamChon] = useState(null);
    const [viTriList, setViTriList] = useState([]);
    const [tatCaViTri, setTatCaViTri] = useState([]);
    const [selectedFrom, setSelectedFrom] = useState(null);
    const [selectedTo, setSelectedTo] = useState(null);
    const [soLuong, setSoLuong] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        if (location.state?.idSanPham) {
            setIdSanPham(location.state.idSanPham.toString());
        }
    }, [location.state]);

    useEffect(() => {
        axios.get("https://localhost:5288/api/sanpham")
            .then(res => setSanPhams(res.data))
            .catch(() => alert("❌ Lỗi tải sản phẩm"));

        axios.get("https://localhost:5288/api/vitri")
            .then(res => setTatCaViTri(res.data))
            .catch(() => alert("❌ Lỗi tải tất cả vị trí"));
    }, []);

    useEffect(() => {
        if (idSanPham) {
            const sp = sanPhams.find(s => s.idSanPham.toString() === idSanPham);
            setSanPhamChon(sp);

            axios.get(`https://localhost:5288/api/sanpham/${idSanPham}/vitri`)
                .then(res => setViTriList(res.data))
                .catch(() => alert("❌ Lỗi tải vị trí theo sản phẩm"));
        }
    }, [idSanPham, sanPhams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFrom || !selectedTo || !soLuong || !sanPhamChon) return alert("⚠️ Vui lòng điền đầy đủ thông tin");

        const soLuongChuyen = parseInt(soLuong);
        if (soLuongChuyen > selectedFrom.soLuong) {
            return alert(`⚠️ Số lượng chuyển vượt quá số lượng hiện có ở vị trí hiện tại.\nHiện có: ${selectedFrom.soLuong}, bạn đang cố chuyển: ${soLuongChuyen}`);
        }

        const theTichMotSP = (sanPhamChon.chieuDai || 0) * (sanPhamChon.chieuRong || 0) * (sanPhamChon.chieuCao || 0);
        const tongTheTich = theTichMotSP * soLuongChuyen;
        const sucConLai = selectedTo.sucChua - selectedTo.daDung;
        const soLuongCoTheChua = theTichMotSP > 0 ? Math.floor(sucConLai / theTichMotSP) : 0;

        if (tongTheTich > sucConLai) {
            return alert(`⚠️ Vị trí đích không đủ sức chứa.\nDung tích còn lại: ${sucConLai}\nDung tích cần: ${tongTheTich}\nTối đa chứa được khoảng ${soLuongCoTheChua} SP.`);
        }

        try {
            await axios.post("https://localhost:5288/api/chuyenvitri", {
                idSanPham: parseInt(idSanPham),
                idViTriCu: selectedFrom.idViTri,
                idViTriMoi: selectedTo.idViTri,
                soLuong: soLuongChuyen
            });
            alert("✅ Đã chuyển vị trí thành công");
            navigate("/quan-ly-vi-tri-san-pham");

            // ✅ Tải lại dữ liệu mới sau khi chuyển
            const [viTriSanPhamRes, tatCaViTriRes] = await Promise.all([
                axios.get(`https://localhost:5288/api/sanpham/${idSanPham}/vitri`),
                axios.get("https://localhost:5288/api/vitri")
            ]);

            setViTriList(viTriSanPhamRes.data);
            setTatCaViTri(tatCaViTriRes.data);

            const updatedTo = tatCaViTriRes.data.find(v => v.idViTri === selectedTo.idViTri);
            if (updatedTo) setSelectedTo(updatedTo);
        } catch (err) {
            alert("❌ Lỗi khi chuyển vị trí");
            console.error(err);
        }
    };

    const viTriTrong = tatCaViTri.filter(v => {
        const theTichMotSP = (sanPhamChon?.chieuDai || 0) * (sanPhamChon?.chieuRong || 0) * (sanPhamChon?.chieuCao || 0);
        const sucConLai = (v.sucChua || 0) - (v.daDung || 0);
        return theTichMotSP > 0 && sucConLai >= theTichMotSP;
    });

    const tinhSoLuongCoTheChua = (vt) => {
        if (!sanPhamChon) return 0;
        const theTichMotSP = (sanPhamChon.chieuDai || 0) * (sanPhamChon.chieuRong || 0) * (sanPhamChon.chieuCao || 0);
        const dungTichCon = vt.sucChua - vt.daDung;
        return theTichMotSP > 0 ? Math.floor(dungTichCon / theTichMotSP) : 0;
    };

    const buildTenViTri = (vt) => `Dãy ${vt.day} - Cột ${vt.cot} - Tầng ${vt.tang}`;

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <Navbar />
                <div className="form-container">
                    <h1 className="title">🔄 Chuyển vị trí sản phẩm</h1>
                    <form onSubmit={handleSubmit} className="form-grid">
                        <div className="form-section">
                            <label>Chọn sản phẩm</label>
                            <select value={idSanPham} onChange={(e) => setIdSanPham(e.target.value)}>
                                <option value="">-- Chọn --</option>
                                {sanPhams.map(sp => <option key={sp.idSanPham} value={sp.idSanPham}>{sp.tenSanPham}</option>)}
                            </select>
                        </div>

                        <div className="form-section">
                            <label>Vị trí hiện tại</label>
                            <select onChange={(e) => setSelectedFrom(JSON.parse(e.target.value))}>
                                <option value="">-- Chọn --</option>
                                {viTriList.map(vt => (
                                    <option key={vt.idViTri} value={JSON.stringify(vt)}>
                                        {vt.tenViTri} (SL: {vt.soLuong})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-section">
                            <label>Vị trí mới (còn chỗ)</label>
                            <select onChange={(e) => setSelectedTo(JSON.parse(e.target.value))} value={JSON.stringify(selectedTo)}>
                                <option value="">-- Chọn --</option>
                                {viTriTrong.map(vt => (
                                    <option key={vt.idViTri} value={JSON.stringify(vt)}>
                                        {buildTenViTri(vt)} (chứa được khoảng {tinhSoLuongCoTheChua(vt)} SP)
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-section">
                            <label>Số lượng chuyển</label>
                            <input type="number" value={soLuong} onChange={(e) => setSoLuong(e.target.value)} min="1" />
                        </div>

                        <div className="form-actions full-width">
                            <button type="submit" className="submit-button">✅ Chuyển vị trí</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChuyenViTriSanPham;
