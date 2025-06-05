import React from "react";
import "./PrintablePhieuNhap.css"; // để in ra cho đẹp

const PrintablePhieuNhap = ({ phieu, chiTiet }) => {
    const getTongTien = () =>
        chiTiet.reduce((sum, ct) => sum + (ct.tongTien || 0), 0);

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

            <h1 className="title">PHIẾU NHẬP KHO</h1>

            <div className="info-grid">
                <div><strong>Mã phiếu:</strong> {phieu.idPhieuNhap}</div>
                <div><strong>Ngày nhập:</strong> {new Date(phieu.ngayNhap).toLocaleString()}</div>
                <div><strong>Nhà cung cấp:</strong> {phieu.nhaCungCap?.tenNhaCungCap}</div>
                <div><strong>Người lập phiếu:</strong> {phieu.nguoiTao}</div>
                <div><strong>Trạng thái:</strong> {
                    phieu.trangThai === 1 ? "Chờ duyệt" :
                        phieu.trangThai === 2 ? "Đã duyệt" :
                            phieu.trangThai === 3 ? "Từ chối" : "Hoàn hàng"
                }</div>
                <div><strong>Ghi chú:</strong> {phieu.ghiChu || "Không có"}</div>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên sản phẩm</th>
                        <th>Mã SP</th>
                        <th>SL chứng từ</th>
                        <th>SL thực nhập</th>
                        <th>Đơn giá</th>
                        <th>Thành tiền</th>
                        <th>Vị trí</th>
                        <th>SL</th>
                    </tr>
                </thead>
                <tbody>
                    {chiTiet.map((ct, idx) =>
                        ct.viTri?.length ? ct.viTri.map((v, i) => (
                            <tr key={`vitri-${idx}-${i}`}>
                                {i === 0 && (
                                    <>
                                        <td rowSpan={ct.viTri.length}>{idx + 1}</td>
                                        <td rowSpan={ct.viTri.length}>{ct.sanPham?.tenSanPham}</td>
                                        <td rowSpan={ct.viTri.length}>{ct.sanPham?.idSanPham}</td>
                                        <td rowSpan={ct.viTri.length}>{ct.soLuongTheoChungTu}</td>
                                        <td rowSpan={ct.viTri.length}>{ct.soLuongThucNhap}</td>
                                        <td rowSpan={ct.viTri.length}>{ct.donGia.toLocaleString()}</td>
                                        <td rowSpan={ct.viTri.length}>{ct.tongTien.toLocaleString()}</td>
                                    </>
                                )}
                                <td>{v.day}-{v.cot}-{v.tang}</td>
                                <td>{v.soLuong}</td>
                            </tr>
                        )) : (
                            <tr key={`no-vt-${idx}`}>
                                <td>{idx + 1}</td>
                                <td>{ct.sanPham?.tenSanPham}</td>
                                <td>{ct.sanPham?.idSanPham}</td>
                                <td>{ct.soLuongTheoChungTu}</td>
                                <td>{ct.soLuongThucNhap}</td>
                                <td>{ct.donGia.toLocaleString()}</td>
                                <td>{ct.tongTien.toLocaleString()}</td>
                                <td colSpan={2}><em>Không có</em></td>
                            </tr>
                        )
                    )}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="6" style={{ textAlign: "right" }}><strong>Tổng cộng:</strong></td>
                        <td><strong>{getTongTien().toLocaleString()}</strong></td>
                        <td colSpan="2"></td>
                    </tr>
                </tfoot>
            </table>

            <div className="signatures">
                <div>Người lập phiếu</div>
                <div>Người giao hàng</div>
                <div>Thủ kho</div>
            </div>
        </div>
    );
};

export default PrintablePhieuNhap;
