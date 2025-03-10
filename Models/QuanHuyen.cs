using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyKhoHangFPTShop.Models
{
    public class QuanHuyen
    {
        [Key]
        public int idQuanHuyen { get; set; }
        public string tenQuanHuyen { get; set; }
        public int idTinhThanh { get; set; }

        [ForeignKey("idTinhThanh")]
        public TinhThanh TinhThanh { get; set; }
    }
}
