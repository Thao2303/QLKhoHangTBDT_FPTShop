using System.ComponentModel.DataAnnotations;

namespace QuanLyKhoHangFPTShop.server.Dtos
{
    public class ChiTietLuuTruDto
    {
        [Required]
        public int idSanPham { get; set; }

        [Required]
        public int idViTri { get; set; }

        [Required]
        public int soLuong { get; set; }

        public DateTime thoiGianLuu { get; set; }
        public int idPhieuNhap { get; set; }
        // ❌ KHÔNG cần thêm navigation property như dưới đây nếu không dùng:
        // public ViTri ViTri { get; set; }
        // public SanPham SanPham { get; set; }
    }
}
