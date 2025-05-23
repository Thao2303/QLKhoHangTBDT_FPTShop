using System.ComponentModel.DataAnnotations;

namespace QuanLyKhoHangFPTShop.server.Models
{
    public class ThuongHieu
    {
        [Key]
        public int idThuongHieu { get; set; }
        public string tenThuongHieu { get; set; }
    }
}
