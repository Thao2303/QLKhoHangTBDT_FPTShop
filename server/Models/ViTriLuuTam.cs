using System.ComponentModel.DataAnnotations;

namespace QuanLyKhoHangFPTShop.server.Models
{
    public class ViTriLuuTam
    {
        [Key]
        public int idViTriLuuTam { get; set; }

        public int idPhieuNhap { get; set; }
        public int idSanPham { get; set; }
        public int idViTri { get; set; }
        public int soLuong { get; set; }
    }

}
