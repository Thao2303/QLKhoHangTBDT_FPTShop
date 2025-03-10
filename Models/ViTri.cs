using QuanLyKhoHangFPTShop.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class ViTri
{
    [Key]
    public int idViTri { get; set; }

    [Required]
    public string trangThai { get; set; }

    public decimal chieuDai { get; set; }
    public decimal chieuRong { get; set; }
    public decimal chieuCao { get; set; }
    public decimal theTich { get; set; }

    public int idTang { get; set; } 
    [ForeignKey("idTang")]
    public Tang Tang { get; set; } 
}
