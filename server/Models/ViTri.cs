using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyKhoHangFPTShop.server.Models
{
    [Table("VITRI")]
    public class ViTri
    {
        [Key]
        public int idViTri { get; set; }

        [Required]
        [MaxLength(10)]
        public string day { get; set; } = "";

        public int cot { get; set; }
        public int tang { get; set; }

        [Required]
        [MaxLength(50)]
        public string trangThai { get; set; } = "Trống";

        [Column(TypeName = "decimal(20, 2)")]
        public decimal sucChua { get; set; }

        public int daDung { get; set; } = 0;

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
