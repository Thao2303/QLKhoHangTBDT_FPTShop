// 📁 Models/YeuCauKiemKe.cs
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyKhoHangFPTShop.Models
{
    public class YeuCauKiemKe
    {
        [Key]
        public int idYeuCauKiemKe { get; set; }

        [ForeignKey("NguoiTao")]
        public int idNguoiTao { get; set; }
        public TaiKhoan? NguoiTao { get; set; }

        public DateTime thoiGianTao { get; set; }
        public int trangThai { get; set; } = 1; // 1: Chờ duyệt, 2: Đã duyệt
        public string? ghiChu { get; set; }

        public List<ChiTietYeuCauKiemKe>? ChiTiet { get; set; }
    }

    public class ChiTietYeuCauKiemKe
    {
        [ForeignKey("YeuCauKiemKe")]
        public int idYeuCauKiemKe { get; set; }
        public YeuCauKiemKe? YeuCauKiemKe { get; set; }

        [ForeignKey("SanPham")]
        public int idSanPham { get; set; }
        public SanPham? SanPham { get; set; }
    }
}
