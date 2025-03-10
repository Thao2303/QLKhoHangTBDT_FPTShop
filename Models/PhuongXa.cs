using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyKhoHangFPTShop.Models
{
    public class PhuongXa
    {
        [Key]
        public int idPhuongXa { get; set; }
        public string tenPhuongXa { get; set; }
        public int idQuanHuyen { get; set; }

        [ForeignKey("idQuanHuyen")]
        public QuanHuyen QuanHuyen { get; set; }
    }
}
