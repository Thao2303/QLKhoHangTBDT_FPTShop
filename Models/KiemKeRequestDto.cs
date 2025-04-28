using System.ComponentModel.DataAnnotations;

namespace QuanLyKhoHangFPTShop.DTOs
{
    public class KiemKeRequestDto
    {
        public int idYeuCauKiemKe { get; set; }
        public string? mucDich { get; set; }
        public string? viTriKiemKe { get; set; }

        public string? tenTruongBan { get; set; }
        public string? chucVuTruongBan { get; set; }
        public string? tenUyVien1 { get; set; }
        public string? chucVuUyVien1 { get; set; }
        public string? tenUyVien2 { get; set; }
        public string? chucVuUyVien2 { get; set; }

        public string? ghiChu { get; set; }
        public DateTime? ngayKiemKe { get; set; }

        public List<ChiTietKiemKeDto> chiTiet { get; set; } = new List<ChiTietKiemKeDto>();
    }

    public class ChiTietKiemKeDto
    {
        public int idSanPham { get; set; }
        public int soLuongThucTe { get; set; }
        public string? phamChat { get; set; }
    }
}
