// 📁 KiemKeController.cs 
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyKhoHangFPTShop.Data;
using QuanLyKhoHangFPTShop.Dtos;
using QuanLyKhoHangFPTShop.Models;

namespace QuanLyKhoHangFPTShop.Controllers
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
                    .Select(k => new {
                        k.idKiemKe,
                        k.ngayKiemKe,
                        nguoiKiemKe = k.idNguoiThucHien,
                        k.ghiChu,
                        trangThai = k.YeuCauKiemKe.trangThai,
                        viTriKiemKe = k.YeuCauKiemKe.viTriKiemKe,
                        mucDich = k.YeuCauKiemKe.mucDich,
                        tenTruongBan = k.YeuCauKiemKe.tenTruongBan,
                        tenUyVien1 = k.YeuCauKiemKe.tenUyVien1,
                        tenUyVien2 = k.YeuCauKiemKe.tenUyVien2,
                        chiTietPhieuKiemKes = k.ChiTietKiemKe.Select(ct => new {
                            ct.idSanPham,
                            ct.soLuongTheoHeThong,
                            ct.soLuongThucTe,
                            tenSanPham = ct.SanPham.tenSanPham,
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
                trangThai = kiemKe.YeuCauKiemKe.trangThai,
                viTriKiemKe = kiemKe.YeuCauKiemKe.viTriKiemKe,
                mucDich = kiemKe.YeuCauKiemKe.mucDich,
                tenTruongBan = kiemKe.YeuCauKiemKe.tenTruongBan,
                tenUyVien1 = kiemKe.YeuCauKiemKe.tenUyVien1,
                tenUyVien2 = kiemKe.YeuCauKiemKe.tenUyVien2,
                chiTietPhieuKiemKes = kiemKe.ChiTietKiemKe.Select(ct => new
                {
                    ct.idSanPham,
                    tenSanPham = ct.SanPham.tenSanPham,
                    ct.soLuongTheoHeThong,
                    ct.soLuongThucTe,
                    chenhLech = ct.soLuongThucTe - ct.soLuongTheoHeThong,
                    ct.phamChat
                })
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
                        phamChat = string.Join(", ", g.Select(x => x.phamChat).Where(p => !string.IsNullOrEmpty(p)).Distinct())
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
                        soLuongThucTe = item.soLuongThucTe,
                        soLuongTheoHeThong = soLuongTheoHeThong,
                        phamChat = item.phamChat
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
                join vt in _context.ViTri on ct.idViTri equals vt.IdViTri
                where ct.idKiemKe == kiemKe.idKiemKe
                group ct by new { sp.idSanPham, sp.tenSanPham, ct.idViTri, vt.Day, vt.Cot, vt.Tang } into g
                select new
                {
                    idSanPham = g.Key.idSanPham,
                    tenSanPham = g.Key.tenSanPham,
                    idViTri = g.Key.idViTri,
                    viTri = g.Key.Day + "-" + g.Key.Cot + "-" + g.Key.Tang,
                    soLuongTaiViTri = g.Sum(x => x.soLuongThucTe)
                }
            ).ToListAsync();

            var tenNguoiThucHien = await _context.TaiKhoan
                .Where(t => t.idTaiKhoan == kiemKe.idNguoiThucHien)
                .Select(t => t.tenTaiKhoan)
                .FirstOrDefaultAsync();

            return Ok(new
            {
                kiemKe.idKiemKe,
                kiemKe.ngayKiemKe,
                nguoiKiemKe = kiemKe.idNguoiThucHien,
                tenNguoiThucHien,
                kiemKe.ghiChu,
                viTriKiemKe = kiemKe.YeuCauKiemKe.viTriKiemKe,
                mucDich = kiemKe.YeuCauKiemKe.mucDich,
                tenTruongBan = kiemKe.YeuCauKiemKe.tenTruongBan,
                tenUyVien1 = kiemKe.YeuCauKiemKe.tenUyVien1,
                tenUyVien2 = kiemKe.YeuCauKiemKe.tenUyVien2,
                chiTietPhieuKiemKes = kiemKe.ChiTietKiemKe.Select(ct => new {
                    ct.idSanPham,
                    tenSanPham = ct.SanPham.tenSanPham,
                    ct.soLuongTheoHeThong,
                    ct.soLuongThucTe,
                    chenhLech = ct.soLuongThucTe - ct.soLuongTheoHeThong,
                    ct.phamChat
                }),
                viTriSanPham
            });
        }

    }
}