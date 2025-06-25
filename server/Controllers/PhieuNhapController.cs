using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using QuanLyKhoHangFPTShop.server.Models;
using QuanLyKhoHangFPTShop.server.Data;
using QuanLyKhoHangFPTShop.server.Dtos;
using QuanLyKhoHangFPTShop.server.Hubs;

namespace QuanLyKhoHangFPTShop.server.Controllers
{
    [Route("api/phieunhap")]
    [ApiController]
    public class PhieuNhapController : ControllerBase
    {
        private readonly WarehouseContext _context;

        private readonly IHubContext<ThongBaoHub> _hubContext;

        public PhieuNhapController(WarehouseContext context, IHubContext<ThongBaoHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPhieuNhapById(int id)
        {
            var phieuNhap = await _context.PhieuNhap.FindAsync(id);
            if (phieuNhap == null)
            {
                return NotFound();
            }
            return Ok(phieuNhap);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetPhieuNhap()
        {
            var phieuNhaps = await _context.PhieuNhap
                .Include(p => p.NhaCungCap)
                .Include(p => p.TaiKhoan)
                .ToListAsync();

            var allChiTiet = await _context.ChiTietPhieuNhap.ToListAsync(); // 👈 Lấy toàn bộ chi tiết phiếu nhập 1 lần

            var result = phieuNhaps.Select(p =>
            {
                var chiTietList = allChiTiet.Where(ct => ct.idPhieuNhap == p.idPhieuNhap).ToList();

                int trangThai;
                if (!chiTietList.Any())
                    trangThai = 1;
                else if (chiTietList.All(ct => ct.trangThai == 2))
                    trangThai = 2;
                else if (chiTietList.All(ct => ct.trangThai == 3))
                    trangThai = 3;
                else
                    trangThai = 1;

                return new
                {
                    p.idPhieuNhap,
                    p.ngayNhap,
                    p.idTaiKhoan,
                    p.idNhaCungCap,
                    nguoiTao = p.TaiKhoan?.tenTaiKhoan,
                    nhaCungCap = new
                    {
                        p.NhaCungCap?.idNhaCungCap,
                        p.NhaCungCap?.tenNhaCungCap
                    },
                    taiKhoan = new
                    {
                        p.TaiKhoan?.idTaiKhoan,
                        p.TaiKhoan?.tenTaiKhoan
                    },
                    trangThai
                };
            });

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult> CreatePhieuNhap(PhieuNhapCreateDto dto)
        {
            try
            {
                var phieuNhap = new PhieuNhap
                {
                    idTaiKhoan = dto.idTaiKhoan,
                    idNhaCungCap = dto.idNhaCungCap,
                    ngayNhap = DateTime.Now
                };

                _context.PhieuNhap.Add(phieuNhap);
                await _context.SaveChangesAsync();

                var soLoTuDong = await TaoSoLoTuDong(dto.idNhaCungCap);
                var loHang = new LoHang
                {
                    ngayNhapLo = DateTime.Now,
                    idNhaCungCap = dto.idNhaCungCap,
                    idPhieuNhap = phieuNhap.idPhieuNhap,
                    trangThaiLoHang = 1,
                    tenLo = soLoTuDong
                };

                _context.LoHang.Add(loHang);
                await _context.SaveChangesAsync();

                foreach (var item in dto.products)
                {
                    Console.WriteLine($"📦 Sản phẩm: {item.product}");
                    Console.WriteLine("📌 Vị trí nhận được từ frontend:");
                    Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(item.positions));

                    var idViTriTam = item.positions != null && item.positions.Count > 0 ? item.positions[0].idViTri : (int?)null;

                    var chiTiet = new ChiTietPhieuNhap
                    {
                        idPhieuNhap = phieuNhap.idPhieuNhap,
                        idSanPham = item.product,
                        tongTien = item.unitPrice * item.realQuantity,
                        soLuongTheoChungTu = item.quantity,
                        soLuongThucNhap = item.realQuantity,
                        trangThai = 1,
                        donGia = item.unitPrice,
                        nguoiGiaoHang = item.nguoiGiaoHang
                    };


                    _context.ChiTietPhieuNhap.Add(chiTiet);
                }

                await _context.SaveChangesAsync();

                var thuKhos = await _context.TaiKhoan
                    .Include(t => t.ChucVu)
                    .Where(t => t.ChucVu.tenChucVu == "Thủ kho")
                    .ToListAsync();


                

                return Ok(new { message = "Tạo phiếu nhập thành công", id = phieuNhap.idPhieuNhap });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi tạo phiếu nhập: " + ex);
                return StatusCode(500, new { error = ex.Message });
            }
        }


        [HttpPut("tuchoi/{id}")]
        public async Task<IActionResult> TuChoiPhieuNhap(int id)
        {
            try
            {
                var chiTietList = await _context.ChiTietPhieuNhap
                    .Where(x => x.idPhieuNhap == id)
                    .ToListAsync();

                if (!chiTietList.Any())
                    return NotFound($"Không tìm thấy chi tiết phiếu nhập với id = {id}");

                foreach (var ct in chiTietList)
                {
                    ct.trangThai = 3;
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = "Đã từ chối phiếu nhập!" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[TuChoiPhieuNhap] Lỗi: {ex.Message}");
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePhieuNhap(int id, PhieuNhap phieuNhap)
        {
            if (id != phieuNhap.idPhieuNhap) return BadRequest();
            _context.Entry(phieuNhap).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("duyet/{id}")]
        public async Task<IActionResult> DuyetPhieuNhap(int id)
        {
            try
            {
                var chiTietList = await _context.ChiTietPhieuNhap
                    .Where(x => x.idPhieuNhap == id)
                    .ToListAsync();

                if (!chiTietList.Any())
                    return NotFound("Không tìm thấy chi tiết phiếu nhập");

                foreach (var ct in chiTietList)
                {
                    ct.trangThai = 2;

                    var sp = await _context.SanPham.FindAsync(ct.idSanPham);
                    if (sp != null)
                    {
                        sp.soLuongHienCon += ct.soLuongThucNhap;
                    }

                    var viTriTams = await _context.ViTriLuuTam
     .Where(v => v.idPhieuNhap == id && v.idSanPham == ct.idSanPham)
     .ToListAsync();

                    foreach (var vt in viTriTams)
                    {
                        var chiTietLuu = new ChiTietLuuTru
                        {
                            idSanPham = vt.idSanPham,
                            idViTri = vt.idViTri,
                            soLuong = vt.soLuong,
                            thoiGianLuu = DateTime.Now,
                            idPhieuNhap = vt.idPhieuNhap
                        };

                        _context.ChiTietLuuTru.Add(chiTietLuu);
                    }

                }

                // Cập nhật daDung
                using var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();
                using var command = connection.CreateCommand();

                command.CommandText = @"
            UPDATE V
            SET V.daDung = T.tongTheTich
            FROM ViTri V
            JOIN (
                SELECT 
                    C.idViTri,
                    SUM(SP.chieuDai * SP.chieuRong * SP.chieuCao * C.soLuong) AS tongTheTich
                FROM ChiTietLuuTru C
                JOIN SanPham SP ON C.idSanPham = SP.idSanPham
                GROUP BY C.idViTri
            ) T ON V.idViTri = T.idViTri;
        ";

                await _context.SaveChangesAsync();
                await command.ExecuteNonQueryAsync();

                var nguoiTao = await _context.PhieuNhap
                    .Include(p => p.TaiKhoan)
                    .Where(p => p.idPhieuNhap == id)
                    .Select(p => p.TaiKhoan)
                    .FirstOrDefaultAsync();

                if (nguoiTao != null)
                {
                    var msg = $"✅ Phiếu nhập #{id} của bạn đã được duyệt.";

                    var thongBao = new ThongBao
                    {
                        idNguoiNhan = nguoiTao.idTaiKhoan,
                        noiDung = msg,
                        ngayTao = DateTime.Now,
                        daXem = false,
                        lienKet = $"/quanlyphieunhap?focus={id}"
                    };

                    _context.ThongBao.Add(thongBao);
                    await _context.SaveChangesAsync(); // ⏹️ Lưu để lấy idThongBao chuẩn từ DB

                    await _hubContext.Clients.User(nguoiTao.idTaiKhoan.ToString())
                        .SendAsync("NhanThongBao", new
                        {
                            noiDung = msg,
                            ngayTao = thongBao.ngayTao,
                            lienKet = thongBao.lienKet,
                            idThongBao = thongBao.idThongBao  // ✅ lấy từ DB
                        });

                }
                await _context.SaveChangesAsync();

                return Ok(new { message = "✅ Đã duyệt, cập nhật tồn kho và vị trí thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server khi duyệt: {ex.Message}");
            }
        }
        [HttpGet("trangthai/{id}")]
        public async Task<IActionResult> GetTrangThaiPhieuNhap(int id)
        {
            var trangThai = await _context.ChiTietPhieuNhap
                .Where(x => x.idPhieuNhap == id)
                .Select(x => (int?)x.trangThai)
                .FirstOrDefaultAsync();

            return Ok(new { trangThai = trangThai ?? 1 }); // 1 = chờ duyệt
        }
        [HttpGet("chitiet/{id}")]
        public async Task<ActionResult<IEnumerable<object>>> GetChiTietPhieuNhap(int id)
        {
            var chiTiet = await _context.ChiTietPhieuNhap
     .Where(ct => ct.idPhieuNhap == id)
     .Include(ct => ct.SanPham)
     .Select(ct => new
     {
         ct.idPhieuNhap,
         ct.idSanPham,
         sanPham = new
         {
             ct.SanPham.tenSanPham,
             ct.SanPham.idSanPham,
             ct.SanPham.DanhMuc,
             ct.SanPham.hinhAnh
         },
         nguoiGiao = ct.nguoiGiaoHang,
         ct.soLuongTheoChungTu,
         ct.soLuongThucNhap,
         ct.donGia,
         ct.tongTien,

         viTri = (
    from vt in _context.ChiTietLuuTru
    where vt.idPhieuNhap == id && vt.idSanPham == ct.idSanPham
    join v in _context.ViTri on vt.idViTri equals v.idViTri
    select new
    {
        v.idViTri,
        v.day,
        v.cot,
        v.tang,
        soLuong = vt.soLuong
    }
).Union(
    from vt in _context.ViTriLuuTam
    where vt.idPhieuNhap == id && vt.idSanPham == ct.idSanPham
    join v in _context.ViTri on vt.idViTri equals v.idViTri
    select new
    {
        v.idViTri,
        v.day,
        v.cot,
        v.tang,
        soLuong = vt.soLuong
    }
).ToList()

     })
     .ToListAsync();


            return Ok(chiTiet);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhieuNhap(int id)
        {
            var phieuNhap = await _context.PhieuNhap.FindAsync(id);
            if (phieuNhap == null) return NotFound();
            _context.PhieuNhap.Remove(phieuNhap);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private async Task<string> TaoSoLoTuDong(int idNhaCungCap)
        {
            string maNcc = $"NCC{idNhaCungCap:D2}";
            string ngay = DateTime.Now.ToString("yyyyMMdd");

            // Đếm số lô đã tạo hôm nay của NCC này
            int stt = await _context.LoHang
                .Where(l => l.idNhaCungCap == idNhaCungCap && l.ngayNhapLo.Date == DateTime.Today)
                .CountAsync() + 1;

            return $"LO-{maNcc}-{ngay}-{stt:D2}";
        }
        [HttpPost("luu-vi-tri")]
        public async Task<IActionResult> LuuViTriTam([FromBody] List<ChiTietLuuTruDto> ds)
        {
            if (ds == null || !ds.Any())
                return BadRequest("Payload trống!");

            int idPhieuNhap = ds.First().idPhieuNhap;

            // Xoá vị trí tạm cũ
            var old = await _context.ViTriLuuTam.Where(v => v.idPhieuNhap == idPhieuNhap).ToListAsync();
            _context.ViTriLuuTam.RemoveRange(old);

            // Thêm mới
            foreach (var item in ds)
            {
                _context.ViTriLuuTam.Add(new ViTriLuuTam
                {
                    idPhieuNhap = item.idPhieuNhap,
                    idSanPham = item.idSanPham,
                    idViTri = item.idViTri,
                    soLuong = item.soLuong
                });
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "✅ Đã lưu vị trí tạm thành công!" });
        }


        [HttpGet("luu-tru")]
        public async Task<IActionResult> GetChiTietLuuTru()
        {
            var result = await _context.ChiTietLuuTru
                .Include(ct => ct.SanPham) // ✅ Lấy kèm thông tin sản phẩm
                .ToListAsync();

            return Ok(result);
        }
        [HttpPut("update-full/{id}")]
        public async Task<IActionResult> UpdatePhieuNhapFull(int id, [FromBody] PhieuNhapUpdateDto dto)
        {
            if (id != dto.idPhieuNhap)
                return BadRequest("ID phiếu nhập không khớp.");

            var phieuNhap = await _context.PhieuNhap
                .FirstOrDefaultAsync(p => p.idPhieuNhap == id);

            if (phieuNhap == null)
                return NotFound("Không tìm thấy phiếu nhập.");

            try
            {
                // ✅ Cập nhật ngày nhập mới
                phieuNhap.ngayNhap = dto.ngayNhap ?? DateTime.Now;

                // ✅ Xoá vị trí lưu trữ cũ
                var luuTruCu = await _context.ChiTietLuuTru
                    .Where(x => x.idPhieuNhap == id)
                    .ToListAsync();
                _context.ChiTietLuuTru.RemoveRange(luuTruCu);

                // ✅ Xoá chi tiết phiếu nhập cũ (phải truy vấn lại từ DB!)
                var oldChiTiet = await _context.ChiTietPhieuNhap
                    .Where(ct => ct.idPhieuNhap == id)
                    .ToListAsync();
                _context.ChiTietPhieuNhap.RemoveRange(oldChiTiet);

                await _context.SaveChangesAsync(); // 💾 Lưu các xoá để tránh trùng khóa chính

                // ✅ Thêm chi tiết mới
                foreach (var ct in dto.chiTietPhieuNhaps)
                {
                    if (ct.idSanPham <= 0 || ct.soLuong <= 0 || ct.donGia <= 0)
                        return BadRequest("Dữ liệu chi tiết phiếu nhập không hợp lệ!");

                    _context.ChiTietPhieuNhap.Add(new ChiTietPhieuNhap
                    {
                        idPhieuNhap = id,
                        idSanPham = ct.idSanPham,
                        soLuongTheoChungTu = ct.soLuong,
                        soLuongThucNhap = ct.soLuong,
                        donGia = ct.donGia,
                        tongTien = ct.soLuong * ct.donGia,
                        trangThai = 1,
                        nguoiGiaoHang = ct.nguoiGiaoHang ?? ""
                    });
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = "✅ Cập nhật phiếu nhập thành công!" });
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Lỗi UpdatePhieuNhapFull:");
                Console.WriteLine("ID: " + dto.idPhieuNhap);
                Console.WriteLine("Ngày nhập: " + dto.ngayNhap);
                foreach (var ct in dto.chiTietPhieuNhaps)
                {
                    Console.WriteLine($"- SP: {ct.idSanPham}, SL: {ct.soLuong}, ĐG: {ct.donGia}, Ghi chú: {ct.ghiChu}");
                }
                Console.WriteLine("Chi tiết lỗi: " + ex.ToString());
                return StatusCode(500, $"❌ Lỗi server: {ex.Message}");
            }
        }



    }
}