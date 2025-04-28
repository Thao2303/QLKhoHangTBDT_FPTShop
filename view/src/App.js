import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import Router
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
import QuanLyPhieuXuat from './components/QuanLyPhieuXuat';
import FormSuaPhieuNhap from "./components/FormSuaPhieuNhap";
import FormPhieuXuat from './components//FormPhieuXuat';
import FormTaoYeuCauXuatKho from './components/FormTaoYeuCauXuatKho';
import QuanLyYeuCauXuatKho from './components/QuanLyYeuCauXuatKho';
import FormSuaYeuCauXuatKho from './components/FormSuaYeuCauXuatKho';
import FormKiemKe from "./components/FormKiemKe";
import FormThucHienKiemKe from "./components/FormThucHienKiemKe";
import QuanLyYeuCauKiemKe from "./components/QuanLyYeuCauKiemKe";
import FormTaoYeuCauKiemKe from "./components/FormTaoYeuCauKiemKe";
import FormSuaYeuCauKiemKe from './components/FormSuaYeuCauKiemKe';
import QuanLyPhieuKiemKe from './components/QuanLyPhieuKiemKe';
const App = () => {
    return (
        <Router> {/* Bao quanh toàn bộ các route với Router */}
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<><Navbar /><Sidebar /><Dashboard /></>} />
                <Route path="/" element={<Login />} /> {/* Trang mặc định sẽ là Login */}
                <Route path="/quanlyphieunhap" element={<><Navbar /><Sidebar /><QuanLyPhieuNhapKho /></>} />
                <Route path="/sodokho" element={<SoDoKho />} />
                <Route path="/them-phieu-nhap" element={<FormTaoPhieuNhap />} />
                <Route path="/quan-ly-tai-khoan" element={<QuanLyTaiKhoan />} />
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
                <Route path="/thuc-hien-kiem-ke" element={<FormThucHienKiemKe />} />
                <Route path="/yeu-cau-kiem-ke" element={<QuanLyYeuCauKiemKe />} />
                <Route path="/them-yeu-cau-kiem-ke" element={<FormTaoYeuCauKiemKe />} />
                <Route path="/sua-yeu-cau-kiem-ke/:id" element={<FormSuaYeuCauKiemKe />} />
                <Route path="/sua-yeu-cau-kiem-ke/:id" element={<QuanLyPhieuKiemKe />} />
                <Route path="/phieu-kiem-ke" element={<QuanLyPhieuKiemKe />} />
         
                <Route path="/thuc-hien-kiem-ke" element={<FormThucHienKiemKe />} />
         
            </Routes>
        </Router>
    );
};

export default App;
