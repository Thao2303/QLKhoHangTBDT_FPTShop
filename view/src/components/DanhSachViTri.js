import React from "react";

const DanhSachViTri = ({ danhSach, handleEdit, setConfirmDelete, isLoading, onXemChiTiet, renderStatus }) => {
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
                    {danhSach.map((item) => {
                        const tinhTrang = item.trangThai === 0 || item.trangThai === "0"
                            ? "Đã khoá"
                            : item.daDung >= item.sucChua
                                ? "Đã đầy"
                                : "Còn trống";

                        const isLocked = tinhTrang === "Đã khoá";

                        return (
                            <tr key={item.idViTri}>
                                <td>{item.idViTri}</td>
                                <td>{item.day}</td>
                                <td>{item.cot}</td>
                                <td>{item.tang}</td>
                                <td>{item.sucChua}</td>
                                <td>{item.daDung}</td>
                                <td>
                                    {renderStatus ? renderStatus(item) : tinhTrang}
                                </td>
                                <td>
                                    <button
                                        onClick={() => onXemChiTiet(item.idViTri)}
                                        className="btn btn-view"
                                        title="Xem sản phẩm trong vị trí"
                                    >
                                        Xem
                                    </button>
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="btn btn-edit"
                                        disabled={isLocked}
                                        title={isLocked ? "Không thể sửa vị trí đã khoá" : "Sửa vị trí"}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => setConfirmDelete(item)}
                                        className="btn btn-delete"
                                        disabled={isLocked}
                                        title={isLocked ? "Không thể xoá vị trí đã khoá" : "Xoá vị trí"}
                                    >
                                        Xoá
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default DanhSachViTri;
