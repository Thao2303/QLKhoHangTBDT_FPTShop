using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyKhoHangFPTShop.server.Models
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

        [Column(TypeName = "decimal(20, 2)")]
        public decimal SucChua { get; set; }

        public int DaDung { get; set; } = 0;

        [Column(TypeName = "decimal(10, 2)")]
        public decimal chieuDai { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal chieuRong { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal chieuCao { get; set; }

        // 🔗 Liên kết đến KhuVuc
        public int idKhuVuc { get; set; }

        [ForeignKey("idKhuVuc")]
        public KhuVuc KhuVuc { get; set; }
    }
}
