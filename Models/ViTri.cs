using QuanLyKhoHangFPTShop.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace QuanLyKhoHangFPTShop.Models
{
    public class ViTri
    {
        [Key]
        public int IdViTri { get; set; }

        [Required]
        [MaxLength(10)]
        public string Day { get; set; } = "";

        public int Cot { get; set; }
        public int Tang { get; set; }

        [Required]
        [MaxLength(50)]
        public string TrangThai { get; set; } = "Trống";

        public int SucChua { get; set; } = 100;
        public decimal DaDung { get; set; } = 0;

        public decimal? ChieuDai { get; set; }
        public decimal? ChieuRong { get; set; }
        public decimal? ChieuCao { get; set; }


    }
}

