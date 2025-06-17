namespace QuanLyKhoHangFPTShop.server.Dtos

{
    public class PhieuXuatDTO
    {
        public int? IdYeuCauXuatKho { get; set; }  // ✅ Cho phép null

        public DateTime NgayXuat { get; set; }
        public string? GhiChu { get; set; }
        public string? NguoiTao { get; set; }

        public List<ChiTietPhieuXuatDTO> ChiTietPhieuXuats { get; set; } = new();
    }

    public class ChiTietPhieuXuatDTO
    {
        public int IdSanPham { get; set; }
        public int IdViTri { get; set; }
        public int SoLuong { get; set; }

        // ✅ Các trường liên quan đến giá bán
        public decimal? DonGiaXuat { get; set; }        // Giá gốc tại thời điểm xuất
        public decimal? ChietKhau { get; set; }          // Phần trăm chiết khấu (VD: 5%)
        public decimal? GiaSauChietKhau { get; set; }   // Giá thực tế sau chiết khấu
    }


}
