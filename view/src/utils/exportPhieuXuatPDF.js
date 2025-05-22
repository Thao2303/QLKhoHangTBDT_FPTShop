
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "../fonts/Roboto-Regular";

export const exportPhieuXuatPDF = (phieu) => {
    const doc = new jsPDF();
    doc.setFont("Roboto");

    doc.setFontSize(16);
    doc.text("PHIẾU XUẤT KHO", 105, 20, { align: "center" });
    doc.setFontSize(11);
    doc.text(`Mã phiếu: ${phieu.idPhieuXuat}`, 15, 30);
    doc.text(`Ngày xuất: ${new Date(phieu.ngayXuat).toLocaleDateString("vi-VN")}`, 150, 30);
    doc.text(`Đơn vị nhận: ${phieu.yeuCauXuatKho?.daiLy?.tenDaiLy || ""}`, 15, 40);
    doc.text(`Lý do xuất: ${phieu.yeuCauXuatKho?.lyDoXuat || ""}`, 15, 48);
    doc.text(`Phương tiện: ${phieu.yeuCauXuatKho?.phuongThucVanChuyen || ""}`, 15, 56);
    doc.text(`Ghi chú: ${phieu.ghiChu || "Không có"}`, 15, 64);

    autoTable(doc, {
        startY: 72,
        head: [[
            "STT", "Tên sản phẩm", "Mã số", "Đơn vị", "Số lượng", "Đơn giá", "Thành tiền"
        ]],
        body: phieu.chiTietPhieuXuats?.map((ct, idx) => ([
            idx + 1,
            ct.sanPham?.tenSanPham || "—",
            ct.sanPham?.maSanPham || "",
            ct.sanPham?.donViTinh || "cái",
            (ct.soLuong ?? 0).toLocaleString("vi-VN"),
            (ct.donGia ?? 0).toLocaleString("vi-VN"),
            (ct.thanhTien ?? 0).toLocaleString("vi-VN"),
        ])) || [],
        theme: "grid",
        styles: { font: "Roboto", fontSize: 10, halign: "center" },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 }
    });

    const total = phieu.chiTietPhieuXuats?.reduce((acc, ct) => acc + (ct.thanhTien ?? 0), 0) || 0;
    doc.setFontSize(12);
    doc.text(`Tổng cộng: ${total.toLocaleString("vi-VN")} VNĐ`, 150, doc.lastAutoTable.finalY + 10);

    const y = doc.lastAutoTable.finalY + 30;
    doc.text("Người lập phiếu", 25, y);
    doc.text("Người giao hàng", 95, y);
    doc.text("Người nhận hàng", 155, y);

    doc.save(`phieu_xuat_${phieu.idPhieuXuat}.pdf`);
};
