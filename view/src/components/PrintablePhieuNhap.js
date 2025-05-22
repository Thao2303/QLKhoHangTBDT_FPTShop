import React, { forwardRef } from "react";
import html2pdf from "html2pdf.js";
const PrintablePhieuNhap = forwardRef(({ phieu, chiTiet }, ref) => {
    if (!phieu || !chiTiet || chiTiet.length === 0) {
        console.warn("Không có dữ liệu để in");
        return <div ref={ref}>Không có dữ liệu để in</div>;
    }

    return (
        <div ref={ref} style={{ padding: "20px", fontFamily: "'Segoe UI', Tahoma, sans-serif" }}>

            <h2 style={{ textAlign: "center" }}>PHIẾU NHẬP KHO</h2>
            <p><strong>Mã phiếu:</strong> {phieu.idPhieuNhap}</p>
            <p><strong>Nhà cung cấp:</strong> {phieu.nhaCungCap?.tenNhaCungCap}</p>
            <p><strong>Ngày nhập:</strong> {new Date(phieu.ngayNhap).toLocaleString()}</p>

            <table border="1" cellPadding="5" cellSpacing="0" width="100%">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên sản phẩm</th>
                        <th>Mã sản phẩm</th>
                        <th>SL chứng từ</th>
                        <th>SL thực nhập</th>
                        <th>Đơn giá</th>
                        <th>Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    {chiTiet.map((ct, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{ct.sanPham?.tenSanPham}</td>
                            <td>{ct.sanPham?.idSanPham}</td>
                            <td>{ct.soLuongTheoChungTu}</td>
                            <td>{ct.soLuongThucNhap}</td>
                            <td>{Number(ct.donGia || 0).toLocaleString()}</td>
                            <td>{Number(ct.tongTien || 0).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <p style={{ marginTop: "30px" }}>
                <strong>Tổng cộng:</strong> {chiTiet.reduce((sum, ct) => sum + (Number(ct.tongTien) || 0), 0).toLocaleString()} đ
            </p>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "50px" }}>
                <div>Người lập phiếu</div>
                <div>Người giao hàng</div>
                <div>Thủ kho</div>
            </div>
        </div>
    );
});

export default PrintablePhieuNhap;
