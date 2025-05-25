// 📁 Dtos/YeuCauKiemKeTaoDto.cs
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace QuanLyKhoHangFPTShop.server.Dtos
{
    public class YeuCauKiemKeTaoDto
    {
        [Required]
        public string mucDich { get; set; } = string.Empty;

        [Required]
        public string viTriKiemKe { get; set; } = string.Empty;

        public string? tenTruongBan { get; set; }
        public string? tenUyVien1 { get; set; }
        public string? tenUyVien2 { get; set; }
        public string? ghiChu { get; set; }
        public int? nguoiTao { get; set; }
        public DateTime ngayTao { get; set; } = DateTime.Now;

        public List<ChiTietYeuCauKiemKeTaoDto> chiTietYeuCau { get; set; } = new();
    }

    public class ChiTietYeuCauKiemKeTaoDto
    {
        [Required]
        public int idSanPham { get; set; }
    }
    public class KiemKeTaoRequestDto
    {
        public int idYeuCauKiemKe { get; set; }
        public int idNguoiThucHien { get; set; }
        public DateTime? ngayKiemKe { get; set; }
        public string? ghiChu { get; set; }
        public List<ChiTietKiemKeTaoRequestDto> chiTiet { get; set; } = new();
    }

    public class ChiTietKiemKeTaoRequestDto
    {
        public int idSanPham { get; set; }
        public int soLuongThucTe { get; set; }
        public string? phamChat { get; set; }
        public int idViTri { get; set; }
    }
}