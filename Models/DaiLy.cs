using System.ComponentModel.DataAnnotations;

namespace QuanLyKhoHangFPTShop.Models
{
    public class DaiLy
    {
        [Key]
        public int idDaiLy { get; set; }
        public string tenDaiLy { get; set; }
        public string diaChi { get; set; }
        public string sdt { get; set; }
    }
}
