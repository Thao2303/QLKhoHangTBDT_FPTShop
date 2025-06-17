using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyKhoHangFPTShop.server.Models
{
    [Table("CHUCVU")]
    public class ChucVu
    {
        [Key]
        public int idChucVu { get; set; }
        public string tenChucVu { get; set; }
        public string moTa { get; set; }
    }
}
