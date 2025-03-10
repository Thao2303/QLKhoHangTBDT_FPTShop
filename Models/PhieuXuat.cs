using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyKhoHangFPTShop.Models
{
    public class PhieuXuat
    {
        [Key]
        public int idPhieuXuat { get; set; }
        public DateTime ngayXuat { get; set; } = DateTime.Now;
        public int idYeuCauXuatKho { get; set; }

        [ForeignKey("idYeuCauXuatKho")]
        public YeuCauXuatKho YeuCauXuatKho { get; set; }
        public ICollection<ChiTietPhieuXuat> ChiTietPhieuXuats { get; set; }
    }
}
