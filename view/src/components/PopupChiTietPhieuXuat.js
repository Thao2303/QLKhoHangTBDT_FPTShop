import React from 'react';

const PopupChiTietPhieuXuat = ({ phieuXuat, onClose }) => {
    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div style={{ background: '#fff', padding: 20, borderRadius: 8, width: 500 }}>
                <h3>📋 Chi tiết phiếu xuất #{phieuXuat.idPhieuXuat}</h3>
                <p><strong>Ngày xuất:</strong> {new Date(phieuXuat.ngayXuat).toLocaleDateString()}</p>
                <p><strong>Đại lý:</strong> {phieuXuat.yeuCauXuatKho?.daiLy?.tenDaiLy}</p>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th>Số lượng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {phieuXuat.chiTietPhieuXuats?.map((ct, index) => (
                            <tr key={index}>
                                <td>{ct.sanPham?.tenSanPham || `SP #${ct.idSanPham}`}</td>
                                <td>{ct.soLuong}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button onClick={onClose} style={{ marginTop: 20 }}>Đóng</button>
            </div>
        </div>
    );
};

export default PopupChiTietPhieuXuat;
