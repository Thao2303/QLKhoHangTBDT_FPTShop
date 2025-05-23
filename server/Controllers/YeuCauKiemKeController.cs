// 📁 Controllers/YeuCauKiemKeController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyKhoHangFPTShop.server.Models;
using QuanLyKhoHangFPTShop.server.Data;
using QuanLyKhoHangFPTShop.server.Dtos;

namespace QuanLyKhoHangFPTShop.server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class YeuCauKiemKeController : ControllerBase
    {
        private readonly WarehouseContext _context;

        public YeuCauKiemKeController(WarehouseContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _context.YeuCauKiemKe
                .Include(x => x.ChiTietYeuCau)
                    .ThenInclude(c => c.SanPham)
                .Include(x => x.NguoiTaoTaiKhoan)
                .OrderByDescending(x => x.ngayTao)
                .Select(y => new
                {
                    y.idYeuCauKiemKe,
                    y.ngayTao,
                    y.mucDich,
                    y.viTriKiemKe,
                    y.trangThai,
                    y.ghiChu,
                    nguoiTao = y.NguoiTaoTaiKhoan != null ? y.NguoiTaoTaiKhoan.tenTaiKhoan : null,
                    y.tenTruongBan,
                    y.tenUyVien1,
                    y.tenUyVien2,
                    chiTietYeuCau = y.ChiTietYeuCau.Select(ct => new
                    {
                        ct.idSanPham,
                        ct.SanPham.tenSanPham,
                        ct.SanPham.soLuongHienCon
                    })
                })
                .ToListAsync();

            return Ok(list);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var yckk = await _context.YeuCauKiemKe
                .Include(x => x.ChiTietYeuCau).ThenInclude(c => c.SanPham)
                .Include(x => x.NguoiTaoTaiKhoan)
                .FirstOrDefaultAsync(x => x.idYeuCauKiemKe == id);

            if (yckk == null) return NotFound();

            var viTriSanPham = await (
                from ct in _context.ChiTietYeuCauKiemKe
                join sp in _context.SanPham on ct.idSanPham equals sp.idSanPham
                join lt in _context.ChiTietLuuTru on sp.idSanPham equals lt.idSanPham
                join vt in _context.ViTri on lt.idViTri equals vt.IdViTri
                where ct.idYeuCauKiemKe == id
                group lt by new { sp.idSanPham, sp.tenSanPham, lt.idViTri, vt.Day, vt.Cot, vt.Tang } into g
                select new
                {
                    g.Key.idSanPham,
                    g.Key.tenSanPham,
                    g.Key.idViTri,
                    viTri = g.Key.Day + "-" + g.Key.Cot + "-" + g.Key.Tang,
                    soLuongTaiViTri = g.Sum(x => x.soLuong)
                }
            ).ToListAsync();

            var sanPhamList = await _context.SanPham
                .Select(sp => new { sp.idSanPham, sp.tenSanPham, sp.soLuongHienCon })
                .ToListAsync();

            return Ok(new
            {
                yckk.idYeuCauKiemKe,
                yckk.ngayTao,
                yckk.mucDich,
                yckk.viTriKiemKe,
                yckk.trangThai,
                yckk.ghiChu,
                nguoiTao = yckk.NguoiTaoTaiKhoan?.tenTaiKhoan,
                yckk.tenTruongBan,
                yckk.tenUyVien1,
                yckk.tenUyVien2,
                chiTietYeuCau = yckk.ChiTietYeuCau.Select(ct => new
                {
                    ct.idSanPham,
                    ct.SanPham.tenSanPham,
                    ct.SanPham.soLuongHienCon
                }),
                viTriSanPham,
                sanPhamList
            });
        }

        [HttpGet("taikhoan")]
        public async Task<IActionResult> LayDanhSachTaiKhoan()
        {
            var ds = await _context.TaiKhoan
                .Select(t => t.tenTaiKhoan)
                .ToListAsync();

            return Ok(ds);
        }



        // POST: api/yeucaukiemke
        [HttpPost]
        public async Task<IActionResult> TaoYeuCau([FromBody] YeuCauKiemKeTaoDto dto)
        {
            var yeuCau = new YeuCauKiemKe
            {
                mucDich = dto.mucDich,
                viTriKiemKe = dto.viTriKiemKe,
                ghiChu = dto.ghiChu,
                nguoiTao = dto.nguoiTao,
                tenTruongBan = dto.tenTruongBan,
                tenUyVien1 = dto.tenUyVien1,
                tenUyVien2 = dto.tenUyVien2,
                ngayTao = DateTime.Now,
                trangThai = 0
            };

            _context.YeuCauKiemKe.Add(yeuCau);
            await _context.SaveChangesAsync();

            foreach (var item in dto.chiTietYeuCau)
            {
                var chiTiet = new ChiTietYeuCauKiemKe
                {
                    idYeuCauKiemKe = yeuCau.idYeuCauKiemKe,
                    idSanPham = item.idSanPham
                };
                _context.ChiTietYeuCauKiemKe.Add(chiTiet);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Tạo yêu cầu kiểm kê thành công", id = yeuCau.idYeuCauKiemKe });
        }

        // PUT: api/yeucaukiemke/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> CapNhatYeuCau(int id, [FromBody] YeuCauKiemKeTaoDto dto)
        {
            var yeuCau = await _context.YeuCauKiemKe.Include(x => x.ChiTietYeuCau)
                .FirstOrDefaultAsync(x => x.idYeuCauKiemKe == id);

            if (yeuCau == null) return NotFound();

            if (yeuCau.trangThai != 0)
                return BadRequest("❌ Không thể chỉnh sửa yêu cầu đã được kiểm kê.");

            yeuCau.mucDich = dto.mucDich;
            yeuCau.viTriKiemKe = dto.viTriKiemKe;
            yeuCau.tenTruongBan = dto.tenTruongBan;
            yeuCau.tenUyVien1 = dto.tenUyVien1;
            yeuCau.tenUyVien2 = dto.tenUyVien2;

            _context.ChiTietYeuCauKiemKe.RemoveRange(yeuCau.ChiTietYeuCau);
            await _context.SaveChangesAsync();

            foreach (var item in dto.chiTietYeuCau)
            {
                var chiTiet = new ChiTietYeuCauKiemKe
                {
                    idYeuCauKiemKe = id,
                    idSanPham = item.idSanPham
                };
                _context.ChiTietYeuCauKiemKe.Add(chiTiet);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật yêu cầu kiểm kê thành công" });
        }

        // GET: api/yeucaukiemke/sanpham/5
        [HttpGet("sanpham/{idYeuCauKiemKe}")]
        public async Task<IActionResult> LaySanPhamCanKiem(int idYeuCauKiemKe)
        {
            var list = await _context.ChiTietYeuCauKiemKe
                .Where(x => x.idYeuCauKiemKe == idYeuCauKiemKe)
                .Include(x => x.SanPham)
                .Select(x => new
                {
                    x.idSanPham,
                    x.SanPham.tenSanPham,
                    x.SanPham.soLuongHienCon
                })
                .ToListAsync();
            return Ok(list);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> XoaYeuCau(int id)
        {
            var yeuCau = await _context.YeuCauKiemKe
                .Include(x => x.ChiTietYeuCau)
                .FirstOrDefaultAsync(x => x.idYeuCauKiemKe == id);

            if (yeuCau == null) return NotFound();

            if (yeuCau.trangThai != 0)
                return BadRequest("❌ Không thể xoá yêu cầu đã được kiểm kê.");

            _context.ChiTietYeuCauKiemKe.RemoveRange(yeuCau.ChiTietYeuCau);
            _context.YeuCauKiemKe.Remove(yeuCau);

            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã xoá yêu cầu kiểm kê." });
        }
    }
}