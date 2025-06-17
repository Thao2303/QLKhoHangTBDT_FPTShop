using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyKhoHangFPTShop.server.Models
{
    [Table("CHITIETLUUTRU")]
    public class ChiTietLuuTru
    {
        [Key]
        public int idChiTietLuuTru { get; set; }

        public int idSanPham { get; set; }

        public int idViTri { get; set; }

        public int? idLoHang { get; set; }

        public int soLuong { get; set; }

        public DateTime thoiGianLuu { get; set; }
        public int idPhieuNhap { get; set; }

        [ForeignKey("idPhieuNhap")]
        public PhieuNhap PhieuNhap { get; set; }

        [ForeignKey("idSanPham")]
        public SanPham SanPham { get; set; }

        [ForeignKey("idViTri")]
        public ViTri ViTri { get; set; }

        [ForeignKey("idLoHang")]
        public LoHang LoHang { get; set; }
    }
}
