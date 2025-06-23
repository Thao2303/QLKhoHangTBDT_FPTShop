using System.ComponentModel.DataAnnotations;

namespace QuanLyKhoHangFPTShop.server.Models
{
    public class TaiKhoanCreateDto
    {
        [Required]
        public string tenTaiKhoan { get; set; }
        public string matKhau { get; set; }
        [Required]
        public string email { get; set; }
        public bool trangThai { get; set; }
        public DateTime ngayCap { get; set; }
        [Required]
        public int idChucVu { get; set; }
        public int idDaiLy { get; set; }
    }
}
