import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import Router
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login"; // Import trang Login
import QuanLyPhieuNhapKho from "./components/QuanLyPhieuNhapKho";
import FormTaoPhieuNhap from './components/FormTaoPhieuNhap';
import QuanLyTaiKhoan from './components/QuanLyTaiKhoan';
import GoiYViTriUI from './components/GoiyViTri'; // 👈 Import thêm
import "./App.css";


const App = () => {
    return (
        <Router> {/* Bao quanh toàn bộ các route với Router */}
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<><Navbar /><Sidebar /><Dashboard /></>} />
                <Route path="/" element={<Login />} /> {/* Trang mặc định sẽ là Login */}
                <Route path="/quanlyphieunhap" element={<><Navbar /><Sidebar /><QuanLyPhieuNhapKho /></>} />
                <Route path="/them-phieu-nhap" element={<FormTaoPhieuNhap />} />
                <Route path="/quan-ly-tai-khoan" element={<QuanLyTaiKhoan />} />
                <Route path="/goiyvitri" element={<GoiYViTriUI />} /> {/* 👈 Route mới */}

            </Routes>
        </Router>
    );
};

export default App;
