using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyKhoHangFPTShop.server.Models
{
    [Table("TINHTHANH")]
    public class TinhThanh
    {
        [Key]
        public int idTinhThanh { get; set; }
        public string tenTinhThanh { get; set; }
    }
}
