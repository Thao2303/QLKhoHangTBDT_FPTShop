using System.ComponentModel.DataAnnotations;

namespace QuanLyKhoHangFPTShop.Models
{
    public class ThuongHieu
    {
        [Key]
        public int idThuongHieu { get; set; }
        public string tenThuongHieu { get; set; }
    }
}
