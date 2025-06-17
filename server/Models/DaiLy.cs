using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyKhoHangFPTShop.server.Models
{
    [Table("DAILY")]
    public class DaiLy
    {
        [Key]
        public int idDaiLy { get; set; }
        public string TenDaiLy { get; set; } = string.Empty;
        public string DiaChi { get; set; } = string.Empty;
        public string Sdt { get; set; } = string.Empty;

    }
}
