import React, { useEffect, useState } from "react";
import '../common/ModalPopup/popup-style.css';
import axios from "axios";

const ChiTietSanPhamViTri = ({ danhSach = [], idSanPham, onClose }) => {
    const [spChiTiet, setSpChiTiet] = useState(null);

    useEffect(() => {
        if (idSanPham) {
            axios.get(`https://localhost:5288/api/SanPham/${idSanPham}`)
                .then(res => setSpChiTiet(res.data))
                .catch(() => console.warn("Không lấy được chi tiết sản phẩm"));
        }
    }, [idSanPham]);

    const danhSachLoc = danhSach.filter(sp => sp.idSanPham === idSanPham);

    return (
        <div className="popup-inner">
            <h1 className="title">✉️ THÔNG TIN VỊ TRÍ LƯU TRỮ</h1>

            {spChiTiet?.hinhAnh && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                    <img
                        src={spChiTiet.hinhAnh.startsWith('http') ? spChiTiet.hinhAnh : `https://localhost:5288${spChiTiet.hinhAnh}`}
                        alt="Hình ảnh sản phẩm"
                        style={{
                            width: 160,
                            height: 160,
                            objectFit: 'cover',
                            borderRadius: 12,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                    />
                </div>
            )}

            {spChiTiet?.tenSanPham && (
                <h3 style={{ textAlign: "center", marginBottom: 20 }}>
                    🏷️ {spChiTiet.tenSanPham}
                </h3>
            )}

            {danhSachLoc.length === 0 ? (
                <p className="no-data">Không có sản phẩm nào trong vị trí này.</p>
            ) : (
                <div className="table-wrapper scrollable">
                    <table className="nice-table">
                        <thead>
                            <tr>
                                <th>Vị trí</th>
                                <th style={{ textAlign: "right" }}>Số lượng</th>
                            
                            </tr>
                        </thead>
                        <tbody>
                            {danhSachLoc.map((sp, index) => (
                                <tr key={index}>
                                    <td>Dãy {sp.day} - Cột {sp.cot} - Tầng {sp.tang}</td>
                                    <td style={{ textAlign: "right" }}>{sp.soLuong}</td>
                                   
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
