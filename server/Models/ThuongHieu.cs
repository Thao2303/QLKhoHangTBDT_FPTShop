using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyKhoHangFPTShop.server.Models
{
    [Table("THUONGHIEU")]
    public class ThuongHieu
    {
        [Key]
        public int idThuongHieu { get; set; }
        public string tenThuongHieu { get; set; }
    }
}
