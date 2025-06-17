using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace QuanLyKhoHangFPTShop.server.Models
{
    [Table("TAIKHOAN")]
    public class TaiKhoan
    {
        [Key]
        public int idTaiKhoan { get; set; }

        [Required]
        [StringLength(100)]
        public string tenTaiKhoan { get; set; }

        [Required]
        [StringLength(200)]
        public string matKhau { get; set; }

        [Required]
        [EmailAddress]
        public string email { get; set; }

        public bool? trangThai { get; set; } = true;
        public bool? doiMatKhau { get; set; } = false;
        public DateTime ngayCap { get; set; }

        public int idChucVu { get; set; }
        public string? resetToken { get; set; }

        public DateTime? resetTokenExpiry { get; set; }

        [ForeignKey("idChucVu")]
        [JsonIgnore]
        public ChucVu ChucVu { get; set; }

        // ✅ Bổ sung liên kết tới đại lý
        public int? idDaiLy { get; set; }

        [ForeignKey("idDaiLy")]
        [JsonIgnore]
        public DaiLy DaiLy { get; set; }
    }
}
