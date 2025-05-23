﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyKhoHangFPTShop.server.Models
{
    public class ChiTietPhieuXuat
    {
        [Column("idPhieuXuat")]
        public int IdPhieuXuat { get; set; }

        [Column("idSanPham")]
        public int IdSanPham { get; set; }

        [Column("soLuong")]
        public int SoLuong { get; set; }

        [ForeignKey("IdPhieuXuat")]
        public PhieuXuat? PhieuXuat { get; set; }

        [ForeignKey("IdSanPham")]
        public SanPham? SanPham { get; set; }

        [Column("idViTri")]
        public int IdViTri { get; set; }

        [ForeignKey("IdViTri")]
        public ViTri? ViTri { get; set; }

    }
}
