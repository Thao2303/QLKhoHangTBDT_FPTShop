using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace QuanLyKhoHangFPTShop.server.Models
{
    public class ChiTietThongSoKyThuat
    {
        [Key, Column(Order = 0)]
        public int idSanPham { get; set; }

        [Key, Column(Order = 1)]
        public int idThongSo { get; set; }

        [Required]
        public string giaTriThongSo { get; set; }

        [ForeignKey("idSanPham")]
        public SanPham SanPham { get; set; }

        [ForeignKey("idThongSo")]
        public ThongSoKyThuat ThongSoKyThuat { get; set; }
    }

}
