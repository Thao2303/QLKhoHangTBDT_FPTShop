// ✅ SƠ ĐỒ KHO - Hỗ trợ highlight vị trí theo sản phẩm
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tooltip } from "react-tooltip";
import "./SoDoKho.css";
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const SoDoKho = ({ highlightedIds = [] }) => {
    const [vitri, setVitri] = useState([]);
    const [grouped, setGrouped] = useState({});
    const [sanPhamTheoViTri, setSanPhamTheoViTri] = useState({});

    useEffect(() => {
        axios.get("https://localhost:5288/api/vitri")
            .then(res => {
                setVitri(res.data || []);
                const group = {};
                (res.data || []).forEach(v => {
                    if (!group[v.day]) group[v.day] = [];
                    group[v.day].push(v);
                });
                setGrouped(group);
            })
            .catch(err => console.error("Lỗi lấy vị trí:", err));

        axios.get("https://localhost:5288/api/phieunhap/luu-tru")
            .then(res => {
                const map = {};
                (res.data || []).forEach(ct => {
                    if (!map[ct.idViTri]) map[ct.idViTri] = [];
                    map[ct.idViTri].push(ct);
                });
                setSanPhamTheoViTri(map);
            })
            .catch(err => console.error("Lỗi lấy chi tiết lưu trữ:", err));
    }, []);

    const getColor = (viTri) => {
        const tile = viTri.sucChua - viTri.daDung;
        const percent = tile / viTri.sucChua;
        if (percent > 0.5) return "green";
        if (percent > 0.2) return "lightblue";
        return "red";
    };

    const getTooltipContent = (viTri) => {
        const products = sanPhamTheoViTri[viTri.idViTri] || [];
        const percentUsed = ((viTri.daDung / viTri.sucChua) * 100).toFixed(1);

        const groupedProducts = {};
        for (const p of products) {
            const key = p.idSanPham;
            if (!groupedProducts[key]) {
                groupedProducts[key] = {
                    tenSanPham: p.sanPham?.tenSanPham || `SP #${p.idSanPham}`,
                    soLuong: 0
                };
            }
            groupedProducts[key].soLuong += p.soLuong;
        }

        const productList = Object.values(groupedProducts)
            .map(p => `<div class="tt-item"><span>${p.tenSanPham}</span><span>${p.soLuong}</span></div>`)
            .join('');

        return `
        <div class="tt-wrapper">
            <div class="tt-header"><strong>Dung tích:</strong> ${viTri.daDung}/${viTri.sucChua} cm³ (${percentUsed}%)</div>
            ${productList ? `<div class="tt-body"><strong>SP lưu trữ:</strong>${productList}</div>` : ''}
        </div>
    `;
    };

    const sortByCotTang = (a, b) => a.cot - b.cot || a.tang - b.tang;

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <div className="content-area">
                <div className="main-layout">
                    <div className="container" >
                        <h2 style={{ textAlign: 'center', marginBottom: 30, color: '#333' }}>Sơ đồ kho hàng FPT Shop</h2>
                    <Navbar />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div className="note-box">
                            <h4>Ghi chú sơ đồ</h4>
                            <div className="legend">
                                <div><span className="green box" /> Còn &gt; 50%</div>
                                <div><span className="lightblue box" /> Còn 20–50%</div>
                                <div><span className="red box" /> Còn &lt; 20%</div>
                            </div>
                            <div style={{ textAlign: 'left', fontSize: 13 }}>
                                <p><strong>Mã vị trí:</strong> A-1-1</p>
                                <p><strong>Ý nghĩa:</strong> Dãy A - Cột 1 - Tầng 1</p>
                            </div>
                        </div>
                    </div>
                    <div className="sodokho-container2" style={{ textAlign: 'center' }}>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'  // 👈 Căn giữa các khối
                            }}
                        >

                            <div>
                                <div className="area-label">Khu vực soạn hàng</div>
                                <div className="kho-wrapper-horizontal">
                                    {Object.entries(grouped).sort().map(([day, items], idx) => (
                                        <div className="kho-row" key={idx}>
                                            <div className="day-label">Dãy {day}</div>
                                            <div className="kho-row-items">
                                                {items.sort(sortByCotTang).map((vt, i) => (
                                                    <div
                                                        key={i}
                                                        className={`vitri-cell ${getColor(vt)} ${highlightedIds.includes(vt.idViTri) ? 'highlighted' : ''}`}
                                                        data-tooltip-id={`tooltip-${vt.idViTri}`}
                                                        data-tooltip-html={getTooltipContent(vt)}
                                                    >
                                                        {vt.day}-{vt.cot}-{vt.tang}
                                                        <Tooltip id={`tooltip-${vt.idViTri}`} place="top" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="area-label">Khu vực hàng chờ xuất</div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default SoDoKho;