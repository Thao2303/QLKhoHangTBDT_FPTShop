using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyKhoHangFPTShop.Models
{
    public class YeuCauXuatKho
    {
        [Key]
        public int idYeuCauXuatKho { get; set; }
        public DateTime ngayYeuCau { get; set; } = DateTime.Now;
        public int? idDaiLy { get; set; }
        public int idTrangThaiXacNhan { get; set; }
        [ForeignKey("idDaiLy")]
        public DaiLy DaiLy { get; set; }
        [ForeignKey("idTrangThaiXacNhan")]
        public TrangThaiXacNhan TrangThaiXacNhan { get; set; }
        public ICollection<ChiTietYeuCauXuatKho> ChiTietYeuCauXuatKhos { get; set; }
    }
}
