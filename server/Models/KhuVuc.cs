using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace QuanLyKhoHangFPTShop.server.Models
{
    public class KhuVuc
    {
        [Key]
        public int idKhuVuc { get; set; }

        [Required]
        [MaxLength(50)]
        public string tenKhuVuc { get; set; }

        [Required]
        [MaxLength(20)]
        public string loaiKhuVuc { get; set; } // ví dụ: 'nhap', 'xuat', 'luu_tru'

        // ✅ Navigation property cho danh sách vị trí thuộc khu này
        public ICollection<ViTri> ViTris { get; set; }
    }
}
