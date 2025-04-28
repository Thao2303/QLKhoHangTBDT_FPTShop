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

        [ForeignKey("NguoiThucHien")]
        public int idNguoiThucHien { get; set; }
        public TaiKhoan NguoiThucHien { get; set; }

        [ForeignKey("YeuCauKiemKe")]
        public int idYeuCauKiemKe { get; set; }
        public YeuCauKiemKe YeuCauKiemKe { get; set; }

        public DateTime ngayKiemKe { get; set; }
        public DateTime thoiGianThucHien { get; set; }  // 🆕 Thuộc tính bạn thiếu

        public string? ghiChu { get; set; }
        public string? tenTruongBan { get; set; }
        public string? chucVuTruongBan { get; set; }
        public string? tenUyVien1 { get; set; }
        public string? chucVuUyVien1 { get; set; }
        public string? tenUyVien2 { get; set; }
        public string? chucVuUyVien2 { get; set; }
        public string? mucDich { get; set; }
        public string? viTriKiemKe { get; set; }


        public ICollection<ChiTietKiemKe> ChiTietKiemKe { get; set; } = new List<ChiTietKiemKe>();
    }

    public class ChiTietKiemKe
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // ✅ THÊM DÒNG NÀY
        public int id { get; set; }

        [ForeignKey("KiemKe")]
        public int idKiemKe { get; set; }
        public KiemKe KiemKe { get; set; }

        [ForeignKey("SanPham")]
        public int idSanPham { get; set; }
        public SanPham SanPham { get; set; }

        public int soLuongThucTe { get; set; }
        public int soLuongTheoHeThong { get; set; }
        public string? phamChat { get; set; }
    }



}
