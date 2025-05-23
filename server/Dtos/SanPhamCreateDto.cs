namespace QuanLyKhoHangFPTShop.server.Dtos
{
    public class SanPhamCreateDto
    {
        public string sku { get; set; }
        public string tenSanPham { get; set; }
        public string moTa { get; set; }
        public decimal khoiLuong { get; set; }
        public decimal donGiaBan { get; set; }

        public int idDanhMuc { get; set; }
        public int idThuongHieu { get; set; }
        public int idNhaCungCap { get; set; }
        public int idDonViTinh { get; set; }

        public int soLuongHienCon { get; set; }
        public int soLuongToiThieu { get; set; }

        public string mauSac { get; set; }
        public DateTime? ngaySanXuat { get; set; }

        public decimal? chieuDai { get; set; }
        public decimal? chieuRong { get; set; }
        public decimal? chieuCao { get; set; }
        public string? hinhAnh { get; set; }

    }


}
