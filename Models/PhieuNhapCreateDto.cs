using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyKhoHangFPTShop.Models
{
    public class PhieuNhapCreateDto
    {
        public int idTaiKhoan { get; set; }
        public int idNhaCungCap { get; set; }
        public DateTime ngayNhap { get; set; }

        public List<ChiTietDto> products { get; set; }
    }

    public class ChiTietDto
    {
        public int product { get; set; }
        public int quantity { get; set; }
        public decimal unitPrice { get; set; }
        public string note { get; set; }
    }
}

