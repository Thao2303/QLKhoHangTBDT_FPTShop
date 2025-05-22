import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import Router
import PrivateRoute from "./components/PrivateRoute";
import UnauthorizedPage from "./components/UnauthorizedPage";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Sidebar2 from "./components/Sidebar2";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login"; // Import trang Login
import QuanLyPhieuNhapKho from "./components/QuanLyPhieuNhapKho";
import FormTaoPhieuNhap from './components/FormTaoPhieuNhap';
import QuanLyTaiKhoan from './components/QuanLyTaiKhoan';
import GoiYViTriUI from './components/GoiyViTri'; // 👈 Import thêm
import "./App.css";
import SoDoKho from './components//SoDoKho'; 
import DanhSachViTri from './components/DanhSachViTri';
import QuanLyViTri from "./components/QuanLyViTri";
import InMaQR from "./components/InMaQR";
import TrangTimKiemSanPham from './components/TrangTimKiemSanPham';
import QuanLyViTriSanPham from './components/QuanLyViTriSanPham'

//Phiếu xuất

import QuanLyPhieuXuat from './components/QuanLyPhieuXuat';
import FormSuaPhieuNhap from "./components/FormSuaPhieuNhap";
import FormPhieuXuat from './components//FormPhieuXuat';
import FormTaoYeuCauXuatKho from './components/FormTaoYeuCauXuatKho';
import QuanLyYeuCauXuatKho from './components/QuanLyYeuCauXuatKho';
import FormSuaYeuCauXuatKho from './components/FormSuaYeuCauXuatKho';
import FormTaoPhieuXuat from './components/FormTaoPhieuXuat';

//Kiểm kê
import QuanLyYeuCauKiemKe from "./components/QuanLyYeuCauKiemKe";
import FormTaoYeuCauKiemKe from "./components/FormTaoYeuCauKiemKe";
import QuanLyPhieuKiemKe from "./components/QuanLyPhieuKiemKe";
import FormThucHienKiemKe from "./components/FormThucHienKiemKe";
import FormChinhSuaYeuCauKiemKe from "./components/FormChinhSuaYeuCauKiemKe";
import XemPhieuKiemKe from "./components/XemPhieuKiemKe";

//Danh mục
import QuanLyDanhMuc from "./components/QuanLyDanhMuc";

//Sản phẩm
import QuanLySanPham from "./components/QuanLySanPham"; 

import SuaViTriLuuTru from "./components/SuaViTriLuuTru";

//Tồn kho

import QuanLyTonKho from "./components/QuanLyTonKho";
import QuanLyTonTheoLo from "./components/QuanLyTonTheoLo"

//Sản phẩm

import ChuyenViTriSanPham from "./components/ChuyenViTriSanPham";

import ForgotPassword from './components/ForgotPassword';
import ResetPassword from "./components/ResetPassword";


import FormTaoPhieuXuatThuKho from './components/FormTaoPhieuXuatThuKho'
const App = () => {
    return (
        <Router> {/* Bao quanh toàn bộ các route với Router */}
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/dashboard" element={<><Navbar /><Sidebar /><Dashboard /></>} />
                <Route path="/" element={<Login />} /> {/* Trang mặc định sẽ là Login */}
                <Route path="/quanlyphieunhap" element={<><Navbar /><Sidebar /><QuanLyPhieuNhapKho /></>} />
                <Route path="/sodokho" element={<SoDoKho />} />
                <Route path="/them-phieu-nhap" element={<FormTaoPhieuNhap />} />
             
                <Route
                    path="/quan-ly-tai-khoan"
                    element={
                        <PrivateRoute allowedRoles={["Admin", "Thủ kho"]}>
                            <QuanLyTaiKhoan />
                        </PrivateRoute>
                    }
                />

                <Route path="/goiyvitri" element={<GoiYViTriUI />} /> {/* 👈 Route mới */}
                <Route path="/quanlyvitri" element={<QuanLyViTri />} />
                <Route path="/in-maqr" element={<InMaQR />} />
                <Route path="/timkiem" element={<TrangTimKiemSanPham />} />
                <Route path="/quanlyphieuxuat" element={<QuanLyPhieuXuat />} />
                <Route path="/sua-phieu-nhap/:id" element={<FormSuaPhieuNhap />} />
                <Route path="/tao-yeu-cau-xuat-kho" element={<><Navbar /><Sidebar /><FormTaoYeuCauXuatKho /></>} />
                <Route path="/tao-phieu-xuat-kho" element={<><Navbar /><Sidebar /><FormPhieuXuat /></>} />
                <Route path="/quanlyyeucauxuat" element={<><Navbar /><Sidebar /><QuanLyYeuCauXuatKho /></>} />
                <Route path="/sua-yeu-cau-xuat-kho/:id" element={<FormSuaYeuCauXuatKho />} />
                <Route path="/tao-phieu-xuat" element={<FormTaoPhieuXuat />} />
       
                <Route path="/quan-ly-yeu-cau-kiem-ke" element={<QuanLyYeuCauKiemKe />} />
                <Route path="/tao-yeu-cau-kiem-ke" element={<FormTaoYeuCauKiemKe />} />
                <Route path="/quan-ly-phieu-kiem-ke" element={<QuanLyPhieuKiemKe />} />
                <Route path="/thuc-hien-kiem-ke/:idYeuCauKiemKe" element={<FormThucHienKiemKe />} />
                <Route path="/chinh-sua-yeu-cau-kiem-ke/:id" element={<FormChinhSuaYeuCauKiemKe />} />
                <Route path="/xem-phieu-kiem-ke/:idYeuCauKiemKe" element={<XemPhieuKiemKe />} />

                <Route path="/quan-ly-danh-muc" element={<QuanLyDanhMuc />} />
                <Route path="/sua-vitri-luutru" element={<SuaViTriLuuTru /> } />
                <Route path="/quan-ly-san-pham" element={<QuanLySanPham />} />
                <Route path="/quan-ly-ton-kho" element={<QuanLyTonKho />} />
                <Route path="/quan-ly-ton-theo-lo" element={<QuanLyTonTheoLo />} />

                <Route path="/chuyen-vi-tri-san-pham" element={<ChuyenViTriSanPham />} />
                <Route path="/quan-ly-vi-tri-san-pham" element={<QuanLyViTriSanPham />} />
                <Route path="/tao-phieu-xuat-thukho" element={<FormTaoPhieuXuatThuKho />} />
            </Routes>
        </Router>
    );
};

export default App;
