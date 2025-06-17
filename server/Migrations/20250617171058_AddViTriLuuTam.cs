using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuanLyKhoHangFPTShop.Migrations
{
    /// <inheritdoc />
    public partial class AddViTriLuuTam : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CHUCVU",
                columns: table => new
                {
                    idChucVu = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tenChucVu = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    moTa = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CHUCVU", x => x.idChucVu);
                });

            migrationBuilder.CreateTable(
                name: "DAILY",
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
                    table.PrimaryKey("PK_DAILY", x => x.idDaiLy);
                });

            migrationBuilder.CreateTable(
                name: "DANHMUC",
                columns: table => new
                {
                    idDanhMuc = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tenDanhMuc = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DANHMUC", x => x.idDanhMuc);
                });

            migrationBuilder.CreateTable(
                name: "DONVITINH",
                columns: table => new
                {
                    idDonViTinh = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tenDonViTinh = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DONVITINH", x => x.idDonViTinh);
                });

            migrationBuilder.CreateTable(
                name: "KHUVUC",
                columns: table => new
                {
                    idKhuVuc = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tenKhuVuc = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    loaiKhuVuc = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KHUVUC", x => x.idKhuVuc);
                });

            migrationBuilder.CreateTable(
                name: "THONGBAOHETHONG",
                columns: table => new
                {
                    idThongBaoHeThong = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    maLoai = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    lanCuoiGui = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_THONGBAOHETHONG", x => x.idThongBaoHeThong);
                });

            migrationBuilder.CreateTable(
                name: "THONGSOKYTHUAT",
                columns: table => new
                {
                    idThongSo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tenThongSo = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_THONGSOKYTHUAT", x => x.idThongSo);
                });

            migrationBuilder.CreateTable(
                name: "THUONGHIEU",
                columns: table => new
                {
                    idThuongHieu = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tenThuongHieu = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_THUONGHIEU", x => x.idThuongHieu);
                });

            migrationBuilder.CreateTable(
                name: "TINHTHANH",
                columns: table => new
                {
                    idTinhThanh = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tenTinhThanh = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TINHTHANH", x => x.idTinhThanh);
                });

            migrationBuilder.CreateTable(
                name: "TRANGTHAIXACNHAN",
                columns: table => new
                {
                    idTrangThaiXacNhan = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tenTrangThaiXacNhan = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TRANGTHAIXACNHAN", x => x.idTrangThaiXacNhan);
                });

            migrationBuilder.CreateTable(
                name: "TAIKHOAN",
                columns: table => new
                {
                    idTaiKhoan = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tenTaiKhoan = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    matKhau = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    trangThai = table.Column<bool>(type: "bit", nullable: true),
                    doiMatKhau = table.Column<bool>(type: "bit", nullable: true),
                    ngayCap = table.Column<DateTime>(type: "datetime2", nullable: false),
                    idChucVu = table.Column<int>(type: "int", nullable: false),
                    resetToken = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    resetTokenExpiry = table.Column<DateTime>(type: "datetime2", nullable: true),
                    idDaiLy = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TAIKHOAN", x => x.idTaiKhoan);
                    table.ForeignKey(
                        name: "FK_TAIKHOAN_CHUCVU_idChucVu",
                        column: x => x.idChucVu,
                        principalTable: "CHUCVU",
                        principalColumn: "idChucVu",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TAIKHOAN_DAILY_idDaiLy",
                        column: x => x.idDaiLy,
                        principalTable: "DAILY",
                        principalColumn: "idDaiLy");
                });

            migrationBuilder.CreateTable(
                name: "VITRI",
                columns: table => new
                {
                    idViTri = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    day = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    cot = table.Column<int>(type: "int", nullable: false),
                    tang = table.Column<int>(type: "int", nullable: false),
                    trangThai = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    sucChua = table.Column<decimal>(type: "decimal(20,2)", nullable: false),
                    daDung = table.Column<int>(type: "int", nullable: false),
                    chieuDai = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    chieuRong = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    chieuCao = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    idKhuVuc = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VITRI", x => x.idViTri);
                    table.ForeignKey(
                        name: "FK_VITRI_KHUVUC_idKhuVuc",
                        column: x => x.idKhuVuc,
                        principalTable: "KHUVUC",
                        principalColumn: "idKhuVuc",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QUANHUYEN",
                columns: table => new
                {
                    idQuanHuyen = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tenQuanHuyen = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    idTinhThanh = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QUANHUYEN", x => x.idQuanHuyen);
                    table.ForeignKey(
                        name: "FK_QUANHUYEN_TINHTHANH_idTinhThanh",
                        column: x => x.idTinhThanh,
                        principalTable: "TINHTHANH",
                        principalColumn: "idTinhThanh",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "THONGBAO",
                columns: table => new
                {
                    idThongBao = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    noiDung = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    ngayTao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    daXem = table.Column<bool>(type: "bit", nullable: false),
                    lienKet = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    idNguoiNhan = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_THONGBAO", x => x.idThongBao);
                    table.ForeignKey(
                        name: "FK_THONGBAO_TAIKHOAN_idNguoiNhan",
                        column: x => x.idNguoiNhan,
                        principalTable: "TAIKHOAN",
                        principalColumn: "idTaiKhoan",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "YEUCAUKIEMKE",
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
                    table.PrimaryKey("PK_YEUCAUKIEMKE", x => x.idYeuCauKiemKe);
                    table.ForeignKey(
                        name: "FK_YEUCAUKIEMKE_TAIKHOAN_nguoiTao",
                        column: x => x.nguoiTao,
                        principalTable: "TAIKHOAN",
                        principalColumn: "idTaiKhoan");
                });

            migrationBuilder.CreateTable(
                name: "YEUCAUXUATKHO",
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
                    idNguoiTao = table.Column<int>(type: "int", nullable: false),
                    nguoiYeuCau = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    maPhieu = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ngayYeuCau = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_YEUCAUXUATKHO", x => x.idYeuCauXuatKho);
                    table.ForeignKey(
                        name: "FK_YEUCAUXUATKHO_DAILY_idDaiLy",
                        column: x => x.idDaiLy,
                        principalTable: "DAILY",
                        principalColumn: "idDaiLy",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_YEUCAUXUATKHO_DANHMUC_idDanhMuc",
                        column: x => x.idDanhMuc,
                        principalTable: "DANHMUC",
                        principalColumn: "idDanhMuc",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_YEUCAUXUATKHO_DONVITINH_idDonViTinh",
                        column: x => x.idDonViTinh,
                        principalTable: "DONVITINH",
                        principalColumn: "idDonViTinh",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_YEUCAUXUATKHO_TAIKHOAN_idNguoiTao",
                        column: x => x.idNguoiTao,
                        principalTable: "TAIKHOAN",
                        principalColumn: "idTaiKhoan",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_YEUCAUXUATKHO_TRANGTHAIXACNHAN_idTrangThaiXacNhan",
                        column: x => x.idTrangThaiXacNhan,
                        principalTable: "TRANGTHAIXACNHAN",
                        principalColumn: "idTrangThaiXacNhan",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PHUONGXA",
                columns: table => new
                {
                    idPhuongXa = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tenPhuongXa = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    idQuanHuyen = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PHUONGXA", x => x.idPhuongXa);
                    table.ForeignKey(
                        name: "FK_PHUONGXA_QUANHUYEN_idQuanHuyen",
                        column: x => x.idQuanHuyen,
                        principalTable: "QUANHUYEN",
                        principalColumn: "idQuanHuyen",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "KIEMKE",
                columns: table => new
                {
                    idKiemKe = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    idYeuCauKiemKe = table.Column<int>(type: "int", nullable: false),
                    idNguoiThucHien = table.Column<int>(type: "int", nullable: false),
                    ngayKiemKe = table.Column<DateTime>(type: "datetime2", nullable: false),
                    thoiGianThucHien = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ghiChu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    trangThai = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KIEMKE", x => x.idKiemKe);
                    table.ForeignKey(
                        name: "FK_KIEMKE_YEUCAUKIEMKE_idYeuCauKiemKe",
                        column: x => x.idYeuCauKiemKe,
                        principalTable: "YEUCAUKIEMKE",
                        principalColumn: "idYeuCauKiemKe",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PHIEUXUAT",
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
                    table.PrimaryKey("PK_PHIEUXUAT", x => x.idPhieuXuat);
                    table.ForeignKey(
                        name: "FK_PHIEUXUAT_YEUCAUXUATKHO_idYeuCauXuatKho",
                        column: x => x.idYeuCauXuatKho,
                        principalTable: "YEUCAUXUATKHO",
                        principalColumn: "idYeuCauXuatKho");
                });

            migrationBuilder.CreateTable(
                name: "NHACUNGCAP",
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
                    table.PrimaryKey("PK_NHACUNGCAP", x => x.idNhaCungCap);
                    table.ForeignKey(
                        name: "FK_NHACUNGCAP_PHUONGXA_idPhuongXa",
                        column: x => x.idPhuongXa,
                        principalTable: "PHUONGXA",
                        principalColumn: "idPhuongXa",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PHIEUNHAP",
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
                    table.PrimaryKey("PK_PHIEUNHAP", x => x.idPhieuNhap);
                    table.ForeignKey(
                        name: "FK_PHIEUNHAP_NHACUNGCAP_idNhaCungCap",
                        column: x => x.idNhaCungCap,
                        principalTable: "NHACUNGCAP",
                        principalColumn: "idNhaCungCap",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PHIEUNHAP_TAIKHOAN_idTaiKhoan",
                        column: x => x.idTaiKhoan,
                        principalTable: "TAIKHOAN",
                        principalColumn: "idTaiKhoan",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SANPHAM",
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
                    chieuCao = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    hinhAnh = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SANPHAM", x => x.idSanPham);
                    table.ForeignKey(
                        name: "FK_SANPHAM_DANHMUC_idDanhMuc",
                        column: x => x.idDanhMuc,
                        principalTable: "DANHMUC",
                        principalColumn: "idDanhMuc",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SANPHAM_DONVITINH_idDonViTinh",
                        column: x => x.idDonViTinh,
                        principalTable: "DONVITINH",
                        principalColumn: "idDonViTinh",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SANPHAM_NHACUNGCAP_idNhaCungCap",
                        column: x => x.idNhaCungCap,
                        principalTable: "NHACUNGCAP",
                        principalColumn: "idNhaCungCap",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SANPHAM_THUONGHIEU_idThuongHieu",
                        column: x => x.idThuongHieu,
                        principalTable: "THUONGHIEU",
                        principalColumn: "idThuongHieu",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LOHANG",
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
                    table.PrimaryKey("PK_LOHANG", x => x.idLoHang);
                    table.ForeignKey(
                        name: "FK_LOHANG_NHACUNGCAP_idNhaCungCap",
                        column: x => x.idNhaCungCap,
                        principalTable: "NHACUNGCAP",
                        principalColumn: "idNhaCungCap",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LOHANG_PHIEUNHAP_idPhieuNhap",
                        column: x => x.idPhieuNhap,
                        principalTable: "PHIEUNHAP",
                        principalColumn: "idPhieuNhap",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CHITIETKIEMKE",
                columns: table => new
                {
                    idKiemKe = table.Column<int>(type: "int", nullable: false),
                    idSanPham = table.Column<int>(type: "int", nullable: false),
                    idViTri = table.Column<int>(type: "int", nullable: false),
                    soLuongThucTe = table.Column<int>(type: "int", nullable: false),
                    soLuongTheoHeThong = table.Column<int>(type: "int", nullable: false),
                    phamChat = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ghiChu = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CHITIETKIEMKE", x => new { x.idKiemKe, x.idSanPham, x.idViTri });
                    table.ForeignKey(
                        name: "FK_CHITIETKIEMKE_KIEMKE_idKiemKe",
                        column: x => x.idKiemKe,
                        principalTable: "KIEMKE",
                        principalColumn: "idKiemKe",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CHITIETKIEMKE_SANPHAM_idSanPham",
                        column: x => x.idSanPham,
                        principalTable: "SANPHAM",
                        principalColumn: "idSanPham",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CHITIETKIEMKE_VITRI_idViTri",
                        column: x => x.idViTri,
                        principalTable: "VITRI",
                        principalColumn: "idViTri",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CHITIETPHIEUNHAP",
                columns: table => new
                {
                    idPhieuNhap = table.Column<int>(type: "int", nullable: false),
                    idSanPham = table.Column<int>(type: "int", nullable: false),
                    donGia = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    soLuongTheoChungTu = table.Column<int>(type: "int", nullable: false),
                    soLuongThucNhap = table.Column<int>(type: "int", nullable: false),
                    tongTien = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    nguoiGiaoHang = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    trangThai = table.Column<int>(type: "int", nullable: false),
                    PhieuNhapidPhieuNhap = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CHITIETPHIEUNHAP", x => new { x.idPhieuNhap, x.idSanPham });
                    table.ForeignKey(
                        name: "FK_CHITIETPHIEUNHAP_PHIEUNHAP_PhieuNhapidPhieuNhap",
                        column: x => x.PhieuNhapidPhieuNhap,
                        principalTable: "PHIEUNHAP",
                        principalColumn: "idPhieuNhap");
                    table.ForeignKey(
                        name: "FK_CHITIETPHIEUNHAP_PHIEUNHAP_idPhieuNhap",
                        column: x => x.idPhieuNhap,
                        principalTable: "PHIEUNHAP",
                        principalColumn: "idPhieuNhap",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CHITIETPHIEUNHAP_SANPHAM_idSanPham",
                        column: x => x.idSanPham,
                        principalTable: "SANPHAM",
                        principalColumn: "idSanPham");
                });

            migrationBuilder.CreateTable(
                name: "CHITIETPHIEUXUAT",
                columns: table => new
                {
                    idPhieuXuat = table.Column<int>(type: "int", nullable: false),
                    idSanPham = table.Column<int>(type: "int", nullable: false),
                    idViTri = table.Column<int>(type: "int", nullable: false),
                    soLuong = table.Column<int>(type: "int", nullable: false),
                    donGiaXuat = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    chietKhau = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    giaSauChietKhau = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    tongTien = table.Column<decimal>(type: "decimal(18,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CHITIETPHIEUXUAT", x => new { x.idPhieuXuat, x.idSanPham, x.idViTri });
                    table.ForeignKey(
                        name: "FK_CHITIETPHIEUXUAT_PHIEUXUAT_idPhieuXuat",
                        column: x => x.idPhieuXuat,
                        principalTable: "PHIEUXUAT",
                        principalColumn: "idPhieuXuat",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CHITIETPHIEUXUAT_SANPHAM_idSanPham",
                        column: x => x.idSanPham,
                        principalTable: "SANPHAM",
                        principalColumn: "idSanPham",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CHITIETPHIEUXUAT_VITRI_idViTri",
                        column: x => x.idViTri,
                        principalTable: "VITRI",
                        principalColumn: "idViTri",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CHITIETTHONGSOKYTHUAT",
                columns: table => new
                {
                    idSanPham = table.Column<int>(type: "int", nullable: false),
                    idThongSo = table.Column<int>(type: "int", nullable: false),
                    giaTriThongSo = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CHITIETTHONGSOKYTHUAT", x => new { x.idSanPham, x.idThongSo });
                    table.ForeignKey(
                        name: "FK_CHITIETTHONGSOKYTHUAT_SANPHAM_idSanPham",
                        column: x => x.idSanPham,
                        principalTable: "SANPHAM",
                        principalColumn: "idSanPham",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CHITIETTHONGSOKYTHUAT_THONGSOKYTHUAT_idThongSo",
                        column: x => x.idThongSo,
                        principalTable: "THONGSOKYTHUAT",
                        principalColumn: "idThongSo",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CHITIETYEUCAUKIEMKE",
                columns: table => new
                {
                    idYeuCauKiemKe = table.Column<int>(type: "int", nullable: false),
                    idSanPham = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CHITIETYEUCAUKIEMKE", x => new { x.idYeuCauKiemKe, x.idSanPham });
                    table.ForeignKey(
                        name: "FK_CHITIETYEUCAUKIEMKE_SANPHAM_idSanPham",
                        column: x => x.idSanPham,
                        principalTable: "SANPHAM",
                        principalColumn: "idSanPham",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CHITIETYEUCAUKIEMKE_YEUCAUKIEMKE_idYeuCauKiemKe",
                        column: x => x.idYeuCauKiemKe,
                        principalTable: "YEUCAUKIEMKE",
                        principalColumn: "idYeuCauKiemKe",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CHITIETYEUCAUXUATKHO",
                columns: table => new
                {
                    idYeuCauXuatKho = table.Column<int>(type: "int", nullable: false),
                    idSanPham = table.Column<int>(type: "int", nullable: false),
                    soLuong = table.Column<int>(type: "int", nullable: false),
                    YeuCauXuatKhoIdYeuCauXuatKho = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CHITIETYEUCAUXUATKHO", x => new { x.idYeuCauXuatKho, x.idSanPham });
                    table.ForeignKey(
                        name: "FK_CHITIETYEUCAUXUATKHO_SANPHAM_idSanPham",
                        column: x => x.idSanPham,
                        principalTable: "SANPHAM",
                        principalColumn: "idSanPham");
                    table.ForeignKey(
                        name: "FK_CHITIETYEUCAUXUATKHO_YEUCAUXUATKHO_YeuCauXuatKhoIdYeuCauXuatKho",
                        column: x => x.YeuCauXuatKhoIdYeuCauXuatKho,
                        principalTable: "YEUCAUXUATKHO",
                        principalColumn: "idYeuCauXuatKho");
                    table.ForeignKey(
                        name: "FK_CHITIETYEUCAUXUATKHO_YEUCAUXUATKHO_idYeuCauXuatKho",
                        column: x => x.idYeuCauXuatKho,
                        principalTable: "YEUCAUXUATKHO",
                        principalColumn: "idYeuCauXuatKho",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SANPHAMTHONGSO",
                columns: table => new
                {
                    idSanPham = table.Column<int>(type: "int", nullable: false),
                    idThongSo = table.Column<int>(type: "int", nullable: false),
                    giaTri = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    idThongSoKyThuat = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SANPHAMTHONGSO", x => new { x.idSanPham, x.idThongSo });
                    table.ForeignKey(
                        name: "FK_SANPHAMTHONGSO_SANPHAM_idSanPham",
                        column: x => x.idSanPham,
                        principalTable: "SANPHAM",
                        principalColumn: "idSanPham",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SANPHAMTHONGSO_THONGSOKYTHUAT_idThongSoKyThuat",
                        column: x => x.idThongSoKyThuat,
                        principalTable: "THONGSOKYTHUAT",
                        principalColumn: "idThongSo",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VITRILUUTAM",
                columns: table => new
                {
                    idViTriLuuTam = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    idPhieuNhap = table.Column<int>(type: "int", nullable: false),
                    idSanPham = table.Column<int>(type: "int", nullable: false),
                    idViTri = table.Column<int>(type: "int", nullable: false),
                    soLuong = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VITRILUUTAM", x => x.idViTriLuuTam);
                    table.ForeignKey(
                        name: "FK_VITRILUUTAM_PHIEUNHAP_idPhieuNhap",
                        column: x => x.idPhieuNhap,
                        principalTable: "PHIEUNHAP",
                        principalColumn: "idPhieuNhap",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_VITRILUUTAM_SANPHAM_idSanPham",
                        column: x => x.idSanPham,
                        principalTable: "SANPHAM",
                        principalColumn: "idSanPham",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_VITRILUUTAM_VITRI_idViTri",
                        column: x => x.idViTri,
                        principalTable: "VITRI",
                        principalColumn: "idViTri",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CHITIETLUUTRU",
                columns: table => new
                {
                    idChiTietLuuTru = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    idSanPham = table.Column<int>(type: "int", nullable: false),
                    idViTri = table.Column<int>(type: "int", nullable: false),
                    idLoHang = table.Column<int>(type: "int", nullable: true),
                    soLuong = table.Column<int>(type: "int", nullable: false),
                    thoiGianLuu = table.Column<DateTime>(type: "datetime2", nullable: false),
                    idPhieuNhap = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CHITIETLUUTRU", x => x.idChiTietLuuTru);
                    table.ForeignKey(
                        name: "FK_CHITIETLUUTRU_LOHANG_idLoHang",
                        column: x => x.idLoHang,
                        principalTable: "LOHANG",
                        principalColumn: "idLoHang");
                    table.ForeignKey(
                        name: "FK_CHITIETLUUTRU_PHIEUNHAP_idPhieuNhap",
                        column: x => x.idPhieuNhap,
                        principalTable: "PHIEUNHAP",
                        principalColumn: "idPhieuNhap",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CHITIETLUUTRU_SANPHAM_idSanPham",
                        column: x => x.idSanPham,
                        principalTable: "SANPHAM",
                        principalColumn: "idSanPham",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CHITIETLUUTRU_VITRI_idViTri",
                        column: x => x.idViTri,
                        principalTable: "VITRI",
                        principalColumn: "idViTri",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CHITIETKIEMKE_idSanPham",
                table: "CHITIETKIEMKE",
                column: "idSanPham");

            migrationBuilder.CreateIndex(
                name: "IX_CHITIETKIEMKE_idViTri",
                table: "CHITIETKIEMKE",
                column: "idViTri");

            migrationBuilder.CreateIndex(
                name: "IX_CHITIETLUUTRU_idLoHang",
                table: "CHITIETLUUTRU",
                column: "idLoHang");

            migrationBuilder.CreateIndex(
                name: "IX_CHITIETLUUTRU_idPhieuNhap",
                table: "CHITIETLUUTRU",
                column: "idPhieuNhap");

            migrationBuilder.CreateIndex(
                name: "IX_CHITIETLUUTRU_idSanPham",
                table: "CHITIETLUUTRU",
                column: "idSanPham");

            migrationBuilder.CreateIndex(
                name: "IX_CHITIETLUUTRU_idViTri",
                table: "CHITIETLUUTRU",
                column: "idViTri");

            migrationBuilder.CreateIndex(
                name: "IX_CHITIETPHIEUNHAP_idSanPham",
                table: "CHITIETPHIEUNHAP",
                column: "idSanPham");

            migrationBuilder.CreateIndex(
                name: "IX_CHITIETPHIEUNHAP_PhieuNhapidPhieuNhap",
                table: "CHITIETPHIEUNHAP",
                column: "PhieuNhapidPhieuNhap");

            migrationBuilder.CreateIndex(
                name: "IX_CHITIETPHIEUXUAT_idSanPham",
                table: "CHITIETPHIEUXUAT",
                column: "idSanPham");

            migrationBuilder.CreateIndex(
                name: "IX_CHITIETPHIEUXUAT_idViTri",
                table: "CHITIETPHIEUXUAT",
                column: "idViTri");

            migrationBuilder.CreateIndex(
                name: "IX_CHITIETTHONGSOKYTHUAT_idThongSo",
                table: "CHITIETTHONGSOKYTHUAT",
                column: "idThongSo");

            migrationBuilder.CreateIndex(
                name: "IX_CHITIETYEUCAUKIEMKE_idSanPham",
                table: "CHITIETYEUCAUKIEMKE",
                column: "idSanPham");

            migrationBuilder.CreateIndex(
                name: "IX_CHITIETYEUCAUXUATKHO_idSanPham",
                table: "CHITIETYEUCAUXUATKHO",
                column: "idSanPham");

            migrationBuilder.CreateIndex(
                name: "IX_CHITIETYEUCAUXUATKHO_YeuCauXuatKhoIdYeuCauXuatKho",
                table: "CHITIETYEUCAUXUATKHO",
                column: "YeuCauXuatKhoIdYeuCauXuatKho");

            migrationBuilder.CreateIndex(
                name: "IX_KIEMKE_idYeuCauKiemKe",
                table: "KIEMKE",
                column: "idYeuCauKiemKe");

            migrationBuilder.CreateIndex(
                name: "IX_LOHANG_idNhaCungCap",
                table: "LOHANG",
                column: "idNhaCungCap");

            migrationBuilder.CreateIndex(
                name: "IX_LOHANG_idPhieuNhap",
                table: "LOHANG",
                column: "idPhieuNhap");

            migrationBuilder.CreateIndex(
                name: "IX_NHACUNGCAP_idPhuongXa",
                table: "NHACUNGCAP",
                column: "idPhuongXa");

            migrationBuilder.CreateIndex(
                name: "IX_PHIEUNHAP_idNhaCungCap",
                table: "PHIEUNHAP",
                column: "idNhaCungCap");

            migrationBuilder.CreateIndex(
                name: "IX_PHIEUNHAP_idTaiKhoan",
                table: "PHIEUNHAP",
                column: "idTaiKhoan");

            migrationBuilder.CreateIndex(
                name: "IX_PHIEUXUAT_idYeuCauXuatKho",
                table: "PHIEUXUAT",
                column: "idYeuCauXuatKho");

            migrationBuilder.CreateIndex(
                name: "IX_PHUONGXA_idQuanHuyen",
                table: "PHUONGXA",
                column: "idQuanHuyen");

            migrationBuilder.CreateIndex(
                name: "IX_QUANHUYEN_idTinhThanh",
                table: "QUANHUYEN",
                column: "idTinhThanh");

            migrationBuilder.CreateIndex(
                name: "IX_SANPHAM_idDanhMuc",
                table: "SANPHAM",
                column: "idDanhMuc");

            migrationBuilder.CreateIndex(
                name: "IX_SANPHAM_idDonViTinh",
                table: "SANPHAM",
                column: "idDonViTinh");

            migrationBuilder.CreateIndex(
                name: "IX_SANPHAM_idNhaCungCap",
                table: "SANPHAM",
                column: "idNhaCungCap");

            migrationBuilder.CreateIndex(
                name: "IX_SANPHAM_idThuongHieu",
                table: "SANPHAM",
                column: "idThuongHieu");

            migrationBuilder.CreateIndex(
                name: "IX_SANPHAMTHONGSO_idThongSoKyThuat",
                table: "SANPHAMTHONGSO",
                column: "idThongSoKyThuat");

            migrationBuilder.CreateIndex(
                name: "IX_TAIKHOAN_idChucVu",
                table: "TAIKHOAN",
                column: "idChucVu");

            migrationBuilder.CreateIndex(
                name: "IX_TAIKHOAN_idDaiLy",
                table: "TAIKHOAN",
                column: "idDaiLy");

            migrationBuilder.CreateIndex(
                name: "IX_THONGBAO_idNguoiNhan",
                table: "THONGBAO",
                column: "idNguoiNhan");

            migrationBuilder.CreateIndex(
                name: "IX_VITRI_idKhuVuc",
                table: "VITRI",
                column: "idKhuVuc");

            migrationBuilder.CreateIndex(
                name: "IX_VITRILUUTAM_idPhieuNhap",
                table: "VITRILUUTAM",
                column: "idPhieuNhap");

            migrationBuilder.CreateIndex(
                name: "IX_VITRILUUTAM_idSanPham",
                table: "VITRILUUTAM",
                column: "idSanPham");

            migrationBuilder.CreateIndex(
                name: "IX_VITRILUUTAM_idViTri",
                table: "VITRILUUTAM",
                column: "idViTri");

            migrationBuilder.CreateIndex(
                name: "IX_YEUCAUKIEMKE_nguoiTao",
                table: "YEUCAUKIEMKE",
                column: "nguoiTao");

            migrationBuilder.CreateIndex(
                name: "IX_YEUCAUXUATKHO_idDaiLy",
                table: "YEUCAUXUATKHO",
                column: "idDaiLy");

            migrationBuilder.CreateIndex(
                name: "IX_YEUCAUXUATKHO_idDanhMuc",
                table: "YEUCAUXUATKHO",
                column: "idDanhMuc");

            migrationBuilder.CreateIndex(
                name: "IX_YEUCAUXUATKHO_idDonViTinh",
                table: "YEUCAUXUATKHO",
                column: "idDonViTinh");

            migrationBuilder.CreateIndex(
                name: "IX_YEUCAUXUATKHO_idNguoiTao",
                table: "YEUCAUXUATKHO",
                column: "idNguoiTao");

            migrationBuilder.CreateIndex(
                name: "IX_YEUCAUXUATKHO_idTrangThaiXacNhan",
                table: "YEUCAUXUATKHO",
                column: "idTrangThaiXacNhan");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CHITIETKIEMKE");

            migrationBuilder.DropTable(
                name: "CHITIETLUUTRU");

            migrationBuilder.DropTable(
                name: "CHITIETPHIEUNHAP");

            migrationBuilder.DropTable(
                name: "CHITIETPHIEUXUAT");

            migrationBuilder.DropTable(
                name: "CHITIETTHONGSOKYTHUAT");

            migrationBuilder.DropTable(
                name: "CHITIETYEUCAUKIEMKE");

            migrationBuilder.DropTable(
                name: "CHITIETYEUCAUXUATKHO");

            migrationBuilder.DropTable(
                name: "SANPHAMTHONGSO");

            migrationBuilder.DropTable(
                name: "THONGBAO");

            migrationBuilder.DropTable(
                name: "THONGBAOHETHONG");

            migrationBuilder.DropTable(
                name: "VITRILUUTAM");

            migrationBuilder.DropTable(
                name: "KIEMKE");

            migrationBuilder.DropTable(
                name: "LOHANG");

            migrationBuilder.DropTable(
                name: "PHIEUXUAT");

            migrationBuilder.DropTable(
                name: "THONGSOKYTHUAT");

            migrationBuilder.DropTable(
                name: "SANPHAM");

            migrationBuilder.DropTable(
                name: "VITRI");

            migrationBuilder.DropTable(
                name: "YEUCAUKIEMKE");

            migrationBuilder.DropTable(
                name: "PHIEUNHAP");

            migrationBuilder.DropTable(
                name: "YEUCAUXUATKHO");

            migrationBuilder.DropTable(
                name: "THUONGHIEU");

            migrationBuilder.DropTable(
                name: "KHUVUC");

            migrationBuilder.DropTable(
                name: "NHACUNGCAP");

            migrationBuilder.DropTable(
                name: "DANHMUC");

            migrationBuilder.DropTable(
                name: "DONVITINH");

            migrationBuilder.DropTable(
                name: "TAIKHOAN");

            migrationBuilder.DropTable(
                name: "TRANGTHAIXACNHAN");

            migrationBuilder.DropTable(
                name: "PHUONGXA");

            migrationBuilder.DropTable(
                name: "CHUCVU");

            migrationBuilder.DropTable(
                name: "DAILY");

            migrationBuilder.DropTable(
                name: "QUANHUYEN");

            migrationBuilder.DropTable(
                name: "TINHTHANH");
        }
    }
}
