using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QLKhoHangFPTShop.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePhieuNhapTable : Migration
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
                    tenDaiLy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    diaChi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    sdt = table.Column<string>(type: "nvarchar(max)", nullable: false)
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
                name: "Day",
                columns: table => new
                {
                    idDay = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tenDay = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Day", x => x.idDay);
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
                name: "Cot",
                columns: table => new
                {
                    idCot = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tenCot = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    idDay = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cot", x => x.idCot);
                    table.ForeignKey(
                        name: "FK_Cot_Day_idDay",
                        column: x => x.idDay,
                        principalTable: "Day",
                        principalColumn: "idDay",
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
                    ngayYeuCau = table.Column<DateTime>(type: "datetime2", nullable: false),
                    idDaiLy = table.Column<int>(type: "int", nullable: true),
                    idTrangThaiXacNhan = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_YeuCauXuatKho", x => x.idYeuCauXuatKho);
                    table.ForeignKey(
                        name: "FK_YeuCauXuatKho_DaiLy_idDaiLy",
                        column: x => x.idDaiLy,
                        principalTable: "DaiLy",
                        principalColumn: "idDaiLy");
                    table.ForeignKey(
                        name: "FK_YeuCauXuatKho_TrangThaiXacNhan_idTrangThaiXacNhan",
                        column: x => x.idTrangThaiXacNhan,
                        principalTable: "TrangThaiXacNhan",
                        principalColumn: "idTrangThaiXacNhan",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Tang",
                columns: table => new
                {
                    idTang = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tenTang = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    idCot = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tang", x => x.idTang);
                    table.ForeignKey(
                        name: "FK_Tang_Cot_idCot",
                        column: x => x.idCot,
                        principalTable: "Cot",
                        principalColumn: "idCot",
                        onDelete: ReferentialAction.Restrict);
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
                    ngayXuat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    idYeuCauXuatKho = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuXuat", x => x.idPhieuXuat);
                    table.ForeignKey(
                        name: "FK_PhieuXuat_YeuCauXuatKho_idYeuCauXuatKho",
                        column: x => x.idYeuCauXuatKho,
                        principalTable: "YeuCauXuatKho",
                        principalColumn: "idYeuCauXuatKho",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ViTri",
                columns: table => new
                {
                    idViTri = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    trangThai = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    chieuDai = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    chieuRong = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    chieuCao = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    theTich = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    idTang = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ViTri", x => x.idViTri);
                    table.ForeignKey(
                        name: "FK_ViTri_Tang_idTang",
                        column: x => x.idTang,
                        principalTable: "Tang",
                        principalColumn: "idTang",
                        onDelete: ReferentialAction.Restrict);
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
                    donGia = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    idDanhMuc = table.Column<int>(type: "int", nullable: false),
                    idThuongHieu = table.Column<int>(type: "int", nullable: false),
                    idNhaCungCap = table.Column<int>(type: "int", nullable: false),
                    soLuongHienCon = table.Column<int>(type: "int", nullable: false),
                    soLuongToiThieu = table.Column<int>(type: "int", nullable: false),
                    mauSac = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ngaySanXuat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    chieuDai = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    chieuRong = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    chieuCao = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    idViTri = table.Column<int>(type: "int", nullable: false)
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
                    table.ForeignKey(
                        name: "FK_SanPham_ViTri_idViTri",
                        column: x => x.idViTri,
                        principalTable: "ViTri",
                        principalColumn: "idViTri",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChiTietPhieuNhap",
                columns: table => new
                {
                    idPhieuNhap = table.Column<int>(type: "int", nullable: false),
                    idSanPham = table.Column<int>(type: "int", nullable: false),
                    id = table.Column<int>(type: "int", nullable: false),
                    soLuong = table.Column<int>(type: "int", nullable: false),
                    gia = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
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
                    soLuong = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietPhieuXuat", x => new { x.idPhieuXuat, x.idSanPham });
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
                name: "IX_ChiTietPhieuNhap_idSanPham",
                table: "ChiTietPhieuNhap",
                column: "idSanPham");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuXuat_idSanPham",
                table: "ChiTietPhieuXuat",
                column: "idSanPham");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietYeuCauXuatKho_idSanPham",
                table: "ChiTietYeuCauXuatKho",
                column: "idSanPham");

            migrationBuilder.CreateIndex(
                name: "IX_Cot_idDay",
                table: "Cot",
                column: "idDay");

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
                name: "IX_SanPham_idNhaCungCap",
                table: "SanPham",
                column: "idNhaCungCap");

            migrationBuilder.CreateIndex(
                name: "IX_SanPham_idThuongHieu",
                table: "SanPham",
                column: "idThuongHieu");

            migrationBuilder.CreateIndex(
                name: "IX_SanPham_idViTri",
                table: "SanPham",
                column: "idViTri");

            migrationBuilder.CreateIndex(
                name: "IX_SanPham_ThongSo_idThongSoKyThuat",
                table: "SanPham_ThongSo",
                column: "idThongSoKyThuat");

            migrationBuilder.CreateIndex(
                name: "IX_TaiKhoan_idChucVu",
                table: "TaiKhoan",
                column: "idChucVu");

            migrationBuilder.CreateIndex(
                name: "IX_Tang_idCot",
                table: "Tang",
                column: "idCot");

            migrationBuilder.CreateIndex(
                name: "IX_ViTri_idTang",
                table: "ViTri",
                column: "idTang");

            migrationBuilder.CreateIndex(
                name: "IX_YeuCauXuatKho_idDaiLy",
                table: "YeuCauXuatKho",
                column: "idDaiLy");

            migrationBuilder.CreateIndex(
                name: "IX_YeuCauXuatKho_idTrangThaiXacNhan",
                table: "YeuCauXuatKho",
                column: "idTrangThaiXacNhan");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChiTietPhieuNhap");

            migrationBuilder.DropTable(
                name: "ChiTietPhieuXuat");

            migrationBuilder.DropTable(
                name: "ChiTietYeuCauXuatKho");

            migrationBuilder.DropTable(
                name: "SanPham_ThongSo");

            migrationBuilder.DropTable(
                name: "PhieuNhap");

            migrationBuilder.DropTable(
                name: "PhieuXuat");

            migrationBuilder.DropTable(
                name: "SanPham");

            migrationBuilder.DropTable(
                name: "ThongSoKyThuat");

            migrationBuilder.DropTable(
                name: "TaiKhoan");

            migrationBuilder.DropTable(
                name: "YeuCauXuatKho");

            migrationBuilder.DropTable(
                name: "DanhMuc");

            migrationBuilder.DropTable(
                name: "NhaCungCap");

            migrationBuilder.DropTable(
                name: "ThuongHieu");

            migrationBuilder.DropTable(
                name: "ViTri");

            migrationBuilder.DropTable(
                name: "ChucVu");

            migrationBuilder.DropTable(
                name: "DaiLy");

            migrationBuilder.DropTable(
                name: "TrangThaiXacNhan");

            migrationBuilder.DropTable(
                name: "PhuongXa");

            migrationBuilder.DropTable(
                name: "Tang");

            migrationBuilder.DropTable(
                name: "QuanHuyen");

            migrationBuilder.DropTable(
                name: "Cot");

            migrationBuilder.DropTable(
                name: "TinhThanh");

            migrationBuilder.DropTable(
                name: "Day");
        }
    }
}
