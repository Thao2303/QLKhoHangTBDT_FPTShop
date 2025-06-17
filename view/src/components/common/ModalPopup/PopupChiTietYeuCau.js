// PopupChiTietYeuCau.js
import React from "react";
import { format } from "date-fns";
import './popup-style.css';

const PopupChiTietYeuCau = ({ data, tonKhoMap, onClose, onTaoPhieu }) => {
    return (
        <div className="popup-overlay">
            <div className="popup-inner">
                <button className="close-btn" onClick={onClose}>×</button>
                <h2 className="title">📄 CHI TIẾT YÊU CẦU #{data.idYeuCauXuatKho}</h2>

                <p><strong>🏢 Đại lý:</strong> {data.daiLy?.tenDaiLy}</p>
                <p><strong>🧑 Người tạo:</strong> {data.nguoiTao?.tenTaiKhoan || "Ẩn danh"}</p>
                <p><strong>📍 Địa chỉ:</strong> {data.diaChi}</p>
                <p><strong>📌 Lý do xuất:</strong> {data.lyDoXuat}</p>
                <p><strong>📅 Ngày tạo:</strong> {format(new Date(data.ngayYeuCau), "dd/MM/yyyy HH:mm:ss")}</p>

                <h4 style={{ marginTop: 12 }}>📦 Danh sách sản phẩm:</h4>
                <table className="sub-table">
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th>Số lượng</th>
                            <th>Tồn kho</th>
                            <th>Ghi chú</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.chiTietYeuCauXuatKhos?.map((ct, idx) => {
                            const ton = tonKhoMap?.[ct.idSanPham];
                            const ok = typeof ton === 'number' && ton >= ct.soLuong;
                            return (
                                <tr key={idx}>
                                    <td>{ct.sanPham?.tenSanPham}</td>
                                    <td>{ct.soLuong}</td>
                                    <td>{ton}</td>
                                    <td style={{ color: ton === 'Lỗi' ? 'orange' : !ok ? 'red' : 'green' }}>
                                        {ton === 'Lỗi' ? '⚠️ Lỗi' : !ok ? 'Không đủ' : '✔️ Đủ'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <div className="popup-footer">
                    <button className="export-btn" onClick={() => onTaoPhieu(data)}>📦 Tạo phiếu xuất</button>
                    <button className="cancel-button" onClick={onClose}>Đóng</button>
                </div>
            </div>
        </div>
    );
};

export default PopupChiTietYeuCau;
