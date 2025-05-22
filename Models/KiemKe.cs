using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyKhoHangFPTShop.Models
{
    public class KiemKe
    {
        [Key]
        public int idKiemKe { get; set; }

        [ForeignKey("YeuCauKiemKe")]
        public int idYeuCauKiemKe { get; set; }
        public YeuCauKiemKe YeuCauKiemKe { get; set; }

        public int idNguoiThucHien { get; set; }

        public DateTime ngayKiemKe { get; set; }
        public DateTime thoiGianThucHien { get; set; } = DateTime.Now;

        public string? ghiChu { get; set; }
        public int trangThai { get; set; } = 0;
        public ICollection<ChiTietKiemKe> ChiTietKiemKe { get; set; } = new List<ChiTietKiemKe>();
    }

    public class ChiTietKiemKe
    {
        [Key, Column(Order = 0)]
        public int idKiemKe { get; set; }

        [Key, Column(Order = 1)]
        public int idSanPham { get; set; }

        [Key, Column(Order = 2)] // ✅ Thêm dòng này để tránh trùng
        public int idViTri { get; set; }

        public int soLuongThucTe { get; set; }
        public int soLuongTheoHeThong { get; set; }

        public string? phamChat { get; set; }

        [NotMapped]
        public int chenhLech => soLuongThucTe - soLuongTheoHeThong;

        [ForeignKey("idSanPham")]
        public SanPham SanPham { get; set; }

        [ForeignKey("idKiemKe")]
        public KiemKe KiemKe { get; set; }

        [ForeignKey("idViTri")]
        public ViTri ViTri { get; set; }
    }




}
