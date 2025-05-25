import React, { useEffect, useState } from "react";
import PopupChiTietYeuCau from "./PopupChiTietYeuCau";
import "./popup-style.css";

const PopupChonYeuCau = ({ onChon, onClose }) => {
    const [danhSach, setDanhSach] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchMaYC, setSearchMaYC] = useState("");
    const [searchDaiLy, setSearchDaiLy] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [popupData, setPopupData] = useState(null);
    const [tonKhoMap, setTonKhoMap] = useState({});

    useEffect(() => {
        const fetchYeuCau = async () => {
            try {
                const res = await fetch("https://qlkhohangtbdt-fptshop-be2.onrender.com/api/yeucauxuatkho");
                const all = await res.json();
                const chuaDuyet = all.filter(yc => yc.idTrangThaiXacNhan === 1);
                setDanhSach(chuaDuyet);
            } catch (err) {
                console.error("Lỗi khi tải yêu cầu:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchYeuCau();
    }, []);

    const handleXemChiTiet = async (yc) => {
        try {
            const res = await fetch(`https://qlkhohangtbdt-fptshop-be2.onrender.com/api/yeucauxuatkho/chitiet/${yc.idYeuCauXuatKho}`);
            const chiTiet = await res.json();
            yc.chiTietYeuCauXuatKhos = chiTiet;

            const tonMap = {};
            for (const ct of chiTiet) {
                try {
                    const resTon = await fetch(`https://qlkhohangtbdt-fptshop-be2.onrender.com/api/yeucauxuatkho/tonkho/${ct.idSanPham}`);
                    tonMap[ct.idSanPham] = await resTon.json();
                } catch {
                    tonMap[ct.idSanPham] = "Lỗi";
                }
            }

            setTonKhoMap(tonMap);
            setPopupData(yc);
        } catch {
            alert("Không thể tải chi tiết yêu cầu.");
        }
    };

    const locDanhSach = danhSach.filter((yc) => {
        const maYC = yc.idYeuCauXuatKho.toString().includes(searchMaYC);
        const tenDL = (yc.daiLy?.tenDaiLy || "").toLowerCase().includes(searchDaiLy.toLowerCase());
        const ngayYeuCau = new Date(yc.ngayYeuCau);
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        const matchFrom = !from || ngayYeuCau >= from;
        const matchTo = !to || ngayYeuCau <= to;

        return maYC && tenDL && matchFrom && matchTo;
    });

    return (
        <div className="popup-overlay">
            <div className="popup-box">
                <h2 className="title">📋 Chọn yêu cầu xuất kho</h2>

                <div className="filter-bar">
                    <input
                        type="text"
                        placeholder="🔍 Mã yêu cầu"
                        value={searchMaYC}
                        onChange={(e) => setSearchMaYC(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="🏢 Tên đại lý"
                        value={searchDaiLy}
                        onChange={(e) => setSearchDaiLy(e.target.value)}
                    />
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                </div>

                {isLoading ? (
                    <p>⏳ Đang tải dữ liệu...</p>
                ) : locDanhSach.length === 0 ? (
                    <p>Không có yêu cầu phù hợp.</p>
                ) : (
                    <div style={{ maxHeight: 400, overflowY: "auto" }}>
                        {locDanhSach.map((yc) => (
                            <div key={yc.idYeuCauXuatKho} className="yeu-cau-item">
                                <div><strong>#{yc.idYeuCauXuatKho}</strong> - {yc.daiLy?.tenDaiLy}</div>
                                <div style={{ fontSize: "0.85em", color: "#444" }}>
                                    📍 {yc.diaChi}<br />
                                    🕒 {new Date(yc.ngayYeuCau).toLocaleString()}<br />
                                    📌 {yc.lyDoXuat}
                                </div>
                                <div style={{ marginTop: 6 }}>
                                    <button className="btn btn-primary" onClick={() => onChon(yc)}>✅ Chọn</button>
                                    <button className="btn btn-secondary" onClick={() => handleXemChiTiet(yc)}>🔍 Xem chi tiết</button>
                                </div>
                                <hr />
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ marginTop: 16, textAlign: "right" }}>
                    <button onClick={onClose} className="btn btn-cancel">Đóng</button>
                </div>
            </div>

            {popupData && (
                <PopupChiTietYeuCau
                    data={popupData}
                    tonKhoMap={tonKhoMap}
                    onClose={() => setPopupData(null)}
                    onTaoPhieu={(yc) => {
                        onChon(yc);
                        setPopupData(null);
                    }}
                />
            )}
        </div>
    );
};

export default PopupChonYeuCau;
