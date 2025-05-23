namespace QuanLyKhoHangFPTShop.server.Dtos
{
    public class PhieuNhapUpdateDto
    {
        public int idPhieuNhap { get; set; }
        public DateTime? ngayNhap { get; set; }

        public List<ChiTietPhieuNhapUpdateDto> chiTietPhieuNhaps { get; set; }
    }

    public class ChiTietPhieuNhapUpdateDto
    {
        public int idSanPham { get; set; }
        public int soLuong { get; set; }
        public decimal donGia { get; set; }
        public string? ghiChu { get; set; }
        public string nguoiGiaoHang { get; set; }
    }

}
