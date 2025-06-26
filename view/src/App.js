import React, { useEffect } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import "./App.css";

import { connectSignalR } from './components/common/signalrClient';
import Navbar from './components/common/Navbar/Navbar';
import Sidebar from "./components/common/Sidebar/Sidebar";

//Phiếu nhập
import QuanLyPhieuNhapKho from "./components/nhapkho/QuanLyPhieuNhapKho";
import FormTaoPhieuNhap from './components/nhapkho/FormTaoPhieuNhap';

//Tài khoản
import QuanLyTaiKhoan from './components/taikhoan/QuanLyTaiKhoan';
import ConfirmAccount from './components/auth/ConfirmAccount';
import Logout from "./components/auth/Logout";
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
import DashboardDaiLy from "./components/daily/DashboardDaiLy"
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
import AutoLogout from "./components/auth/AutoLogout";

//Dashboard
import DashboardPhieuNhap from './components/dashboard/DashboardPhieuNhap';
import DashboardPhieuXuat from './components/dashboard/DashboardPhieuXuat'
import DashboardYeuCauXuatKho from './components/dashboard/DashboardYeuCauXuatKho'
import DashboardSanPham from './components/dashboard/DashboardSanPham'
import Dashboard from "./components/dashboard/Dashboard";

import RequireAuth from "./components/auth/RequireAuth";


const App = () => {
    let user = null;
    try {
        const userRaw = localStorage.getItem("user");
        if (userRaw) user = JSON.parse(userRaw);
    } catch (e) {
        console.warn("Lỗi parse localStorage:", e);
    }

    useEffect(() => {
        connectSignalR((data) => {
            alert(`🔔 ${data.noiDung}`);
            // 👉 Có thể dispatch Redux hoặc gọi fetch lại ở từng trang nếu cần
        });
    }, []);
    return (
        <Router> 
            <AutoLogout />
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
                <Route path="/quanlyphieunhap" element={<PrivateRoute allowedRoles={["Nhân viên", "Thủ kho"]}> <QuanLyPhieuNhapKho /> </PrivateRoute> } />
>               <Route path="/sua-phieu-nhap/:id" element={<PrivateRoute allowedRoles={["Nhân viên", "Thủ kho"]}> <FormSuaPhieuNhap /> </PrivateRoute> } />
                <Route path="/them-phieu-nhap" element={<PrivateRoute allowedRoles={["Nhân viên", "Thủ kho"]}><FormTaoPhieuNhap /> </PrivateRoute>} />
        
                <Route path="/goiyvitri" element={<PrivateRoute allowedRoles={["Nhân viên", "Thủ kho"]}><GoiYViTriUI /> </PrivateRoute> } /> 
                <Route path="/quanlyvitri" element={<PrivateRoute allowedRoles={["Nhân viên", "Thủ kho"]}><QuanLyViTri /> </PrivateRoute> } />
                <Route path="/sua-vitri-luutru" element={<PrivateRoute allowedRoles={["Nhân viên", "Thủ kho"]}><SuaViTriLuuTru /></PrivateRoute>} />

                <Route path="/quanlyphieuxuat" element={<PrivateRoute allowedRoles={["Đại lý bán hàng","Giám đốc đại lý", "Nhân viên", "Thủ kho"]}><QuanLyPhieuXuat /></PrivateRoute>} />
                <Route path="/tao-phieu-xuat-kho" element={<PrivateRoute allowedRoles={[ "Thủ kho"]}><><Navbar /><Sidebar /><FormPhieuXuat /></></PrivateRoute>} />
                <Route path="/tao-phieu-xuat" element={<PrivateRoute allowedRoles={["Thủ kho"]}><FormTaoPhieuXuat /></PrivateRoute>} />

                <Route path="/tao-yeu-cau-xuat-kho" element={<PrivateRoute allowedRoles={["Đại lý bán hàng", "Giám đốc đại lý", "Nhân viên", "Thủ kho"]}><><Navbar /><Sidebar /><FormTaoYeuCauXuatKho /></></PrivateRoute>} />
                <Route path="/quanlyyeucauxuat" element={<PrivateRoute allowedRoles={["Đại lý bán hàng", "Giám đốc đại lý", "Nhân viên", "Thủ kho"]}><><Navbar /><Sidebar /><QuanLyYeuCauXuatKho /></></PrivateRoute>} />
                <Route path="/sua-yeu-cau-xuat-kho/:id" element={<PrivateRoute allowedRoles={["Đại lý bán hàng", "Giám đốc đại lý", "Nhân viên", "Thủ kho"]}><FormSuaYeuCauXuatKho /></PrivateRoute>} />
                
                <Route path="/quan-ly-yeu-cau-kiem-ke" element={<PrivateRoute allowedRoles={["Nhân viên", "Thủ kho"]}><QuanLyYeuCauKiemKe /></PrivateRoute>} />
                <Route path="/tao-yeu-cau-kiem-ke" element={<PrivateRoute allowedRoles={["Thủ kho"]}><FormTaoYeuCauKiemKe /></PrivateRoute>} />
                <Route path="/quan-ly-phieu-kiem-ke" element={<PrivateRoute allowedRoles={["Nhân viên", "Thủ kho"]}><QuanLyPhieuKiemKe /></PrivateRoute>} />
                <Route path="/thuc-hien-kiem-ke/:idYeuCauKiemKe" element={<PrivateRoute allowedRoles={["Nhân viên", "Thủ kho"]}><FormThucHienKiemKe /></PrivateRoute>} />
                <Route path="/chinh-sua-yeu-cau-kiem-ke/:id" element={<PrivateRoute allowedRoles={["Thủ kho"]}><FormChinhSuaYeuCauKiemKe /></PrivateRoute>} />
                <Route path="/xem-phieu-kiem-ke/:idYeuCauKiemKe" element={<PrivateRoute allowedRoles={["Nhân viên", "Thủ kho"]}><XemPhieuKiemKe /></PrivateRoute>} />
                <Route path="/phieu-kiem-ke/:id" element={<PrivateRoute allowedRoles={["Nhân viên", "Thủ kho"]}><XemPhieuKiemKe /></PrivateRoute>} />
                <Route path="/xem-phieu-kiem-ke/:idYeuCauKiemKe" element={<PrivateRoute allowedRoles={["Nhân viên", "Thủ kho"]}><XemPhieuKiemKe /></PrivateRoute>} />

                <Route path="/quan-ly-danh-muc" element={<PrivateRoute allowedRoles={["Nhân viên", "Thủ kho"]}><QuanLyDanhMuc /></PrivateRoute>} />

                <Route path="/quan-ly-san-pham" element={<PrivateRoute allowedRoles={["Nhân viên", "Thủ kho"]}><QuanLySanPham /></PrivateRoute>} />
                <Route path="/timkiem" element={<TrangTimKiemSanPham />} />

                <Route path="/quan-ly-dai-ly" element={<PrivateRoute allowedRoles={["Thủ kho"]}><QuanLyDaiLy /></PrivateRoute>} />
                <Route
                    path="/dashboard-dai-ly"
                    element={
                        <PrivateRoute allowedRoles={["Đại lý bán hàng", "Giám đốc đại lý", "Thủ kho"]}>
                            <DashboardDaiLy currentUser={user} />
                        </PrivateRoute>
                    }
                />


                <Route path="quan-ly-ncc" element={<PrivateRoute allowedRoles={["Thủ kho"]}><QuanLyNhaCungCap /> </PrivateRoute>} />
                <Route path="xac-nhan-tai-khoan" element={<ConfirmAccount /> } />
                <Route path="/quan-ly-ton-kho" element={<PrivateRoute allowedRoles={["Nhân viên", "Thủ kho"]}><QuanLyTonKho /></PrivateRoute>} />
                <Route path="/quan-ly-ton-theo-lo" element={<PrivateRoute allowedRoles={["Nhân viên", "Thủ kho"]}><QuanLyTonTheoLo /></PrivateRoute>} />
                <Route path="/doi-mat-khau" element={
                    user ? <DoiMatKhauPage userId={user.idTaiKhoan} /> : <Login />
                } />


                <Route path="/chuyen-vi-tri-san-pham" element={<PrivateRoute allowedRoles={["Nhân viên", "Thủ kho"]}><ChuyenViTriSanPham /></PrivateRoute>} />
                <Route path="/quan-ly-vi-tri-san-pham" element={<PrivateRoute allowedRoles={["Nhân viên", "Thủ kho"]}><QuanLyViTriSanPham /></PrivateRoute>} />
                <Route path="/tao-phieu-xuat-thukho" element={<PrivateRoute allowedRoles={["Thủ kho"]}><FormTaoPhieuXuatThuKho /></PrivateRoute>} />
                <Route path="/logout" element={<Logout />} />

                <Route path="/dashboard-phieu-nhap" element={<PrivateRoute allowedRoles={["Nhân viên", "Thủ kho"]}><DashboardPhieuNhap /></PrivateRoute>} />
                <Route path="/dashboard-phieu-xuat" element={<PrivateRoute allowedRoles={["Đại lý bán hàng", "Giám đốc đại lý", "Nhân viên", "Thủ kho"]}><DashboardPhieuXuat /></PrivateRoute>} />
                <Route path="/dashboard-yeu-cau-xuat-kho" element={<PrivateRoute allowedRoles={["Đại lý bán hàng", "Giám đốc đại lý", "Nhân viên", "Thủ kho"]}><DashboardYeuCauXuatKho /></PrivateRoute>} />
                <Route path="/dashboard-san-pham" element={<PrivateRoute allowedRoles={["Đại lý bán hàng", "Giám đốc đại lý", "Nhân viên", "Thủ kho"]}><DashboardSanPham /></PrivateRoute>} />
                <Route path="/dashboard" element={
                    <RequireAuth>
                        <><Navbar /><Sidebar /><Dashboard /></>
                    </RequireAuth>
                } />

            </Routes>
        </Router>
    );
};

export default App;
