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
    }

}
