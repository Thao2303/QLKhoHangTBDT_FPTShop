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

        public DateTime ngayTao { get; set; } = DateTime.Now;

        [MaxLength(100)]
        public string? mucDich { get; set; }

        [MaxLength(100)]
        public string? viTriKiemKe { get; set; }

        [MaxLength(255)]
        public string? ghiChu { get; set; }

        public int trangThai { get; set; } = 0; // 0: Chưa thực hiện, 1: Đã kiểm, 2: Lệch, 3: Đã xử lý

        public int? nguoiTao { get; set; }

        [MaxLength(100)] public string? tenTruongBan { get; set; }
        [MaxLength(100)] public string? tenUyVien1 { get; set; }
        [MaxLength(100)] public string? tenUyVien2 { get; set; }
        [ForeignKey("nguoiTao")]
        public TaiKhoan? NguoiTaoTaiKhoan { get; set; }

        public ICollection<ChiTietYeuCauKiemKe> ChiTietYeuCau { get; set; } = new List<ChiTietYeuCauKiemKe>();
    }

    public class ChiTietYeuCauKiemKe
    {
        [Key]
        [Column(Order = 0)]
        public int idYeuCauKiemKe { get; set; }

        [Key]
        [Column(Order = 1)]
        public int idSanPham { get; set; }

        public SanPham SanPham { get; set; }
        public YeuCauKiemKe YeuCauKiemKe { get; set; }
    }




}
