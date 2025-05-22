import React from 'react';

const PopupChiTietPhieuXuat = ({ phieuXuat, onClose }) => {
    const yc = phieuXuat.yeuCauXuatKho || {};
    const daiLy = yc.daiLy || {};
    const trangThai = yc.trangThaiXacNhan?.tenTrangThai || "--";

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div style={{ background: '#fff', padding: 24, borderRadius: 8, width: 700, maxHeight: '90vh', overflowY: 'auto' }}>
               
                <h1 className="title">📋 Chi tiết phiếu xuất #{phieuXuat.idPhieuXuat}</h1>
                <p><strong>🗓 Ngày xuất:</strong> {new Date(phieuXuat.ngayXuat).toLocaleString()}</p>
                <p><strong>🧑 Người xuất:</strong> {phieuXuat.nguoiXuat || "Không rõ"}</p>
                <p><strong>📝 Ghi chú:</strong> {phieuXuat.ghiChu || "Không có"}</p>

                <hr />

                <h4>📦 Thông tin yêu cầu xuất kho</h4>
                <p><strong>🏪 Đại lý:</strong> {daiLy.tenDaiLy || "--"}</p>
                <p><strong>📆 Ngày yêu cầu:</strong> {yc.ngayYeuCau ? new Date(yc.ngayYeuCau).toLocaleString() : "--"}</p>
                <p><strong>🚚 Phương thức vận chuyển:</strong> {yc.phuongThucVanChuyen || "--"}</p>
                <p><strong>🏷 Hình thức xuất:</strong> {yc.hinhThucXuat || "--"}</p>
                <p><strong>🧑 Người yêu cầu:</strong> {yc.nguoiYeuCau || "--"}</p>
                <p><strong>📌 Lý do:</strong> {yc.lyDo || "--"}</p>
                <p><strong>🔖 Trạng thái xác nhận:</strong> {trangThai}</p>

                <hr />

              

                <h4>📤 Chi tiết phiếu xuất</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f0f0f0' }}>
                            <th style={{ border: '1px solid #ccc', padding: 8 }}>Sản phẩm</th>
                            <th style={{ border: '1px solid #ccc', padding: 8 }}>Số lượng</th>
                            <th style={{ border: '1px solid #ccc', padding: 8 }}>Vị trí</th>
                        </tr>
                    </thead>
                    <tbody>
                        {phieuXuat.chiTietPhieuXuats?.map((ct, index) => (
                            <tr key={index}>
                                <td style={{ border: '1px solid #ccc', padding: 8 }}>{ct.sanPham?.tenSanPham || `SP #${ct.idSanPham}`}</td>
                                <td style={{ border: '1px solid #ccc', padding: 8 }}>{ct.soLuong}</td>
                                <td style={{ border: '1px solid #ccc', padding: 8 }}>
                                    {ct.viTri ? `${ct.viTri.day}-${ct.viTri.cot}-${ct.viTri.tang}` : ct.idViTri || "--"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{ textAlign: 'right', marginTop: 24 }}>
                    <button onClick={onClose} style={{ padding: '8px 16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: 4 }}>
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopupChiTietPhieuXuat;
