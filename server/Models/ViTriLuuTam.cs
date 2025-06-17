using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyKhoHangFPTShop.server.Models
{
    [Table("VITRILUUTAM")]
    public class ViTriLuuTam
    {
        [Key]
        public int idViTriLuuTam { get; set; }

        public int idPhieuNhap { get; set; }
        public int idSanPham { get; set; }
        public int idViTri { get; set; }

        public int soLuong { get; set; }

        // ✅ Các điều hướng và ForeignKey
        [ForeignKey("idPhieuNhap")]
        public PhieuNhap PhieuNhap { get; set; }

        [ForeignKey("idSanPham")]
        public SanPham SanPham { get; set; }

        [ForeignKey("idViTri")]
        public ViTri ViTri { get; set; }
    }
}
