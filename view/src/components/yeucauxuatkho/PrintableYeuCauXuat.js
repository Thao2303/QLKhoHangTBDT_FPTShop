import React from "react";
import "../nhapkho/PrintablePhieuNhap.css"; // dùng lại luôn file CSS của phiếu nhập

const PrintableYeuCauXuat = ({ yeuCau, chiTiet, tonKhoMap }) => {
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

            <h1 className="title">PHIẾU YÊU CẦU XUẤT KHO</h1>

            <div className="info-grid">
                <div><strong>Mã yêu cầu:</strong> {yeuCau.idYeuCauXuatKho}</div>
                <div><strong>Ngày yêu cầu:</strong> {new Date(yeuCau.ngayYeuCau).toLocaleString()}</div>
                <div><strong>Đại lý:</strong> {yeuCau.daiLy?.tenDaiLy}</div>
                <div><strong>Người tạo:</strong> {yeuCau.nguoiTao?.tenTaiKhoan}</div>
                <div><strong>Trạng thái:</strong> {yeuCau.trangThai || "Chờ duyệt"}</div>
                <div><strong>Ghi chú:</strong> {yeuCau.ghiChu || "Không có"}</div>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã SP</th>
                        <th>Tên sản phẩm</th>
                       
                        <th>Số lượng yêu cầu</th>
                    
                    </tr>
                </thead>
                <tbody>
                    {chiTiet.map((ct, idx) => (
                        <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>{ct.sanPham?.idSanPham}</td>
                            <td>{ct.sanPham?.tenSanPham}</td>
                       
                            <td>{ct.soLuong}</td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="signatures">
                <div>Người lập phiếu</div>
                <div>Thủ kho</div>
                <div>Người nhận hàng</div>
            </div>
        </div>
    );
};

export default PrintableYeuCauXuat;
