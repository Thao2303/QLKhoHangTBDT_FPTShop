using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyKhoHangFPTShop.Models
{
    public class ChiTietPhieuXuat
    {
        [Key]
        public int idPhieuXuat { get; set; }
        [Key]
        public int idSanPham { get; set; }
        public int soLuong { get; set; }

        [ForeignKey("idPhieuXuat")]
        public PhieuXuat? PhieuXuat { get; set; }

        [ForeignKey("idSanPham")]
        public SanPham SanPham { get; set; }
    }
}
