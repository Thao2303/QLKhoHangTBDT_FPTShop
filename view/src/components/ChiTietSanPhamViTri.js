import React from "react";

const ChiTietSanPhamViTri = ({ danhSach = [] }) => {
    if (danhSach.length === 0) {
        return (
            <p className="text-gray-500 italic mt-4">
                Không có sản phẩm nào trong vị trí này.
            </p>
        );
    }

    return (
        <div className="overflow-x-auto mt-4">
            <table className="min-w-full bg-white border border-gray-200 rounded shadow">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="text-left px-4 py-2 border">Tên sản phẩm</th>
                        <th className="text-left px-4 py-2 border">SKU</th>
                        <th className="text-left px-4 py-2 border">Màu sắc</th>
                        <th className="text-right px-4 py-2 border">Số lượng</th>
                        <th className="text-left px-4 py-2 border">Thời gian lưu</th>
                    </tr>
                </thead>
                <tbody>
                    {danhSach.map((sp) => (
                        <tr key={sp.sku} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border">{sp.tenSanPham}</td>
                            <td className="px-4 py-2 border">{sp.sku}</td>
                            <td className="px-4 py-2 border">{sp.mauSac}</td>
                            <td className="px-4 py-2 border text-right">{sp.soLuong}</td>
                            <td className="px-4 py-2 border">
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
