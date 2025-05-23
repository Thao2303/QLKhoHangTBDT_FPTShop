using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyKhoHangFPTShop.server.Models
{
    public class ChiTietYeuCauXuatKho
    {
        public int idYeuCauXuatKho { get; set; }
        public int idSanPham { get; set; }
        public int soLuong { get; set; }

        [ForeignKey("idYeuCauXuatKho")]
        public YeuCauXuatKho? YeuCauXuatKho { get; set; }

        [ForeignKey("idSanPham")]
        public SanPham? SanPham { get; set; }
    }

}
