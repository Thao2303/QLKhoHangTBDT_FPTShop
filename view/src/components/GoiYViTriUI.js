import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; // 👈 THÊM

import Navbar from './Navbar';
import Sidebar from './Sidebar';
import "./GoiYViTri.css"

const GoiYViTriUI = () => {
    const location = useLocation(); // 👈 LẤY state từ navigate
    const sanPhams = location.state?.sanPhams || [];

    const [goiY, setGoiY] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (sanPhams && sanPhams.length > 0) {
            setLoading(true);
            axios.post('https://localhost:5288/api/goiyvitri', { sanPhams })
                .then(res => setGoiY(res.data))
                .catch(err => console.error('Lỗi gợi ý:', err))
                .finally(() => setLoading(false));
        }
    }, [sanPhams]);

    return (
        <div className="main-layout">
            <Sidebar />
            <div className="content-area">
                <Navbar />
                <div className="goi-y-container">
                    <h2>📦 Gợi ý vị trí lưu trữ hàng hóa</h2>
                    {loading ? <p>Đang xử lý gợi ý...</p> : (
                        <div className="goi-y-list">
                            {goiY.map((sp, index) => (
                                <div key={index} className="goi-y-card">
                                    <h3>{sp.tenSanPham} ({sp.soLuong} {sp.donViTinh})</h3>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Dãy</th>
                                                <th>Tầng</th>
                                                <th>Cột</th>
                                                <th>Số lượng</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sp.viTriDeXuat.map((vt, i) => (
                                                <tr key={i}>
                                                    <td>{vt.day}</td>
                                                    <td>{vt.tang}</td>
                                                    <td>{vt.cot}</td>
                                                    <td>{vt.soLuong}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GoiYViTriUI;
