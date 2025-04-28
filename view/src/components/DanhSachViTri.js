// ✅ DanhSachViTri.js - Giao diện bảng gọn, không bị lồng layout
import React from "react";

const DanhSachViTri = ({ danhSach, handleEdit, setConfirmDelete, isLoading, onXemChiTiet }) => {
    if (isLoading) return <p>Đang tải dữ liệu...</p>;

    return (
        <div className="overflow-x-auto">
            <table className="nice-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Dãy</th>
                        <th>Cột</th>
                        <th>Tầng</th>
                        <th>Sức chứa</th>
                        <th>Đã dùng</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {danhSach.map((item) => (
                        <tr key={item.idViTri}>
                            <td>{item.idViTri}</td>
                            <td>{item.day}</td>
                            <td>{item.cot}</td>
                            <td>{item.tang}</td>
                            <td>{item.sucChua}</td>
                            <td>{item.daDung}</td>
                            <td>
                                {item.trangThai === "0"
                                    ? "Đã khoá"
                                    : item.daDung >= item.sucChua
                                        ? "Đã đầy"
                                        : "Còn trống"}
                            </td>

                            <td>
                                <button
                                    onClick={() => onXemChiTiet(item.idViTri)}
                                    className="btn btn-view" title="Xem sản phẩm trong vị trí">
                                
                                    Xem
                                </button>
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="btn btn-edit"
                                >
                                    Sửa
                                </button>
                                <button
                                    onClick={() => setConfirmDelete(item)}
                                    className="btn btn-delete"
                                >
                                    Xoá
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DanhSachViTri;