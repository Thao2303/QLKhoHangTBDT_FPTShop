using QuanLyKhoHangFPTShop.server.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class DonViTinh
{
    [Key]
    public int idDonViTinh { get; set; }

    public string tenDonViTinh { get; set; }


}
