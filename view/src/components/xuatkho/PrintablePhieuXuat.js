import React from "react";
import "../nhapkho/PrintablePhieuNhap.css"; // Tận dụng style có sẵn

const PrintablePhieuXuat = ({ phieu, anViTri = false }) => {
    if (!phieu) return null;

    const gopSanPham = (list) => {
        const grouped = {};

        for (const ct of list) {
            const key = anViTri ? ct.idSanPham : `${ct.idSanPham}_${ct.idViTri || '0'}`;
            const donGia = ct.donGia ?? ct.donGiaXuat ?? 0;
            const thanhTien = ct.tongTien ?? donGia * ct.soLuong;
            const viTriStr = ct.viTri
                ? `Dãy ${ct.viTri.day} - Cột ${ct.viTri.cot} - Tầng ${ct.viTri.tang}`
                : "Không rõ";

            if (!grouped[key]) {
                grouped[key] = {
                    ...ct,
                    soLuong: 0,
                    thanhTien: 0,
                    donGia,
                    viTriStr
                };
            }

            grouped[key].soLuong += ct.soLuong;
            grouped[key].thanhTien += thanhTien;
        }

        return Object.values(grouped);
    };

    const chiTiet = gopSanPham(phieu.chiTietPhieuXuats || []);
    const tongSoLuong = chiTiet.reduce((sum, ct) => sum + ct.soLuong, 0);
    const tongTien = chiTiet.reduce((sum, ct) => sum + ct.thanhTien, 0);

    return (
        <div className="phieu-in">
            <div className="header">
                <img src="/img/logo-fpt-shop.png" alt="Logo" className="logo" />
                <div className="company-info">
                    <h2>CÔNG TY CỔ PHẦN BÁN LẺ KỸ THUẬT SỐ FPT</h2>
                    <p>Địa chỉ: Số 261 – 263 Khánh Hội, P2, Q4, TP. Hồ Chí Minh</p>
                    <p>Điện thoại: 1900 6606</p>
                </div>
            </div>

            <h1 className="title">PHIẾU XUẤT KHO</h1>

            <div className="info-grid">
                <div><strong>Mã phiếu:</strong> {phieu.idPhieuXuat}</div>
                <div><strong>Ngày xuất:</strong> {new Date(phieu.ngayXuat).toLocaleString("vi-VN")}</div>
                <div><strong>Đại lý:</strong> {phieu.yeuCauXuatKho?.daiLy?.tenDaiLy}</div>
             
                <div><strong>Hình thức:</strong> {phieu.yeuCauXuatKho?.hinhThucXuat}</div>
                <div><strong>Phương thức vận chuyển:</strong> {phieu.yeuCauXuatKho?.phuongThucVanChuyen}</div>
                <div><strong>Ghi chú:</strong> {phieu.ghiChu || "Không có"}</div>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên sản phẩm</th>
                        <th>Mã SP</th>
                        <th>Số lượng</th>
                        <th>Đơn giá</th>
                        <th>Thành tiền</th>
                        {!anViTri && <th>Vị trí</th>}
                    </tr>
                </thead>
                <tbody>
                    {chiTiet.map((ct, idx) => (
                        <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>{ct.sanPham?.tenSanPham}</td>
                            <td>{ct.sanPham?.idSanPham}</td>
                            <td>{ct.soLuong}</td>
                            <td>{ct.donGia.toLocaleString("vi-VN")}</td>
                            <td>{ct.thanhTien.toLocaleString("vi-VN")}</td>
                            {!anViTri && <td>{ct.viTriStr}</td>}
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="3"><strong>Tổng cộng</strong></td>
                        <td><strong>{tongSoLuong}</strong></td>
                        <td></td>
                        <td><strong>{tongTien.toLocaleString("vi-VN")} ₫</strong></td>
                        {!anViTri && <td></td>}
                    </tr>
                </tfoot>
            </table>

            <div className="signatures">
                <div>Người lập phiếu</div>
                <div>Người nhận hàng</div>
                <div>Thủ kho</div>
            </div>
        </div>
    );
};

export default PrintablePhieuXuat;
