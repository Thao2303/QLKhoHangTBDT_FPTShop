using System.ComponentModel.DataAnnotations;

namespace QuanLyKhoHangFPTShop.Models
{
    public class TinhThanh
    {
        [Key]
        public int idTinhThanh { get; set; }
        public string tenTinhThanh { get; set; }
    }
}
