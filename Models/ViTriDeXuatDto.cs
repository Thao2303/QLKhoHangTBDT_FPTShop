namespace QuanLyKhoHangFPTShop.Models
{
    public class ViTriDeXuatDto
    {
        public int IdSanPham { get; set; }
        public string TenSanPham { get; set; }
        public string DonViTinh { get; set; }
        public int SoLuong { get; set; }

        public List<DeXuatViTri> ViTriDeXuat { get; set; }
    }

    public class DeXuatViTri
    {
        public string Day { get; set; }
        public int Tang { get; set; }
        public int Cot { get; set; }
        public int SoLuong { get; set; }
    }
}
