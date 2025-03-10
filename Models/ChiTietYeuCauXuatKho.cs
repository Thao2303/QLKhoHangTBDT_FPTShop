using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyKhoHangFPTShop.Models
{
    public class ChiTietYeuCauXuatKho
    {
        [Key]
        public int idYeuCauXuatKho { get; set; }
        [Key]
        public int idSanPham { get; set; }
        public int soLuong { get; set; }

        [ForeignKey("idYeuCauXuatKho")]
        public YeuCauXuatKho YeuCauXuatKho { get; set; }
        [ForeignKey("idSanPham")]
        public SanPham SanPham { get; set; }
    }
}
