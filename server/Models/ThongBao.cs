using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace QuanLyKhoHangFPTShop.server.Models
{
    [Table("THONGBAO")]
    public class ThongBao
    {
        [Key]
        public int idThongBao { get; set; }

        [Required]
        [StringLength(255)]
        public string noiDung { get; set; }

        public DateTime ngayTao { get; set; } = DateTime.Now;

        public bool daXem { get; set; } = false;
        public string? lienKet { get; set; }
        [ForeignKey("TaiKhoan")]
        public int idNguoiNhan { get; set; }

        [JsonIgnore]
        public TaiKhoan TaiKhoan { get; set; }
    }
}
