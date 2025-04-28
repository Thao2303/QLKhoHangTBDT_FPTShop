import React from "react";
import "./popup-style.css"; // dùng chung luôn

const ChiTietSanPhamViTri = ({ danhSach = [] }) => {
    if (danhSach.length === 0) {
        return <p className="no-data">Không có sản phẩm nào trong vị trí này.</p>;
    }

    return (
        <div className="table-wrapper">
            <table className="nice-table">
                <thead>
                    <tr>
                        <th>Tên sản phẩm</th>
                        <th>SKU</th>
                        <th>Màu sắc</th>
                        <th>Số lượng</th>
                        <th>Thời gian lưu</th>
                    </tr>
                </thead>
                <tbody>
                    {danhSach.map((sp) => (
                        <tr key={sp.sku}>
                            <td>{sp.tenSanPham}</td>
                            <td>{sp.sku}</td>
                            <td>{sp.mauSac}</td>
                            <td style={{ textAlign: "right" }}>{sp.soLuong}</td>
                            <td>
                                {sp.thoiGianLuu
                                    ? new Date(sp.thoiGianLuu).toLocaleString("vi-VN")
                                    : "—"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ChiTietSanPhamViTri;
