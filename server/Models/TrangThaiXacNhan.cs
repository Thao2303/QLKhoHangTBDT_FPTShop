using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyKhoHangFPTShop.server.Models
{
    [Table("TRANGTHAIXACNHAN")]
    public class TrangThaiXacNhan
    {
        [Key]
        public int idTrangThaiXacNhan { get; set; }
        public string tenTrangThaiXacNhan { get; set; }
    }
}
