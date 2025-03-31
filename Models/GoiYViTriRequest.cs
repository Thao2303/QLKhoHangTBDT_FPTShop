namespace QuanLyKhoHangFPTShop.Models
{
    public class GoiYViTriRequest
    {
        public List<SanPhamCanLuu> SanPhams { get; set; }
    }

    public class SanPhamCanLuu
    {
        public int IdSanPham { get; set; }
        public int SoLuong { get; set; }
    }
}
