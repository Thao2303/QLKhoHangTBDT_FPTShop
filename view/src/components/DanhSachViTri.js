import React from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import Navbar from "./Navbar.js";
import Sidebar from "./Sidebar.js";

const DanhSachViTri = ({ danhSach = [], handleEdit, setConfirmDelete, isLoading, onXemChiTiet }) => {
    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <div className="main-layout">
                    <Navbar />
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
                <thead>
                    <tr className="bg-gray-100 text-gray-700">
                        <th className="px-4 py-2">#</th>
                        <th className="px-4 py-2">Dãy</th>
                        <th className="px-4 py-2">Cột</th>
                        <th className="px-4 py-2">Tầng</th>
                        <th className="px-4 py-2">Sức chứa</th>
                        <th className="px-4 py-2">Đã dùng</th>
                        <th className="px-4 py-2">Trạng thái</th>
                        <th className="px-4 py-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan="8" className="text-center py-4">Đang tải dữ liệu...</td>
                        </tr>
                    ) : danhSach.length === 0 ? (
                        <tr>
                            <td colSpan="8" className="text-center py-4 text-gray-500 italic">Không có dữ liệu.</td>
                        </tr>
                    ) : (
                        danhSach.map((item, index) => (
                            <tr key={item.idViTri} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-2 text-center">{index + 1}</td>
                                <td className="px-4 py-2 text-center">{item.day}</td>
                                <td className="px-4 py-2 text-center">{item.cot}</td>
                                <td className="px-4 py-2 text-center">{item.tang}</td>
                                <td className="px-4 py-2 text-center">{item.sucChua}</td>
                                <td className="px-4 py-2 text-center">{item.daDung}</td>
                                <td className="px-4 py-2 text-center">
                                    {item.trangThai === "1" ? (
                                        <span className="text-green-600 font-medium">Còn trống</span>
                                    ) : (
                                        <span className="text-red-500 font-medium">Đã khoá</span>
                                    )}
                                </td>
                                <td className="px-4 py-2 text-center">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            className="text-blue-500 hover:text-blue-700"
                                            onClick={() => onXemChiTiet(item.idViTri)}
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            className="text-green-600 hover:text-green-800"
                                            onClick={() => handleEdit(item)}
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-800"
                                            onClick={() => setConfirmDelete(item)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DanhSachViTri;