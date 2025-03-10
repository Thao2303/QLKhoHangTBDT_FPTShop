using System.ComponentModel.DataAnnotations;

namespace QuanLyKhoHangFPTShop.Models
{
    public class ThongSoKyThuat
    {
        [Key]
        public int idThongSo { get; set; }
        public string tenThongSo { get; set; }
    }
}
