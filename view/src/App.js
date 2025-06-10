import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import "./App.css";

import Navbar from './components/common/Navbar/Navbar';
import Sidebar from "./components/common/Sidebar/Sidebar";

//Phiếu nhập
import QuanLyPhieuNhapKho from "./components/nhapkho/QuanLyPhieuNhapKho";
import FormTaoPhieuNhap from './components/nhapkho/FormTaoPhieuNhap';

//Tài khoản
import QuanLyTaiKhoan from './components/taikhoan/QuanLyTaiKhoan';
import ConfirmAccount from './components/auth/ConfirmAccount'
//Sơ đồ kho
import SoDoKho from './components/sodokho/SoDoKho'; 

//Vị trí
import DanhSachViTri from './components/vitri/DanhSachViTri';
import QuanLyViTri from "./components/vitri/QuanLyViTri";
import GoiYViTriUI from './components/vitri/GoiyViTri'; 

//Phiếu xuất

import QuanLyPhieuXuat from './components/xuatkho/QuanLyPhieuXuat';
import FormSuaPhieuNhap from "./components/nhapkho/FormSuaPhieuNhap";
import FormPhieuXuat from './components/xuatkho/FormPhieuXuat';
import FormTaoPhieuXuat from './components/xuatkho/FormTaoPhieuXuat';

//Yêu cầu xuất kho
import FormTaoYeuCauXuatKho from './components/yeucauxuatkho/FormTaoYeuCauXuatKho';
import QuanLyYeuCauXuatKho from './components/yeucauxuatkho/QuanLyYeuCauXuatKho';
import FormSuaYeuCauXuatKho from './components/yeucauxuatkho/FormSuaYeuCauXuatKho';


//Kiểm kê
import QuanLyYeuCauKiemKe from "./components/kiemke/QuanLyYeuCauKiemKe";
import FormTaoYeuCauKiemKe from "./components/kiemke/FormTaoYeuCauKiemKe";
import QuanLyPhieuKiemKe from "./components/kiemke/QuanLyPhieuKiemKe";
import FormThucHienKiemKe from "./components/kiemke/FormThucHienKiemKe";
import FormChinhSuaYeuCauKiemKe from "./components/kiemke/FormChinhSuaYeuCauKiemKe";
import XemPhieuKiemKe from "./components/kiemke/XemPhieuKiemKe";

//Danh mục
import QuanLyDanhMuc from "./components/quanly/QuanLyDanhMuc";

//Sản phẩm
import QuanLySanPham from "./components/sanpham/QuanLySanPham"; 
import TrangTimKiemSanPham from './components/sanpham/TrangTimKiemSanPham';
import QuanLyViTriSanPham from './components/sanpham/QuanLyViTriSanPham'
import SuaViTriLuuTru from "./components/sanpham/SuaViTriLuuTru";

//Tồn kho

import QuanLyTonKho from "./components/tonkho/QuanLyTonKho";
import QuanLyTonTheoLo from "./components/tonkho/QuanLyTonTheoLo"

//Sản phẩm

import ChuyenViTriSanPham from "./components/sanpham/ChuyenViTriSanPham";

//Đại lý
import QuanLyDaiLy from "./components/daily/QuanLyDaiLy";

//Nhà cung cấp
import QuanLyNhaCungCap from "./components/nhacungcap/QuanLyNhaCungCap";

//auth
import ForgotPassword from './components/auth//ForgotPassword';
import ResetPassword from "./components/auth/ResetPassword";
import PrivateRoute from "./components/auth/PrivateRoute";
import UnauthorizedPage from "./components/auth/UnauthorizedPage";
import Login from "./components/auth/Login"; 
import DoiMatKhauPage from "./components/auth/DoiMatKhau"
import FormTaoPhieuXuatThuKho from './components/xuatkho/FormTaoPhieuXuatThuKho'

//Dashboard
import DashboardPhieuNhap from './components/dashboard/DashboardPhieuNhap';
import DashboardPhieuXuat from './components/dashboard/DashboardPhieuXuat'
import DashboardYeuCauXuatKho from './components/dashboard/DashboardYeuCauXuatKho'
import DashboardSanPham from './components/dashboard/DashboardSanPham'
import Dashboard from "./components/dashboard/Dashboard";



const App = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <Router> 
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route
                    path="/quan-ly-tai-khoan"
                    element={
                        <PrivateRoute allowedRoles={["Admin", "Thủ kho"]}>
                            <QuanLyTaiKhoan />
                        </PrivateRoute>
                    }
                />

                <Route path="/sodokho" element={<SoDoKho />} />

                <Route path="/" element={<Login />} /> 
                <Route path="/quanlyphieunhap" element={<QuanLyPhieuNhapKho />} />
>               <Route path="/sua-phieu-nhap/:id" element={<FormSuaPhieuNhap />} />
                <Route path="/them-phieu-nhap" element={<FormTaoPhieuNhap />} />
        
                <Route path="/goiyvitri" element={<GoiYViTriUI />} /> 
                <Route path="/quanlyvitri" element={<QuanLyViTri />} />
                <Route path="/sua-vitri-luutru" element={<SuaViTriLuuTru />} />

                <Route path="/quanlyphieuxuat" element={<QuanLyPhieuXuat />} />
                <Route path="/tao-phieu-xuat-kho" element={<><Navbar /><Sidebar /><FormPhieuXuat /></>} />
                <Route path="/tao-phieu-xuat" element={<FormTaoPhieuXuat />} />

                <Route path="/tao-yeu-cau-xuat-kho" element={<><Navbar /><Sidebar /><FormTaoYeuCauXuatKho /></>} />
                <Route path="/quanlyyeucauxuat" element={<><Navbar /><Sidebar /><QuanLyYeuCauXuatKho /></>} />
                <Route path="/sua-yeu-cau-xuat-kho/:id" element={<FormSuaYeuCauXuatKho />} />
                
                <Route path="/quan-ly-yeu-cau-kiem-ke" element={<QuanLyYeuCauKiemKe />} />
                <Route path="/tao-yeu-cau-kiem-ke" element={<FormTaoYeuCauKiemKe />} />
                <Route path="/quan-ly-phieu-kiem-ke" element={<QuanLyPhieuKiemKe />} />
                <Route path="/thuc-hien-kiem-ke/:idYeuCauKiemKe" element={<FormThucHienKiemKe />} />
                <Route path="/chinh-sua-yeu-cau-kiem-ke/:id" element={<FormChinhSuaYeuCauKiemKe />} />
                <Route path="/xem-phieu-kiem-ke/:idYeuCauKiemKe" element={<XemPhieuKiemKe />} />

                <Route path="/quan-ly-danh-muc" element={<QuanLyDanhMuc />} />

                <Route path="/quan-ly-san-pham" element={<QuanLySanPham />} />
                <Route path="/timkiem" element={<TrangTimKiemSanPham />} />

                <Route path="/quan-ly-dai-ly" element={<QuanLyDaiLy />} />

                <Route path="quan-ly-ncc" element={<QuanLyNhaCungCap /> } />
                <Route path="xac-nhan-tai-khoan" element={<ConfirmAccount /> } />
                <Route path="/quan-ly-ton-kho" element={<QuanLyTonKho />} />
                <Route path="/quan-ly-ton-theo-lo" element={<QuanLyTonTheoLo />} />
                <Route path="/doi-mat-khau" element={<DoiMatKhauPage userId={user.idTaiKhoan} />} />

                <Route path="/chuyen-vi-tri-san-pham" element={<ChuyenViTriSanPham />} />
                <Route path="/quan-ly-vi-tri-san-pham" element={<QuanLyViTriSanPham />} />
                <Route path="/tao-phieu-xuat-thukho" element={<FormTaoPhieuXuatThuKho />} />

                <Route path="/dashboard-phieu-nhap" element={<DashboardPhieuNhap />} />
                <Route path="/dashboard-phieu-xuat" element={<DashboardPhieuXuat />} />
                <Route path="/dashboard-yeu-cau-xuat-kho" element={<DashboardYeuCauXuatKho />} />
                <Route path="/dashboard-san-pham" element={<DashboardSanPham />} />
                <Route path="/dashboard" element={<><Navbar /><Sidebar /><Dashboard /></>} />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
