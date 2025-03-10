using System.ComponentModel.DataAnnotations;

namespace QuanLyKhoHangFPTShop.Models
{
    public class DanhMuc
    {
        [Key]
        public int idDanhMuc { get; set; }
        public string tenDanhMuc { get; set; }
    }
}
