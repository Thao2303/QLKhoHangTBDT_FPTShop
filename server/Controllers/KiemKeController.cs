// 📁 KiemKeController.cs 
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyKhoHangFPTShop.server.Data;
using QuanLyKhoHangFPTShop.server.Dtos;
using QuanLyKhoHangFPTShop.server.Models;

namespace QuanLyKhoHangFPTShop.server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KiemKeController : ControllerBase
    {
        private readonly WarehouseContext _context;

        public KiemKeController(WarehouseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var danhSach = await _context.KiemKe
                    .Include(k => k.YeuCauKiemKe)
                    .Include(k => k.ChiTietKiemKe).ThenInclude(ct => ct.SanPham)
                    .OrderByDescending(k => k.ngayKiemKe)
                    .Select(k => new
                    {
                        k.idKiemKe,
                        k.ngayKiemKe,
                        nguoiKiemKe = k.idNguoiThucHien,
                        k.ghiChu,
                        k.YeuCauKiemKe.trangThai,
                        k.YeuCauKiemKe.viTriKiemKe,
                        k.YeuCauKiemKe.mucDich,
                        k.YeuCauKiemKe.tenTruongBan,
                        k.YeuCauKiemKe.tenUyVien1,
                        k.YeuCauKiemKe.tenUyVien2,
                        chiTietPhieuKiemKes = k.ChiTietKiemKe.Select(ct => new
                        {
                            ct.idSanPham,
                            ct.soLuongTheoHeThong,
                            ct.soLuongThucTe,
                            ct.SanPham.tenSanPham,
                            chenhLech = ct.soLuongThucTe - ct.soLuongTheoHeThong,
                            ct.phamChat
                        })
                    }).ToListAsync();

                return Ok(danhSach);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"❌ Lỗi server: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var kiemKe = await _context.KiemKe
                .Include(k => k.YeuCauKiemKe)
                .Include(k => k.ChiTietKiemKe).ThenInclude(ct => ct.SanPham)
                .FirstOrDefaultAsync(k => k.idKiemKe == id);

            if (kiemKe == null) return NotFound();

            return Ok(new
            {
                kiemKe.idKiemKe,
                kiemKe.ngayKiemKe,
                nguoiKiemKe = kiemKe.idNguoiThucHien,
                kiemKe.ghiChu,
                kiemKe.YeuCauKiemKe.trangThai,
                kiemKe.YeuCauKiemKe.viTriKiemKe,
                kiemKe.YeuCauKiemKe.mucDich,
                kiemKe.YeuCauKiemKe.tenTruongBan,
                kiemKe.YeuCauKiemKe.tenUyVien1,
                kiemKe.YeuCauKiemKe.tenUyVien2,
                chiTietPhieuKiemKes = kiemKe.ChiTietKiemKe.Select(ct => new
                {
                    ct.idSanPham,
                    ct.idViTri, // ✅ cần dòng này
                    ct.SanPham.tenSanPham,
                    ct.soLuongTheoHeThong,
                    ct.soLuongThucTe,
                    chenhLech = ct.soLuongThucTe - ct.soLuongTheoHeThong,
                    ct.phamChat,
                    ct.ghiChu
                }),

            });
        }

        [HttpGet("tonghop")]
        public async Task<ActionResult> GetSanPhamTonKho()
        {
            var result = await _context.SanPham
                .Select(sp => new
                {
                    sp.idSanPham,
                    sp.tenSanPham,
                    sp.soLuongHienCon
                }).ToListAsync();

            return Ok(result);
        }
        // DELETE: api/yeucaukiemke/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var yeuCau = await _context.YeuCauKiemKe
                .Include(x => x.ChiTietYeuCau)
                .FirstOrDefaultAsync(x => x.idYeuCauKiemKe == id);

            if (yeuCau == null)
                return NotFound();

            _context.ChiTietYeuCauKiemKe.RemoveRange(yeuCau.ChiTietYeuCau);
            _context.YeuCauKiemKe.Remove(yeuCau);

            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã xoá yêu cầu kiểm kê." });
        }

        [HttpPost("tao")]
        public async Task<IActionResult> TaoPhieuKiemKe([FromBody] KiemKeTaoRequestDto dto)
        {
            try
            {
                // 🔄 Xoá phiếu kiểm kê cũ (nếu đã lưu nháp)
                var kiemKeCu = await _context.KiemKe
                    .Include(k => k.ChiTietKiemKe)
                    .FirstOrDefaultAsync(k => k.idYeuCauKiemKe == dto.idYeuCauKiemKe);

                if (kiemKeCu != null)
                {
                    _context.ChiTietKiemKe.RemoveRange(kiemKeCu.ChiTietKiemKe);
                    _context.KiemKe.Remove(kiemKeCu);
                    await _context.SaveChangesAsync();
                }

                var phieu = new KiemKe
                {
                    idYeuCauKiemKe = dto.idYeuCauKiemKe,
                    idNguoiThucHien = dto.idNguoiThucHien,
                    ngayKiemKe = dto.ngayKiemKe ?? DateTime.Now,
                    thoiGianThucHien = DateTime.Now,
                    ghiChu = dto.ghiChu
                };

                await _context.KiemKe.AddAsync(phieu);
                await _context.SaveChangesAsync();

                var chiTietGop = dto.chiTiet
                    .GroupBy(x => new { x.idSanPham, x.idViTri })
                    .Select(g => new
                    {
                        g.Key.idSanPham,
                        g.Key.idViTri,
                        soLuongThucTe = g.Sum(x => x.soLuongThucTe),
                        phamChat = string.Join(", ", g.Select(x => x.phamChat).Where(p => !string.IsNullOrEmpty(p)).Distinct()),
                        ghiChu = string.Join(" | ", g.Select(x => x.ghiChu).Where(p => !string.IsNullOrWhiteSpace(p)).Distinct())
                    });

                var danhSachChiTiet = new List<ChiTietKiemKe>();

                foreach (var item in chiTietGop)
                {
                    var sanPham = await _context.SanPham.FindAsync(item.idSanPham);
                    if (sanPham == null) continue;

                    int soLuongTheoHeThong = await _context.ChiTietLuuTru
                        .Where(x => x.idSanPham == item.idSanPham && x.idViTri == item.idViTri)
                        .SumAsync(x => (int?)x.soLuong) ?? 0;

                    danhSachChiTiet.Add(new ChiTietKiemKe
                    {
                        idKiemKe = phieu.idKiemKe,
                        idSanPham = item.idSanPham,
                        idViTri = item.idViTri,
                        soLuongThucTe = item.soLuongThucTe ?? 0,
                        soLuongTheoHeThong = soLuongTheoHeThong,
                        phamChat = item.phamChat,
                        ghiChu = item.ghiChu
                    });

                }

                _context.ChiTietKiemKe.AddRange(danhSachChiTiet);

                var yeuCau = await _context.YeuCauKiemKe.FindAsync(dto.idYeuCauKiemKe);
                if (yeuCau != null)
                    yeuCau.trangThai = 1;

                await _context.SaveChangesAsync();
                return Ok(new { message = "✅ Đã lưu kiểm kê theo vị trí", id = phieu.idKiemKe });
            }
            catch (Exception ex)
            {
                // Log lỗi chi tiết để bắt được nguyên nhân cụ thể
                return StatusCode(500, new { message = "❌ Lỗi khi tạo phiếu kiểm kaê", error = ex.Message, stackTrace = ex.StackTrace });
            }
        }



        [HttpGet("theo-yeucau/{idYeuCau}")]
        public async Task<IActionResult> GetTheoYeuCau(int idYeuCau)
        {
            var kiemKe = await _context.KiemKe
                .Include(k => k.YeuCauKiemKe)
                .Include(k => k.ChiTietKiemKe).ThenInclude(ct => ct.SanPham)
                .FirstOrDefaultAsync(k => k.idYeuCauKiemKe == idYeuCau);

            if (kiemKe == null) return NotFound();

            var viTriSanPham = await (
     from ct in _context.ChiTietKiemKe
     join sp in _context.SanPham on ct.idSanPham equals sp.idSanPham
     join vt in _context.ViTri on ct.idViTri equals vt.idViTri
     join lt in _context.ChiTietLuuTru on new { ct.idSanPham, ct.idViTri } equals new { lt.idSanPham, lt.idViTri }
     where ct.idKiemKe == kiemKe.idKiemKe
     group lt by new { lt.idSanPham, sp.tenSanPham, lt.idViTri, vt.day, vt.cot, vt.tang } into g
     select new
     {
         g.Key.idSanPham,
         g.Key.tenSanPham,
         g.Key.idViTri,
         viTri = g.Key.day + "-" + g.Key.cot + "-" + g.Key.tang,
         soLuongTaiViTri = g.Sum(x => x.soLuong) // ✅ lấy từ lưu trữ thực tế
     }
 ).ToListAsync();



            var tenNguoiThucHien = await _context.TaiKhoan
                .Where(t => t.idTaiKhoan == kiemKe.idNguoiThucHien)
                .Select(t => t.tenTaiKhoan)
                .FirstOrDefaultAsync();

            var sanPhamList = await _context.SanPham
    .Select(sp => new { sp.idSanPham, sp.tenSanPham, sp.soLuongHienCon })
    .ToListAsync();


            return Ok(new
            {
                kiemKe.idKiemKe,
                kiemKe.ngayKiemKe,
                nguoiKiemKe = kiemKe.idNguoiThucHien,
                tenNguoiThucHien,
                kiemKe.ghiChu,
                kiemKe.YeuCauKiemKe.viTriKiemKe,
                kiemKe.YeuCauKiemKe.mucDich,
                kiemKe.YeuCauKiemKe.tenTruongBan,
                kiemKe.YeuCauKiemKe.tenUyVien1,
                kiemKe.YeuCauKiemKe.tenUyVien2,
                chiTietPhieuKiemKes = kiemKe.ChiTietKiemKe.Select(ct => new
                {
                    ct.idSanPham,
                    ct.idViTri,
                    ct.SanPham.tenSanPham,
                    ct.soLuongTheoHeThong,
                    ct.soLuongThucTe,
                    chenhLech = ct.soLuongThucTe - ct.soLuongTheoHeThong,
                    ct.phamChat,
                    ct.ghiChu
                }),
                viTriSanPham,
                sanPhamList
            });
        }
        [HttpPost("luu-nhap")]
        public async Task<IActionResult> LuuPhieuKiemKeTam([FromBody] KiemKeTaoRequestDto dto)
        {
            try
            {
                int idYeuCau = dto.idYeuCauKiemKe;

                // 🔍 Xóa kiểm kê cũ (nếu có — lưu nháp trước đó)
                var kiemKeCu = await _context.KiemKe
                    .Include(k => k.ChiTietKiemKe)
                    .FirstOrDefaultAsync(k => k.idYeuCauKiemKe == idYeuCau);

                if (kiemKeCu != null)
                {
                    _context.ChiTietKiemKe.RemoveRange(kiemKeCu.ChiTietKiemKe);
                    _context.KiemKe.Remove(kiemKeCu);
                    await _context.SaveChangesAsync();
                }

                // 🆕 Tạo bản kiểm kê mới
                var phieu = new KiemKe
                {
                    idYeuCauKiemKe = dto.idYeuCauKiemKe,
                    idNguoiThucHien = dto.idNguoiThucHien,
                    ngayKiemKe = dto.ngayKiemKe ?? DateTime.Now,
                    thoiGianThucHien = DateTime.Now,
                    ghiChu = dto.ghiChu
                };

                await _context.KiemKe.AddAsync(phieu);
                await _context.SaveChangesAsync();

                var chiTietGop = dto.chiTiet
     .Where(x => x != null && x.idSanPham > 0 && x.idViTri > 0)
     .GroupBy(x => new { x.idSanPham, x.idViTri })
     .Select(g => new
     {
         g.Key.idSanPham,
         g.Key.idViTri,
         soLuongThucTe = g.Sum(x => x.soLuongThucTe ?? 0),
         phamChat = string.Join(", ", g.Select(x => x.phamChat ?? "").Where(p => !string.IsNullOrWhiteSpace(p)).Distinct()),
         ghiChu = string.Join(" | ", g.Select(x => x.ghiChu ?? "").Where(p => !string.IsNullOrWhiteSpace(p)).Distinct())
     }).ToList();


                var danhSachChiTiet = new List<ChiTietKiemKe>();

                foreach (var item in chiTietGop)
                {
                    int soLuongTheoHeThong = await _context.ChiTietLuuTru
                        .Where(x => x.idSanPham == item.idSanPham && x.idViTri == item.idViTri)
                        .SumAsync(x => (int?)x.soLuong) ?? 0;

                    danhSachChiTiet.Add(new ChiTietKiemKe
                    {
                        idKiemKe = phieu.idKiemKe,
                        idSanPham = item.idSanPham,
                        idViTri = item.idViTri,
                        soLuongThucTe = item.soLuongThucTe,
                        soLuongTheoHeThong = soLuongTheoHeThong,
                        phamChat = item.phamChat,
                        ghiChu = item.ghiChu
                    });
                }

                _context.ChiTietKiemKe.AddRange(danhSachChiTiet);
                // 🔄 Cập nhật trạng thái về "đang thực hiện" (-1)
                var yeuCau = await _context.YeuCauKiemKe.FindAsync(dto.idYeuCauKiemKe);
                if (yeuCau != null && yeuCau.trangThai == 0)
                    yeuCau.trangThai = -1;

                await _context.SaveChangesAsync();

                return Ok(new { message = "💾 Đã lưu nháp kiểm kê", id = phieu.idKiemKe });

            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ LỖI lưu nháp: " + ex.Message);
                Console.WriteLine("STACK: " + ex.StackTrace);
                return StatusCode(500, new
                {
                    message = "❌ Lỗi khi lưu nháp kiểm kê",
                    error = ex.Message,
                    stackTrace = ex.StackTrace
                });
            }
        }




    }
}