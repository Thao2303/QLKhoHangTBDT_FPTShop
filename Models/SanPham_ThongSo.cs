using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyKhoHangFPTShop.Models
{
    public class SanPham_ThongSo
    {
        [Key]
        public int idSanPham { get; set; }
        [Key]
        public int idThongSo { get; set; }
        public string giaTri { get; set; }

        [ForeignKey("idSanPham")]
        public SanPham SanPham { get; set; }
        [ForeignKey("idThongSoKyThuat")]
        public ThongSoKyThuat ThongSoKyThuat { get; set; }
    }
}
