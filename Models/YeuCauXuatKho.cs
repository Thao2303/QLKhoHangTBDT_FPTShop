using QuanLyKhoHangFPTShop.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

public class YeuCauXuatKho
{
    [Key]
    public int idYeuCauXuatKho { get; set; }

    public DateTime ngayYeuCau { get; set; } = DateTime.Now;

    public int? idDaiLy { get; set; }
    public int idTrangThaiXacNhan { get; set; }

    [ForeignKey("idDaiLy")]
    public virtual DaiLy? DaiLy { get; set; }

    [ForeignKey("idTrangThaiXacNhan")]
    public virtual TrangThaiXacNhan? TrangThaiXacNhan { get; set; }

    public ICollection<ChiTietYeuCauXuatKho> ChiTietYeuCauXuatKhos { get; set; }
}
