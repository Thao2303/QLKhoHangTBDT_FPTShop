namespace QLKhoHangFPTShop.Models
{
    public class SanPhamDto
    {
        public int IdSanPham { get; set; }
        public int SoLuong { get; set; }

        // Thêm 3 thuộc tính kích thước:
        public decimal? ChieuDai { get; set; }
        public decimal? ChieuRong { get; set; }
        public decimal? ChieuCao { get; set; }
    }
}
