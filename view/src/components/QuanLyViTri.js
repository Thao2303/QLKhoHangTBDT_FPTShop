import React, { useEffect, useState } from "react";
import axios from "axios";
import DanhSachViTri from "./DanhSachViTri";
import FormViTri from "./FormViTri";
import ChiTietSanPhamViTri from "./ChiTietSanPhamViTri";
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const QuanLyViTri = () => {
    const [danhSach, setDanhSach] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedViTri, setSelectedViTri] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [sanPhamChiTiet, setSanPhamChiTiet] = useState([]);
    const [xemChiTietId, setXemChiTietId] = useState(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("https://localhost:5288/api/vitri");
            setDanhSach(res.data);
        } catch (err) {
            console.error("Lỗi tải vị trí:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLuu = async (data) => {
        try {
            if (data.idViTri) {
                await axios.put(`https://localhost:5288/api/vitri/${data.idViTri}`, data);
            } else {
                await axios.post("https://localhost:5288/api/vitri", data);
            }
            setIsFormOpen(false);
            setSelectedViTri(null); // reset lại sau khi lưu
            fetchData();
        } catch (err) {
            console.error("Lỗi lưu vị trí:", err);
        }
    };

    const handleXoa = async () => {
        try {
            await axios.delete(`https://localhost:5288/api/vitri/${confirmDelete.idViTri}`);
            setConfirmDelete(null);
            fetchData();
        } catch (err) {
            console.error("Lỗi xoá vị trí:", err);
        }
    };

    const onXemChiTiet = async (idViTri) => {
        setXemChiTietId(idViTri);
        try {
            const res = await axios.get(`https://localhost:5288/api/luutru/chitietluutru/vitri/${idViTri}`);
            setSanPhamChiTiet(res.data);
        } catch (err) {
            console.error("Lỗi khi lấy sản phẩm trong vị trí:", err);
            setSanPhamChiTiet([]);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="p-6 space-y-6">
            <Sidebar />
            <Navbar />
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <span role="img" aria-label="box">📦</span> Quản lý vị trí trong kho
            </h1>

            <button
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => {
                    setSelectedViTri(null);
                    setIsFormOpen(true);
                }}
            >
                + Thêm vị trí
            </button>

            <DanhSachViTri
                danhSach={danhSach}
                handleEdit={(vt) => {
                    setSelectedViTri(vt);
                    setIsFormOpen(true);
                }}
                setConfirmDelete={setConfirmDelete}
                isLoading={isLoading}
                onXemChiTiet={onXemChiTiet}
            />

            {isFormOpen && (
                <FormViTri
                    visible={isFormOpen}
                    onClose={() => {
                        setIsFormOpen(false);
                        setSelectedViTri(null);
                    }}
                    onSubmit={handleLuu}
                    initialData={selectedViTri}
                />
            )}

            {confirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <p>Bạn có chắc chắn muốn xoá vị trí này?</p>
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={() => setConfirmDelete(null)}
                            >
                                Huỷ
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                onClick={handleXoa}
                            >
                                Xoá
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {xemChiTietId && (
                <div>
                    <h2 className="text-xl font-semibold flex items-center gap-2 mt-6">
                        <span role="img" aria-label="box">📦</span> Sản phẩm trong vị trí #{xemChiTietId}
                    </h2>
                    <ChiTietSanPhamViTri danhSach={sanPhamChiTiet} />
                    <button
                        onClick={() => setXemChiTietId(null)}
                        className="mt-2 px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Đóng
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuanLyViTri;
