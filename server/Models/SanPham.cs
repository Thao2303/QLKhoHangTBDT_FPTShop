using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyKhoHangFPTShop.server.Models
{
    public class SanPham
    {
        [Key]
        public int idSanPham { get; set; }

        public string sku { get; set; }
        public string tenSanPham { get; set; }
        public string moTa { get; set; }

        public decimal khoiLuong { get; set; }

        public decimal donGiaBan { get; set; }  // ✅ Thêm vào đây

        public int idDanhMuc { get; set; }
        public int idThuongHieu { get; set; }
        public int idNhaCungCap { get; set; }
        public int idDonViTinh { get; set; }

        public int soLuongHienCon { get; set; } = 0;
        public int soLuongToiThieu { get; set; } = 0;

        public string mauSac { get; set; }

        public DateTime? ngaySanXuat { get; set; } // ✅ Cho nullable

        public decimal? chieuDai { get; set; }  // ✅ Cho nullable
        public decimal? chieuRong { get; set; }
        public decimal? chieuCao { get; set; }
        public string? hinhAnh { get; set; }
      

        [ForeignKey("idDonViTinh")]
        public DonViTinh DonViTinh { get; set; }



        [ForeignKey("idDanhMuc")]
        public DanhMuc DanhMuc { get; set; }

        [ForeignKey("idThuongHieu")]
        public ThuongHieu ThuongHieu { get; set; }

        [ForeignKey("idNhaCungCap")]
        public NhaCungCap NhaCungCap { get; set; }
    }

}
