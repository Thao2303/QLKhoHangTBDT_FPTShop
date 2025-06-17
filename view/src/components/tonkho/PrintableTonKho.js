// 📁 PrintableTonKho.js
import React from "react";
import "../nhapkho/PrintablePhieuNhap.css"; // dùng chung file CSS cho đẹp

const PrintableTonKho = ({ data }) => {
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

            <h1 className="title">📦 BÁO CÁO TỒN KHO</h1>

            <table className="table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã SP</th>
                        <th>Tên SP</th>
                        <th>Danh mục</th>
                        <th>Thương hiệu</th>
                        <th>Tồn hệ thống</th>
                        <th>Tối thiểu</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((sp, idx) => (
                        <tr key={sp.idSanPham}>
                            <td>{idx + 1}</td>
                            <td>{sp.maSanPham}</td>
                            <td>{sp.tenSanPham}</td>
                            <td>{sp.danhMuc}</td>
                            <td>{sp.thuongHieu}</td>
                            <td>{sp.tonHeThong}</td>
                            <td>{sp.soLuongToiThieu}</td>
                            <td>{sp.tonHeThong < sp.soLuongToiThieu ? "⚠️ Cần nhập" : "✅ Ổn định"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="signatures">
                <div>Người lập báo cáo</div>
                <div>Thủ kho</div>
            </div>
        </div>
    );
};

export default PrintableTonKho;
