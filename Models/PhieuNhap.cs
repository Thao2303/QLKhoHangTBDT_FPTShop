using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyKhoHangFPTShop.Models
{
    public class PhieuNhap
    {
        [Key]
        public int idPhieuNhap { get; set; }
        public DateTime ngayNhap { get; set; }
        public int idTaiKhoan { get; set; }
        public int idNhaCungCap { get; set; }

        [ForeignKey("idTaiKhoan")]
        public TaiKhoan TaiKhoan { get; set; }
        [ForeignKey("idNhaCungCap")]
        public NhaCungCap NhaCungCap { get; set; }
        public ICollection<ChiTietPhieuNhap> ChiTietPhieuNhaps { get; set; } = new List<ChiTietPhieuNhap>();

    }
}
