using QuanLyKhoHangFPTShop.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;


public class ChiTietPhieuNhap
{
    public int idPhieuNhap { get; set; }
    public int idSanPham { get; set; }
    public decimal tongTien { get; set; }
    public int trangThai { get; set; }
    public int soLuongTheoChungTu { get; set; }
    public int soLuongThucNhap { get; set; }
    public decimal donGia { get; set; }
    public string nguoiGiaoHang { get; set; }   
    [ForeignKey("idPhieuNhap")]
    public PhieuNhap PhieuNhap { get; set; }

    [ForeignKey("idSanPham")]
    public SanPham SanPham { get; set; }
}

