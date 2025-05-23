using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuanLyKhoHangFPTShop.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSucChuaToDecimal20 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ChucVu",
                columns: table => new
                {
                    idChucVu = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tenChucVu = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    moTa = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChucVu", x => x.idChucVu);
                });

            migrationBuilder.CreateTable(
                name: "DaiLy",
                columns: table => new
                {
                    idDaiLy = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenDaiLy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DiaChi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Sdt = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DaiLy", x => x.idDaiLy);
                });

            migrationBuilder.CreateTable(
                name: "DanhMuc",
                columns: table => new
                {
                    idDanhMuc = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tenDanhMuc = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DanhMuc", x => x.idDanhMuc);
                });

            migrationBuilder.CreateTable(
                name: "DonViTinh",
                columns: table => new
                {
                    idDonViTinh = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tenDonViTinh = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DonViTinh", x => x.idDonViTinh);
                });

            migrationBuilder.CreateTable(
                name: "KhuVuc",
                columns: table => new
                {
                    idKhuVuc = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tenKhuVuc = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    loaiKhuVuc = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KhuVuc", x => x.idKhuVuc);
                });

            migrationBuilder.CreateTable(
                name: "ThongSoKyThuat",
                columns: table => new
                {
                    idThongSo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tenThongSo = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThongSoKyThuat", x => x.idThongSo);
                });

            migrationBuilder.CreateTable(
                name: "ThuongHieu",
                columns: table => new
                {
                    idThuongHieu = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tenThuongHieu = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThuongHieu", x => x.idThuongHieu);
                });

            migrationBuilder.CreateTable(
                name: "TinhThanh",
                columns: table => new
                {
                    idTinhThanh = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tenTinhThanh = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TinhThanh", x => x.idTinhThanh);
                });

            migrationBuilder.CreateTable(
                name: "TrangThaiXacNhan",
                columns: table => new
                {
                    idTrangThaiXacNhan = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tenTrangThaiXacNhan = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrangThaiXacNhan", x => x.idTrangThaiXacNhan);
                });

            migrationBuilder.CreateTable(
                name: "TaiKhoan",
                columns: table => new
                {
                    idTaiKhoan = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tenTaiKhoan = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    matKhau = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    trangThai = table.Column<bool>(type: "bit", nullable: false),
                    ngayCap = table.Column<DateTime>(type: "datetime2", nullable: false),
                    idChucVu = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaiKhoan", x => x.idTaiKhoan);
                    table.ForeignKey(
                        name: "FK_TaiKhoan_ChucVu_idChucVu",
                        column: x => x.idChucVu,
                        principalTable: "ChucVu",
                        principalColumn: "idChucVu",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ViTri",
                columns: table => new
                {
                    IdViTri = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Day = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Cot = table.Column<int>(type: "int", nullable: false),
                    Tang = table.Column<int>(type: "int", nullable: false),
                    TrangThai = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    SucChua = table.Column<decimal>(type: "decimal(20,2)", nullable: false),
                    DaDung = table.Column<int>(type: "int", nullable: false),
                    chieuDai = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    chieuRong = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    chieuCao = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    idKhuVuc = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ViTri", x => x.IdViTri);
                    table.ForeignKey(
                        name: "FK_ViTri_KhuVuc_idKhuVuc",
                        column: x => x.idKhuVuc,
                        principalTable: "KhuVuc",
                        principalColumn: "idKhuVuc",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuanHuyen",
                columns: table => new
                {
                    idQuanHuyen = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tenQuanHuyen = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    idTinhThanh = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuanHuyen", x => x.idQuanHuyen);
                    table.ForeignKey(
                        name: "FK_QuanHuyen_TinhThanh_idTinhThanh",
                        column: x => x.idTinhThanh,
                        principalTable: "TinhThanh",
                        principalColumn: "idTinhThanh",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "YeuCauXuatKho",
                columns: table => new
                {
                    idYeuCauXuatKho = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    idDaiLy = table.Column<int>(type: "int", nullable: false),
                    idTrangThaiXacNhan = table.Column<int>(type: "int", nullable: false),
                    idDanhMuc = table.Column<int>(type: "int", nullable: false),
                    idDonViTinh = table.Column<int>(type: "int", nullable: false),
                    diaChi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    lyDoXuat = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    hinhThucXuat = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    phuongThucVanChuyen = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    nguoiYeuCau = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    maPhieu = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ngayYeuCau = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_YeuCauXuatKho", x => x.idYeuCauXuatKho);
                    table.ForeignKey(
                        name: "FK_YeuCauXuatKho_DaiLy_idDaiLy",
                        column: x => x.idDaiLy,
                        principalTable: "DaiLy",
                        principalColumn: "idDaiLy",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_YeuCauXuatKho_DanhMuc_idDanhMuc",
                        column: x => x.idDanhMuc,
                        principalTable: "DanhMuc",
                        principalColumn: "idDanhMuc",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_YeuCauXuatKho_DonViTinh_idDonViTinh",
                        column: x => x.idDonViTinh,
                        principalTable: "DonViTinh",
                        principalColumn: "idDonViTinh",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_YeuCauXuatKho_TrangThaiXacNhan_idTrangThaiXacNhan",
                        column: x => x.idTrangThaiXacNhan,
                        principalTable: "TrangThaiXacNhan",
                        principalColumn: "idTrangThaiXacNhan",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "YeuCauKiemKe",
                columns: table => new
                {
                    idYeuCauKiemKe = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    mucDich = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    viTriKiemKe = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ghiChu = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    trangThai = table.Column<int>(type: "int", nullable: false),
                    nguoiTao = table.Column<int>(type: "int", nullable: true),
                    tenTruongBan = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    tenUyVien1 = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    tenUyVien2 = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_YeuCauKiemKe", x => x.idYeuCauKiemKe);
                    table.ForeignKey(
                        name: "FK_YeuCauKiemKe_TaiKhoan_nguoiTao",
                        column: x => x.nguoiTao,
                        principalTable: "TaiKhoan",
                        principalColumn: "idTaiKhoan");
                });

            migrationBuilder.CreateTable(
                name: "PhuongXa",
                columns: table => new
                {
                    idPhuongXa = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tenPhuongXa = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    idQuanHuyen = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhuongXa", x => x.idPhuongXa);
                    table.ForeignKey(
                        name: "FK_PhuongXa_QuanHuyen_idQuanHuyen",
                        column: x => x.idQuanHuyen,
                        principalTable: "QuanHuyen",
                        principalColumn: "idQuanHuyen",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PhieuXuat",
                columns: table => new
                {
                    idPhieuXuat = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    maPhieu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ngayXuat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    idYeuCauXuatKho = table.Column<int>(type: "int", nullable: true),
                    nguoiXuat = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ghiChu = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuXuat", x => x.idPhieuXuat);
                    table.ForeignKey(
                        name: "FK_PhieuXuat_YeuCauXuatKho_idYeuCauXuatKho",
                        column: x => x.idYeuCauXuatKho,
                        principalTable: "YeuCauXuatKho",
                        principalColumn: "idYeuCauXuatKho");
                });

            migrationBuilder.CreateTable(
                name: "KiemKe",
                columns: table => new
                {
                    idKiemKe = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    idYeuCauKiemKe = table.Column<int>(type: "int", nullable: false),
                    idNguoiThucHien = table.Column<int>(type: "int", nullable: false),
                    ngayKiemKe = table.Column<DateTime>(type: "datetime2", nullable: false),
                    thoiGianThucHien = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ghiChu = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KiemKe", x => x.idKiemKe);
                    table.ForeignKey(
                        name: "FK_KiemKe_YeuCauKiemKe_idYeuCauKiemKe",
                        column: x => x.idYeuCauKiemKe,
                        principalTable: "YeuCauKiemKe",
                        principalColumn: "idYeuCauKiemKe",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "NhaCungCap",
                columns: table => new
                {
                    idNhaCungCap = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tenNhaCungCap = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    diaChi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    nhanVienLienHe = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    sdt = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    idPhuongXa = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NhaCungCap", x => x.idNhaCungCap);
                    table.ForeignKey(
                        name: "FK_NhaCungCap_PhuongXa_idPhuongXa",
                        column: x => x.idPhuongXa,
                        principalTable: "PhuongXa",
                        principalColumn: "idPhuongXa",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PhieuNhap",
                columns: table => new
                {
                    idPhieuNhap = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ngayNhap = table.Column<DateTime>(type: "datetime2", nullable: false),
                    idTaiKhoan = table.Column<int>(type: "int", nullable: false),
                    idNhaCungCap = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuNhap", x => x.idPhieuNhap);
                    table.ForeignKey(
                        name: "FK_PhieuNhap_NhaCungCap_idNhaCungCap",
                        column: x => x.idNhaCungCap,
                        principalTable: "NhaCungCap",
                        principalColumn: "idNhaCungCap",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PhieuNhap_TaiKhoan_idTaiKhoan",
                        column: x => x.idTaiKhoan,
                        principalTable: "TaiKhoan",
                        principalColumn: "idTaiKhoan",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SanPham",
                columns: table => new
                {
                    idSanPham = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    sku = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    tenSanPham = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    moTa = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    khoiLuong = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    donGiaBan = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    idDanhMuc = table.Column<int>(type: "int", nullable: false),
                    idThuongHieu = table.Column<int>(type: "int", nullable: false),
                    idNhaCungCap = table.Column<int>(type: "int", nullable: false),
                    idDonViTinh = table.Column<int>(type: "int", nullable: false),
                    soLuongHienCon = table.Column<int>(type: "int", nullable: false),
                    soLuongToiThieu = table.Column<int>(type: "int", nullable: false),
                    mauSac = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ngaySanXuat = table.Column<DateTime>(type: "datetime2", nullable: true),
                    chieuDai = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    chieuRong = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    chieuCao = table.Column<decimal>(type: "decimal(18,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SanPham", x => x.idSanPham);
                    table.ForeignKey(
                        name: "FK_SanPham_DanhMuc_idDanhMuc",
                        column: x => x.idDanhMuc,
                        principalTable: "DanhMuc",
                        principalColumn: "idDanhMuc",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SanPham_DonViTinh_idDonViTinh",
                        column: x => x.idDonViTinh,
                        principalTable: "DonViTinh",
                        principalColumn: "idDonViTinh",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SanPham_NhaCungCap_idNhaCungCap",
                        column: x => x.idNhaCungCap,
                        principalTable: "NhaCungCap",
                        principalColumn: "idNhaCungCap",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SanPham_ThuongHieu_idThuongHieu",
                        column: x => x.idThuongHieu,
                        principalTable: "ThuongHieu",
                        principalColumn: "idThuongHieu",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LoHang",
                columns: table => new
                {
                    idLoHang = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ngayNhapLo = table.Column<DateTime>(type: "datetime2", nullable: false),
                    idNhaCungCap = table.Column<int>(type: "int", nullable: false),
                    idPhieuNhap = table.Column<int>(type: "int", nullable: false),
                    trangThaiLoHang = table.Column<int>(type: "int", nullable: false),
                    tenLo = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LoHang", x => x.idLoHang);
                    table.ForeignKey(
                        name: "FK_LoHang_NhaCungCap_idNhaCungCap",
                        column: x => x.idNhaCungCap,
                        principalTable: "NhaCungCap",
                        principalColumn: "idNhaCungCap",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LoHang_PhieuNhap_idPhieuNhap",
                        column: x => x.idPhieuNhap,
                        principalTable: "PhieuNhap",
                        principalColumn: "idPhieuNhap",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChiTietKiemKe",
                columns: table => new
                {
                    idKiemKe = table.Column<int>(type: "int", nullable: false),
                    idSanPham = table.Column<int>(type: "int", nullable: false),
                    idViTri = table.Column<int>(type: "int", nullable: false),
                    soLuongThucTe = table.Column<int>(type: "int", nullable: false),
                    soLuongTheoHeThong = table.Column<int>(type: "int", nullable: false),
                    phamChat = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietKiemKe", x => new { x.idKiemKe, x.idSanPham });
                    table.ForeignKey(
                        name: "FK_ChiTietKiemKe_KiemKe_idKiemKe",
                        column: x => x.idKiemKe,
                        principalTable: "KiemKe",
                        principalColumn: "idKiemKe",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChiTietKiemKe_SanPham_idSanPham",
                        column: x => x.idSanPham,
                        principalTable: "SanPham",
                        principalColumn: "idSanPham",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChiTietKiemKe_ViTri_idViTri",
                        column: x => x.idViTri,
                        principalTable: "ViTri",
                        principalColumn: "IdViTri",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChiTietLuuTru",
                columns: table => new
                {
                    idChiTietLuuTru = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    idSanPham = table.Column<int>(type: "int", nullable: false),
                    idViTri = table.Column<int>(type: "int", nullable: false),
                    soLuong = table.Column<int>(type: "int", nullable: false),
                    thoiGianLuu = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietLuuTru", x => x.idChiTietLuuTru);
                    table.ForeignKey(
                        name: "FK_ChiTietLuuTru_SanPham_idSanPham",
                        column: x => x.idSanPham,
                        principalTable: "SanPham",
                        principalColumn: "idSanPham",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChiTietLuuTru_ViTri_idViTri",
                        column: x => x.idViTri,
                        principalTable: "ViTri",
                        principalColumn: "IdViTri",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChiTietPhieuNhap",
                columns: table => new
                {
                    idPhieuNhap = table.Column<int>(type: "int", nullable: false),
                    idSanPham = table.Column<int>(type: "int", nullable: false),
                    tongTien = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    trangThai = table.Column<int>(type: "int", nullable: false),
                    soLuongTheoChungTu = table.Column<int>(type: "int", nullable: false),
                    soLuongThucNhap = table.Column<int>(type: "int", nullable: false),
                    donGia = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    nguoiGiaoHang = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietPhieuNhap", x => new { x.idPhieuNhap, x.idSanPham });
                    table.ForeignKey(
                        name: "FK_ChiTietPhieuNhap_PhieuNhap_idPhieuNhap",
                        column: x => x.idPhieuNhap,
                        principalTable: "PhieuNhap",
                        principalColumn: "idPhieuNhap",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChiTietPhieuNhap_SanPham_idSanPham",
                        column: x => x.idSanPham,
                        principalTable: "SanPham",
                        principalColumn: "idSanPham",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChiTietPhieuXuat",
                columns: table => new
                {
                    idPhieuXuat = table.Column<int>(type: "int", nullable: false),
                    idSanPham = table.Column<int>(type: "int", nullable: false),
                    idViTri = table.Column<int>(type: "int", nullable: false),
                    soLuong = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietPhieuXuat", x => new { x.idPhieuXuat, x.idSanPham, x.idViTri });
                    table.ForeignKey(
                        name: "FK_ChiTietPhieuXuat_PhieuXuat_idPhieuXuat",
                        column: x => x.idPhieuXuat,
                        principalTable: "PhieuXuat",
                        principalColumn: "idPhieuXuat",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChiTietPhieuXuat_SanPham_idSanPham",
                        column: x => x.idSanPham,
                        principalTable: "SanPham",
                        principalColumn: "idSanPham",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChiTietPhieuXuat_ViTri_idViTri",
                        column: x => x.idViTri,
                        principalTable: "ViTri",
                        principalColumn: "IdViTri",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChiTietThongSoKyThuat",
                columns: table => new
                {
                    idSanPham = table.Column<int>(type: "int", nullable: false),
                    idThongSo = table.Column<int>(type: "int", nullable: false),
                    giaTriThongSo = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietThongSoKyThuat", x => new { x.idSanPham, x.idThongSo });
                    table.ForeignKey(
                        name: "FK_ChiTietThongSoKyThuat_SanPham_idSanPham",
                        column: x => x.idSanPham,
                        principalTable: "SanPham",
                        principalColumn: "idSanPham",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChiTietThongSoKyThuat_ThongSoKyThuat_idThongSo",
                        column: x => x.idThongSo,
                        principalTable: "ThongSoKyThuat",
                        principalColumn: "idThongSo",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChiTietYeuCauKiemKe",
                columns: table => new
                {
                    idYeuCauKiemKe = table.Column<int>(type: "int", nullable: false),
                    idSanPham = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietYeuCauKiemKe", x => new { x.idYeuCauKiemKe, x.idSanPham });
                    table.ForeignKey(
                        name: "FK_ChiTietYeuCauKiemKe_SanPham_idSanPham",
                        column: x => x.idSanPham,
                        principalTable: "SanPham",
                        principalColumn: "idSanPham",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChiTietYeuCauKiemKe_YeuCauKiemKe_idYeuCauKiemKe",
                        column: x => x.idYeuCauKiemKe,
                        principalTable: "YeuCauKiemKe",
                        principalColumn: "idYeuCauKiemKe",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChiTietYeuCauXuatKho",
                columns: table => new
                {
                    idYeuCauXuatKho = table.Column<int>(type: "int", nullable: false),
                    idSanPham = table.Column<int>(type: "int", nullable: false),
                    soLuong = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietYeuCauXuatKho", x => new { x.idYeuCauXuatKho, x.idSanPham });
                    table.ForeignKey(
                        name: "FK_ChiTietYeuCauXuatKho_SanPham_idSanPham",
                        column: x => x.idSanPham,
                        principalTable: "SanPham",
                        principalColumn: "idSanPham",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChiTietYeuCauXuatKho_YeuCauXuatKho_idYeuCauXuatKho",
                        column: x => x.idYeuCauXuatKho,
                        principalTable: "YeuCauXuatKho",
                        principalColumn: "idYeuCauXuatKho",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SanPham_ThongSo",
                columns: table => new
                {
                    idSanPham = table.Column<int>(type: "int", nullable: false),
                    idThongSo = table.Column<int>(type: "int", nullable: false),
                    giaTri = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    idThongSoKyThuat = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SanPham_ThongSo", x => new { x.idSanPham, x.idThongSo });
                    table.ForeignKey(
                        name: "FK_SanPham_ThongSo_SanPham_idSanPham",
                        column: x => x.idSanPham,
                        principalTable: "SanPham",
                        principalColumn: "idSanPham",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SanPham_ThongSo_ThongSoKyThuat_idThongSoKyThuat",
                        column: x => x.idThongSoKyThuat,
                        principalTable: "ThongSoKyThuat",
                        principalColumn: "idThongSo",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietKiemKe_idSanPham",
                table: "ChiTietKiemKe",
                column: "idSanPham");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietKiemKe_idViTri",
                table: "ChiTietKiemKe",
                column: "idViTri");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietLuuTru_idSanPham",
                table: "ChiTietLuuTru",
                column: "idSanPham");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietLuuTru_idViTri",
                table: "ChiTietLuuTru",
                column: "idViTri");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuNhap_idSanPham",
                table: "ChiTietPhieuNhap",
                column: "idSanPham");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuXuat_idSanPham",
                table: "ChiTietPhieuXuat",
                column: "idSanPham");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuXuat_idViTri",
                table: "ChiTietPhieuXuat",
                column: "idViTri");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietThongSoKyThuat_idThongSo",
                table: "ChiTietThongSoKyThuat",
                column: "idThongSo");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietYeuCauKiemKe_idSanPham",
                table: "ChiTietYeuCauKiemKe",
                column: "idSanPham");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietYeuCauXuatKho_idSanPham",
                table: "ChiTietYeuCauXuatKho",
                column: "idSanPham");

            migrationBuilder.CreateIndex(
                name: "IX_KiemKe_idYeuCauKiemKe",
                table: "KiemKe",
                column: "idYeuCauKiemKe");

            migrationBuilder.CreateIndex(
                name: "IX_LoHang_idNhaCungCap",
                table: "LoHang",
                column: "idNhaCungCap");

            migrationBuilder.CreateIndex(
                name: "IX_LoHang_idPhieuNhap",
                table: "LoHang",
                column: "idPhieuNhap");

            migrationBuilder.CreateIndex(
                name: "IX_NhaCungCap_idPhuongXa",
                table: "NhaCungCap",
                column: "idPhuongXa");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuNhap_idNhaCungCap",
                table: "PhieuNhap",
                column: "idNhaCungCap");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuNhap_idTaiKhoan",
                table: "PhieuNhap",
                column: "idTaiKhoan");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuXuat_idYeuCauXuatKho",
                table: "PhieuXuat",
                column: "idYeuCauXuatKho");

            migrationBuilder.CreateIndex(
                name: "IX_PhuongXa_idQuanHuyen",
                table: "PhuongXa",
                column: "idQuanHuyen");

            migrationBuilder.CreateIndex(
                name: "IX_QuanHuyen_idTinhThanh",
                table: "QuanHuyen",
                column: "idTinhThanh");

            migrationBuilder.CreateIndex(
                name: "IX_SanPham_idDanhMuc",
                table: "SanPham",
                column: "idDanhMuc");

            migrationBuilder.CreateIndex(
                name: "IX_SanPham_idDonViTinh",
                table: "SanPham",
                column: "idDonViTinh");

            migrationBuilder.CreateIndex(
                name: "IX_SanPham_idNhaCungCap",
                table: "SanPham",
                column: "idNhaCungCap");

            migrationBuilder.CreateIndex(
                name: "IX_SanPham_idThuongHieu",
                table: "SanPham",
                column: "idThuongHieu");

            migrationBuilder.CreateIndex(
                name: "IX_SanPham_ThongSo_idThongSoKyThuat",
                table: "SanPham_ThongSo",
                column: "idThongSoKyThuat");

            migrationBuilder.CreateIndex(
                name: "IX_TaiKhoan_idChucVu",
                table: "TaiKhoan",
                column: "idChucVu");

            migrationBuilder.CreateIndex(
                name: "IX_ViTri_idKhuVuc",
                table: "ViTri",
                column: "idKhuVuc");

            migrationBuilder.CreateIndex(
                name: "IX_YeuCauKiemKe_nguoiTao",
                table: "YeuCauKiemKe",
                column: "nguoiTao");

            migrationBuilder.CreateIndex(
                name: "IX_YeuCauXuatKho_idDaiLy",
                table: "YeuCauXuatKho",
                column: "idDaiLy");

            migrationBuilder.CreateIndex(
                name: "IX_YeuCauXuatKho_idDanhMuc",
                table: "YeuCauXuatKho",
                column: "idDanhMuc");

            migrationBuilder.CreateIndex(
                name: "IX_YeuCauXuatKho_idDonViTinh",
                table: "YeuCauXuatKho",
                column: "idDonViTinh");

            migrationBuilder.CreateIndex(
                name: "IX_YeuCauXuatKho_idTrangThaiXacNhan",
                table: "YeuCauXuatKho",
                column: "idTrangThaiXacNhan");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChiTietKiemKe");

            migrationBuilder.DropTable(
                name: "ChiTietLuuTru");

            migrationBuilder.DropTable(
                name: "ChiTietPhieuNhap");

            migrationBuilder.DropTable(
                name: "ChiTietPhieuXuat");

            migrationBuilder.DropTable(
                name: "ChiTietThongSoKyThuat");

            migrationBuilder.DropTable(
                name: "ChiTietYeuCauKiemKe");

            migrationBuilder.DropTable(
                name: "ChiTietYeuCauXuatKho");

            migrationBuilder.DropTable(
                name: "LoHang");

            migrationBuilder.DropTable(
                name: "SanPham_ThongSo");

            migrationBuilder.DropTable(
                name: "KiemKe");

            migrationBuilder.DropTable(
                name: "PhieuXuat");

            migrationBuilder.DropTable(
                name: "ViTri");

            migrationBuilder.DropTable(
                name: "PhieuNhap");

            migrationBuilder.DropTable(
                name: "SanPham");

            migrationBuilder.DropTable(
                name: "ThongSoKyThuat");

            migrationBuilder.DropTable(
                name: "YeuCauKiemKe");

            migrationBuilder.DropTable(
                name: "YeuCauXuatKho");

            migrationBuilder.DropTable(
                name: "KhuVuc");

            migrationBuilder.DropTable(
                name: "NhaCungCap");

            migrationBuilder.DropTable(
                name: "ThuongHieu");

            migrationBuilder.DropTable(
                name: "TaiKhoan");

            migrationBuilder.DropTable(
                name: "DaiLy");

            migrationBuilder.DropTable(
                name: "DanhMuc");

            migrationBuilder.DropTable(
                name: "DonViTinh");

            migrationBuilder.DropTable(
                name: "TrangThaiXacNhan");

            migrationBuilder.DropTable(
                name: "PhuongXa");

            migrationBuilder.DropTable(
                name: "ChucVu");

            migrationBuilder.DropTable(
                name: "QuanHuyen");

            migrationBuilder.DropTable(
                name: "TinhThanh");
        }
    }
}
