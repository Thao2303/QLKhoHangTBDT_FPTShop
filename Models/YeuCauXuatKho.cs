using QuanLyKhoHangFPTShop.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


public class YeuCauXuatKho
{
    [Key]
    [Column("idYeuCauXuatKho")]
    public int IdYeuCauXuatKho { get; set; }

    [Column("idDaiLy")]
    public int IdDaiLy { get; set; }

    [Column("idTrangThaiXacNhan")]
    public int IdTrangThaiXacNhan { get; set; }

    [Column("idDanhMuc")]
    public int IdDanhMuc { get; set; }

    [Column("idDonViTinh")]
    public int IdDonViTinh { get; set; }

    [Column("diaChi")]
    public string DiaChi { get; set; }

    [Column("lyDoXuat")]
    public string LyDoXuat { get; set; }

    [Column("hinhThucXuat")]
    public string HinhThucXuat { get; set; }

    [Column("phuongThucVanChuyen")]
    public string PhuongThucVanChuyen { get; set; }

    [Column("nguoiYeuCau")]
    public string NguoiYeuCau { get; set; }

    [Column("maPhieu")]
    public string MaPhieu { get; set; }

    [Column("ngayYeuCau")]
    public DateTime NgayYeuCau { get; set; } = DateTime.Now;

    public ICollection<ChiTietYeuCauXuatKho> ChiTietYeuCauXuatKhos { get; set; } = new List<ChiTietYeuCauXuatKho>();

    [ForeignKey("IdDaiLy")]
    public DaiLy? DaiLy { get; set; }

    [ForeignKey("IdTrangThaiXacNhan")]
    public TrangThaiXacNhan? TrangThaiXacNhan { get; set; }

    [ForeignKey("IdDanhMuc")]
    public DanhMuc? DanhMuc { get; set; }

    [ForeignKey("IdDonViTinh")]
    public DonViTinh? DonViTinh { get; set; }
}

