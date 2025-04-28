import React, { useEffect, useState } from "react";
import "./FormKiemKe.css";

const API_BASE_URL = "https://localhost:5288/api";

const FormKiemKe = () => {
    const [danhSachSanPham, setDanhSachSanPham] = useState([]);
    const [soLuongThucTe, setSoLuongThucTe] = useState({});
    const [ghiChu, setGhiChu] = useState("");
    const [ngayKiemKe, setNgayKiemKe] = useState(new Date().toISOString().substring(0, 10));

    useEffect(() => {
        fetch(`${API_BASE_URL}/kiemke/tonghop`)
            .then((res) => res.json())
            .then((data) => setDanhSachSanPham(data))
            .catch((err) => console.error("Lỗi khi tải danh sách kiểm kê:", err));
    }, []);

    const handleChange = (idSanPham, value) => {
        setSoLuongThucTe((prev) => ({ ...prev, [idSanPham]: Number(value) }));
    };

    const handleSubmit = async () => {
        const chiTiet = danhSachSanPham.map((sp) => ({
            idSanPham: sp.idSanPham,
            soLuongThucTe: soLuongThucTe[sp.idSanPham] || 0,
            phamChat: "", // bạn có thể thêm input nhập phẩm chất nếu cần
        }));

        const payload = {
            idNhanVien: JSON.parse(localStorage.getItem("user"))?.idTaiKhoan,
            ngayKiemKe,
            ghiChu,
            chiTietKiemKe: chiTiet,
        };

        try {
            const res = await fetch(`${API_BASE_URL}/kiemke`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) alert("✅ Đã lưu phiếu kiểm kê thành công!");
            else alert("❌ Lưu thất bại!");
        } catch (err) {
            alert("❌ Lỗi khi gửi dữ liệu kiểm kê!");
        }
    };

    return (
        <div className="kiemke-wrapper">
            <h2>📦 Kiểm kê hàng hóa</h2>

            <div className="ngaykiemke">
                <label>Ngày kiểm kê:</label>
                <input type="date" value={ngayKiemKe} onChange={(e) => setNgayKiemKe(e.target.value)} />
            </div>

            <div className="ghi-chu">
                <label>Ghi chú:</label>
                <textarea value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} placeholder="Ghi chú cho phiếu kiểm kê..." />
            </div>

            <table className="kiemke-table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên sản phẩm</th>
                        <th>Tồn kho hệ thống</th>
                        <th>Thực tế</th>
                        <th>Chênh lệch</th>
                    </tr>
                </thead>
                <tbody>
                    {danhSachSanPham.map((sp, index) => (
                        <tr key={sp.idSanPham}>
                            <td>{index + 1}</td>
                            <td>{sp.tenSanPham}</td>
                            <td>{sp.soLuongHienCon}</td>
                            <td>
                                <input
                                    type="number"
                                    value={soLuongThucTe[sp.idSanPham] || ""}
                                    onChange={(e) => handleChange(sp.idSanPham, e.target.value)}
                                    className="input-kiemke"
                                    min="0"
                                />
                            </td>
                            <td className="chenhlech">
                                {(soLuongThucTe[sp.idSanPham] || 0) - sp.soLuongHienCon}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className="submit-btn" onClick={handleSubmit}>💾 Lưu phiếu kiểm kê</button>
        </div>
    );
};

export default FormKiemKe;
