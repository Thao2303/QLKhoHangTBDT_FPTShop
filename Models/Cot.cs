using QuanLyKhoHangFPTShop.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Cot
{
    [Key]  // Định nghĩa idCot là khóa chính
    public int idCot { get; set; }

    [Required]
    public string tenCot { get; set; }

    public int idDay { get; set; }

    [ForeignKey("idDay")]
    public Day Day { get; set; }  // Quan hệ với bảng Day
}
