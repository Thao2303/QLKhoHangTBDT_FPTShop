using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace QuanLyKhoHangFPTShop.Models
{
    [Table("PhieuNhap")]
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

        [JsonIgnore]
        public ICollection<ChiTietPhieuNhap> ChiTietPhieuNhap { get; set; } = new List<ChiTietPhieuNhap>();
    }
}
