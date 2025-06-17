using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyKhoHangFPTShop.server.Models
{
    [Table("LOHANG")]
    public class LoHang
    {
        [Key]
        public int idLoHang { get; set; }

        public DateTime ngayNhapLo { get; set; }

        public int idNhaCungCap { get; set; }

        public int idPhieuNhap { get; set; }

        public int trangThaiLoHang { get; set; }

        public string tenLo { get; set; }  // ✅ thêm dòng này để lưu "số lô"

        [ForeignKey("idNhaCungCap")]
        public NhaCungCap NhaCungCap { get; set; }

        [ForeignKey("idPhieuNhap")]
        public PhieuNhap PhieuNhap { get; set; }
    }
}
