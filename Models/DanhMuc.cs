using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyKhoHangFPTShop.Models
{
    [Table("DanhMuc")]
    public class DanhMuc
    {
        [Key]
        public int idDanhMuc { get; set; }

        public string tenDanhMuc { get; set; }
    }
}
