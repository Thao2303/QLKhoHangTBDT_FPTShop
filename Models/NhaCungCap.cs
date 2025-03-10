using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyKhoHangFPTShop.Models
{
    public class NhaCungCap
    {
        [Key]
        public int idNhaCungCap { get; set; }
        public string tenNhaCungCap { get; set; }
        public string diaChi { get; set; }
        public string email { get; set; }
        public string nhanVienLienHe { get; set; }
        public string sdt { get; set; }
        public int idPhuongXa { get; set; }

        [ForeignKey("idPhuongXa")]
        public PhuongXa PhuongXa { get; set; }
    }
}
