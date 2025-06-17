using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using QuanLyKhoHangFPTShop.server.Models;
[Table("PHIEUXUAT")]
public class PhieuXuat
{
    [Key]
    [Column("idPhieuXuat")]
    public int IdPhieuXuat { get; set; }

    [Column("maPhieu")]
    public string? MaPhieu { get; set; }

    [Column("ngayXuat")]
    public DateTime NgayXuat { get; set; } = DateTime.Now;

    [Column("idYeuCauXuatKho")]
    public int? IdYeuCauXuatKho { get; set; } // ✅ Cho phép null


    [Column("nguoiXuat")]
    public string? NguoiXuat { get; set; }

    [Column("ghiChu")]
    public string? GhiChu { get; set; }

    [ForeignKey("IdYeuCauXuatKho")]
    public YeuCauXuatKho? YeuCauXuatKho { get; set; }

    public ICollection<ChiTietPhieuXuat> ChiTietPhieuXuats { get; set; } = new List<ChiTietPhieuXuat>();
}