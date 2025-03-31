using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
namespace QuanLyKhoHangFPTShop.Models
{
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

        public bool trangThai { get; set; } = true;

        public DateTime ngayCap { get; set; }

        public int idChucVu { get; set; }

        [ForeignKey("idChucVu")]
        [JsonIgnore] // ✅ Thêm dòng này
        public ChucVu ChucVu { get; set; }

    }
}
