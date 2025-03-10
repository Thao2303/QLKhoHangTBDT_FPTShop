using QuanLyKhoHangFPTShop.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Tang
{
    [Key]
    public int idTang { get; set; }

    public string tenTang { get; set; }

    public int idCot { get; set; }

    [ForeignKey("idCot")]
    public Cot Cot { get; set; }
}
