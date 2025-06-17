using QuanLyKhoHangFPTShop.server.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
[Table("CHITIETPHIEUNHAP")]
public class ChiTietPhieuNhap
{
    [Key]
    public int idPhieuNhap { get; set; }
    [Key]
    public int idSanPham { get; set; }

    public decimal donGia { get; set; }
    public int soLuongTheoChungTu { get; set; }
    public int soLuongThucNhap { get; set; }
    public decimal tongTien { get; set; }
    public string nguoiGiaoHang { get; set; }
    public int trangThai { get; set; }

    [ForeignKey("idPhieuNhap")]
    public PhieuNhap PhieuNhap { get; set; }

    [ForeignKey("idSanPham")]
    public SanPham SanPham { get; set; }
}
