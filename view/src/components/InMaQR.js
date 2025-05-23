// ✅ InMaQR.js – Trang hiển thị mã QR sau khi lưu vị trí thành công + Nút in
import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './GoiyViTri.css';

const InMaQR = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const qrData = location.state?.qrData || [];
    const printRef = useRef();

    const canvasRefs = useRef([]);

    const handlePrint = () => {
        const imagesHTML = canvasRefs.current.map((canvas, index) => {
            if (!canvas) return '';
            const dataURL = canvas.toDataURL();
            const label = qrData[index].label || '';
            return `
            <div style="text-align: center; margin-bottom: 24px;">
                <img src="${dataURL}" width="180" height="180"/>
                <p style="margin-top: 8px;">${label}</p>
            </div>
        `;
        }).join('');

        const newWindow = window.open('', '', 'width=800,height=600');
        newWindow.document.write(`
        <html>
            <head><title>In mã QR</title></head>
            <body style="font-family: Arial, sans-serif;">
                ${imagesHTML}
            </body>
        </html>
    `);
        newWindow.document.close();
        newWindow.print();
    };


    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <div className="main-layout">
                    <Navbar />
                    <h2 className="title">📦 Mã QR sản phẩm sau khi lưu trữ</h2>
                    {qrData.map((item, index) => (
                        <div key={index} style={{ marginBottom: 30, textAlign: 'center' }}>
                            <QRCodeCanvas
                                value={item.value}
                                size={180}
                                ref={(el) => canvasRefs.current[index] = el?.children?.[0]} // Lấy <canvas> con
                            />
                            <p style={{ marginTop: 8 }}>{item.label}</p>
                        </div>
                    ))}

                    <div style={{ textAlign: 'center', marginTop: 40, display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <button onClick={handlePrint} className="btn btn-success">🖨️ In mã QR</button>
                        <button onClick={() => navigate('/quanlyphieunhap')} className="btn btn-primary">⤴️ Quay về quản lý phiếu nhập</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InMaQR;
