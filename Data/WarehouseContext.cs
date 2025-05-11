using Microsoft.EntityFrameworkCore;
using QuanLyKhoHangFPTShop.Models;

namespace QuanLyKhoHangFPTShop.Data
{
    public class WarehouseContext : DbContext
    {
        public WarehouseContext(DbContextOptions<WarehouseContext> options) : base(options) { }

        public DbSet<TinhThanh> TinhThanh { get; set; }
        public DbSet<QuanHuyen> QuanHuyen { get; set; }
        public DbSet<PhuongXa> PhuongXa { get; set; }
        public DbSet<ChucVu> ChucVu { get; set; }
        public DbSet<TaiKhoan> TaiKhoan { get; set; }
        public DbSet<DanhMuc> DanhMuc { get; set; }
        public DbSet<ThuongHieu> ThuongHieu { get; set; }
        public DbSet<NhaCungCap> NhaCungCap { get; set; }
        public DbSet<SanPham> SanPham { get; set; }
        public DbSet<ViTri> ViTri { get; set; }
        public DbSet<ChiTietLuuTru> ChiTietLuuTru { get; set; }
        public DbSet<LoHang> LoHang { get; set; }
        public DbSet<DonViTinh> DonViTinh { get; set; }

        public DbSet<ThongSoKyThuat> ThongSoKyThuat { get; set; }
        public DbSet<SanPham_ThongSo> SanPham_ThongSo { get; set; }
        public DbSet<DaiLy> DaiLy { get; set; }
        public DbSet<PhieuNhap> PhieuNhap { get; set; }
        public DbSet<ChiTietPhieuNhap> ChiTietPhieuNhap { get; set; }
        public DbSet<TrangThaiXacNhan> TrangThaiXacNhan { get; set; }
        public DbSet<YeuCauXuatKho> YeuCauXuatKho { get; set; }
        public DbSet<ChiTietYeuCauXuatKho> ChiTietYeuCauXuatKho { get; set; }
        public DbSet<PhieuXuat> PhieuXuat { get; set; }
        public DbSet<ChiTietPhieuXuat> ChiTietPhieuXuat { get; set; }
        public DbSet<YeuCauKiemKe> YeuCauKiemKe { get; set; }
        public DbSet<ChiTietYeuCauKiemKe> ChiTietYeuCauKiemKe { get; set; }
        public DbSet<KiemKe> KiemKe { get; set; }
        public DbSet<ChiTietKiemKe> ChiTietKiemKe { get; set; }
        public DbSet<ChiTietThongSoKyThuat> ChiTietThongSoKyThuat { get; set; }
 

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Định nghĩa khóa chính cho ChiTietPhieuNhap
            modelBuilder.Entity<ChiTietPhieuNhap>()
       .HasKey(c => new { c.idPhieuNhap, c.idSanPham });

            // Định nghĩa khóa chính cho ChiTietPhieuXuat
            modelBuilder.Entity<ChiTietPhieuXuat>()
     .HasKey(c => new { c.IdPhieuXuat, c.IdSanPham, c.IdViTri });


            // Định nghĩa khóa chính cho ChiTietYeuCauXuatKho
            modelBuilder.Entity<ChiTietYeuCauXuatKho>()
                .HasKey(c => new { c.idYeuCauXuatKho, c.idSanPham });

            // Định nghĩa khóa chính cho ChucVu
            modelBuilder.Entity<ChucVu>()
                .HasKey(c => c.idChucVu); // Primary Key cho bảng ChucVu

            // Định nghĩa khóa chính cho TaiKhoan
            modelBuilder.Entity<TaiKhoan>()
                .HasKey(t => t.idTaiKhoan); // Primary Key cho bảng TaiKhoan

            // Định nghĩa khóa chính cho PhuongXa
            modelBuilder.Entity<PhuongXa>()
                .HasKey(p => p.idPhuongXa); // Primary Key cho bảng PhuongXa

            modelBuilder.Entity<QuanHuyen>()
                .HasKey(c => new { c.idQuanHuyen });

            modelBuilder.Entity<TinhThanh>()
                .HasKey(c => new { c.idTinhThanh });

            // Định nghĩa khóa chính cho DanhMuc
            modelBuilder.Entity<DanhMuc>()
                .HasKey(d => d.idDanhMuc); // Primary Key cho bảng DanhMuc

            // Định nghĩa khóa chính cho ThuongHieu
            modelBuilder.Entity<ThuongHieu>()
                .HasKey(t => t.idThuongHieu); // Primary Key cho bảng ThuongHieu

            // Định nghĩa khóa chính cho NhaCungCap
            modelBuilder.Entity<NhaCungCap>()
                .HasKey(n => n.idNhaCungCap); // Primary Key cho bảng NhaCungCap

            // Định nghĩa khóa chính cho SanPham
            modelBuilder.Entity<SanPham>()
                .HasKey(s => s.idSanPham); // Primary Key cho bảng SanPham

            modelBuilder.Entity<SanPham_ThongSo>()
                .HasKey(c => new { c.idSanPham, c.idThongSo });

            modelBuilder.Entity<ThongSoKyThuat>()
                .HasKey(c => new { c.idThongSo });

            // Định nghĩa khóa chính cho TrangThaiXacNhan
            modelBuilder.Entity<TrangThaiXacNhan>()
                .HasKey(t => t.idTrangThaiXacNhan); // Primary Key cho bảng TrangThaiXacNhan

            // Định nghĩa khóa chính cho YeuCauXuatKho
            modelBuilder.Entity<YeuCauXuatKho>()
                .HasKey(y => y.IdYeuCauXuatKho); // Primary Key cho bảng YeuCauXuatKho

            // Định nghĩa khóa chính cho PhieuNhap
            modelBuilder.Entity<PhieuNhap>()
                .ToTable("PhieuNhap");


            modelBuilder.Entity<PhieuXuat>()
            .HasKey(c => new { c.IdPhieuXuat });

         
            modelBuilder.Entity<DaiLy>()
            .HasKey(c => new { c.idDaiLy });

            modelBuilder.Entity<ChiTietYeuCauKiemKe>()
         .HasKey(c => new { c.idYeuCauKiemKe, c.idSanPham });

            modelBuilder.Entity<YeuCauKiemKe>()
                .HasKey(y => y.idYeuCauKiemKe);

            modelBuilder.Entity<ChiTietKiemKe>()
    .HasKey(c => new { c.idKiemKe, c.idSanPham });

            modelBuilder.Entity<ChiTietThongSoKyThuat>()
.HasKey(c => new { c.idSanPham, c.idThongSo });





        }
    }
}
