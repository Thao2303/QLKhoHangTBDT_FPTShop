using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyKhoHangFPTShop.Models
{
    public class ChiTietPhieuNhap
    {
        [Key]
        public int idPhieuNhap { get; set; }
        [Key]
        public int idSanPham { get; set; }
        public decimal tongTien { get; set; }
        public string trangThai { get; set; }

        [ForeignKey("idPhieuNhap")]
        public PhieuNhap? PhieuNhap { get; set; } 

        [ForeignKey("idSanPham")]
        public SanPham SanPham { get; set; }
    }
}
