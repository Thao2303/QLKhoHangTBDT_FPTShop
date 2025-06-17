using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyKhoHangFPTShop.server.Models
{
    [Table("THONGBAOHETHONG")]
    public class ThongBaoHeThong
    {
        public int idThongBaoHeThong { get; set; }
        public string maLoai { get; set; } // ví dụ: "TON_KHO"
        public DateTime lanCuoiGui { get; set; }
    }

}
