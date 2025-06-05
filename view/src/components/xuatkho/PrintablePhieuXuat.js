import React from "react";

const PrintablePhieuXuat = ({ phieu, anViTri = false }) => {
    if (!phieu) return null;

    const gopSanPhamNeuAnViTri = (list, anViTri) => {
        const grouped = {};

        for (const ct of list) {
            const key = anViTri ? ct.idSanPham : `${ct.idSanPham}_${ct.idViTri || '0'}`;
            const donGia = ct.donGia ?? ct.tongTien / (ct.soLuong || 1) ?? ct.sanPham?.donGia ?? 0;
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

    const chiTietEnriched = gopSanPhamNeuAnViTri(phieu.chiTietPhieuXuats || [], anViTri);


    const tongSoLuong = chiTietEnriched.reduce((sum, ct) => sum + ct.soLuong, 0);
    const tongTien = chiTietEnriched.reduce((sum, ct) => sum + ct.thanhTien, 0);

    return (
        <div style={{ fontFamily: "Arial", padding: 24 }}>
            <div style={{ textAlign: "center" }}>
                <h2>CÔNG TY CỔ PHẦN FPT SHOP</h2>
                <p>Địa chỉ: 261-263 Khánh Hội, P2, Q4, TP.HCM</p>
                <p>Điện thoại: 1900 6606</p>
                <hr />
                <h2>PHIẾU XUẤT KHO #{phieu.idPhieuXuat}</h2>
            </div>

            <div style={{ marginTop: 16 }}>
                <p><strong>Đại lý:</strong> {phieu.yeuCauXuatKho?.daiLy?.tenDaiLy}</p>
                <p><strong>Ngày xuất:</strong> {new Date(phieu.ngayXuat).toLocaleString("vi-VN")}</p>
                <p><strong>Ghi chú:</strong> {phieu.ghiChu || "Không có"}</p>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }} border="1">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Đơn giá</th>
                        <th>Thành tiền</th>
                        {!anViTri && <th>Vị trí</th>}
                    </tr>
                </thead>
                <tbody>
                    {chiTietEnriched.map((ct, idx) => (
                        <tr key={idx}>
                            <td style={{ textAlign: "center" }}>{idx + 1}</td>
                            <td>{ct.sanPham?.tenSanPham}</td>
                            <td style={{ textAlign: "center" }}>{ct.soLuong}</td>
                            <td style={{ textAlign: "right" }}>{ct.donGia.toLocaleString("vi-VN")}</td>
                            <td style={{ textAlign: "right" }}>{ct.thanhTien.toLocaleString("vi-VN")}</td>
                            {!anViTri && <td>{ct.viTriStr}</td>}
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="2"><strong>Tổng cộng</strong></td>
                        <td style={{ textAlign: "center" }}><strong>{tongSoLuong}</strong></td>
                        <td></td>
                        <td style={{ textAlign: "right" }}><strong>{tongTien.toLocaleString("vi-VN")} ₫</strong></td>
                        {!anViTri && <td></td>}
                    </tr>
                </tfoot>
            </table>

            <div style={{ marginTop: 48, display: "flex", justifyContent: "space-between" }}>
                <div style={{ textAlign: "center" }}>
                    <p><strong>Người lập phiếu</strong></p>
                    <p>(Ký và ghi rõ họ tên)</p>
                </div>
                <div style={{ textAlign: "center" }}>
                    <p><strong>Người nhận hàng</strong></p>
                    <p>(Ký và ghi rõ họ tên)</p>
                </div>
                <div style={{ textAlign: "center" }}>
                    <p><strong>Thủ kho</strong></p>
                    <p>(Ký và ghi rõ họ tên)</p>
                </div>
            </div>
        </div>
    );
};

export default PrintablePhieuXuat;
