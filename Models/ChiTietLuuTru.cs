using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyKhoHangFPTShop.Models
{
    public class ChiTietLuuTru
    {
        [Key]
        public int idChiTietLuuTru { get; set; }

        public int idSanPham { get; set; }

        public int idViTri { get; set; }

        public int soLuong { get; set; }

        public DateTime thoiGianLuu { get; set; }

        [ForeignKey("idSanPham")]
        public SanPham SanPham { get; set; }

        [ForeignKey("idViTri")]
        public ViTri ViTri { get; set; }
    }
}
