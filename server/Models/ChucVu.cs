using System.ComponentModel.DataAnnotations;

namespace QuanLyKhoHangFPTShop.server.Models
{
    public class ChucVu
    {
        [Key]
        public int idChucVu { get; set; }
        public string tenChucVu { get; set; }
        public string moTa { get; set; }
    }
}
