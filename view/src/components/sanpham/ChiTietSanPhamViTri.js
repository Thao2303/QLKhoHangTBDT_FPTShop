import React from "react";
import '../common/ModalPopup/popup-style.css';

const ChiTietSanPhamViTri = ({ danhSach = [], viTri, onClose }) => {
    // Gộp sản phẩm theo tên + SKU + màu sắc
    const danhSachGop = Object.values(
        (danhSach || []).reduce((acc, sp) => {
            const key = `${sp.tenSanPham}_${sp.sku}_${sp.mauSac}`;
            if (!acc[key]) {
                acc[key] = { ...sp, soLuong: Number(sp.soLuong) };
            } else {
                acc[key].soLuong += Number(sp.soLuong);
            }
            return acc;
        }, {})
    ).filter(sp => sp.soLuong > 0); // 👈 Lọc bỏ sp hết hàng


    return (
        <div className="popup-inner">
 
            <h1 className="title">✉️ Thông tin vị trí lưu trữ</h1>
            {viTri ? (
                <div className="vi-tri-grid">
                    <div><span>ID:</span> {viTri.idViTri}</div>
                    <div><span>Dãy:</span> {viTri.day}</div>
                    <div><span>Cột:</span> {viTri.cot}</div>
                    <div><span>Tầng:</span> {viTri.tang}</div>
                    <div><span>Chiều dài:</span> {viTri.chieuDai} mm</div>
                    <div><span>Chiều rộng:</span> {viTri.chieuRong} mm</div>
                    <div><span>Chiều cao:</span> {viTri.chieuCao} mm</div>
                    <div><span>Sức chứa:</span> {viTri.sucChua?.toLocaleString()} mm³</div>
                    <div><span>Đã dùng:</span> {viTri.daDung?.toLocaleString()} mm³</div>
                </div>
            ) : (
                <p className="no-data">Không tìm thấy thông tin vị trí.</p>
            )}

            <h3 style={{ marginTop: 24 }}>📦 Danh sách sản phẩm</h3>

            {danhSachGop.length === 0 ? (
                <p className="no-data">Không có sản phẩm nào trong vị trí này.</p>
            ) : (
                <div className="table-wrapper scrollable">
                    <table className="nice-table">
                        <thead>
                            <tr>
                                <th>Tên sản phẩm</th>
                                <th>SKU</th>
                                <th>Màu sắc</th>
                                <th style={{ textAlign: "right" }}>Số lượng</th>
                                <th>Thời gian lưu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {danhSachGop.map((sp, index) => (
                                <tr key={`sp-${index}`}>
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
            )}

            <div style={{ marginTop: 20, textAlign: "right" }}>
                <button onClick={onClose} className="btn btn-primary">Đóng</button>
            </div>
        </div>
    );
};

export default ChiTietSanPhamViTri;
