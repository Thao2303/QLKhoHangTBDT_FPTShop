// 📁 YeuCauKiemKeController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyKhoHangFPTShop.Data;
using QuanLyKhoHangFPTShop.Models;

namespace QuanLyKhoHangFPTShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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
                .Include(y => y.NguoiTao)
                .OrderByDescending(x => x.thoiGianTao)
                .ToListAsync();
            return Ok(list);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var yeuCau = await _context.YeuCauKiemKe
                .Include(y => y.ChiTiet)
                .ThenInclude(ct => ct.SanPham)
                .FirstOrDefaultAsync(y => y.idYeuCauKiemKe == id);

            if (yeuCau == null) return NotFound();

            var result = new
            {
                yeuCau.idYeuCauKiemKe,
                yeuCau.ghiChu,
                chiTiet = yeuCau.ChiTiet?.Select(ct => new
                {
                    ct.idSanPham,
                    ct.SanPham?.tenSanPham,
                    soLuongThucTe = 0,
                    phamChat = ""
                })
            };

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> TaoYeuCau(YeuCauKiemKeRequestDto dto)
        {
            var yeuCau = new YeuCauKiemKe
            {
                idNguoiTao = dto.idNguoiTao,
                thoiGianTao = DateTime.Now,
                trangThai = 1,
                ghiChu = dto.ghiChu
            };

            _context.YeuCauKiemKe.Add(yeuCau);
            await _context.SaveChangesAsync();

            foreach (var idSp in dto.danhSachSanPham)
            {
                _context.ChiTietYeuCauKiemKe.Add(new ChiTietYeuCauKiemKe
                {
                    idYeuCauKiemKe = yeuCau.idYeuCauKiemKe,
                    idSanPham = idSp
                });
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut("duyet/{id}")]
        public async Task<IActionResult> Duyet(int id)
        {
            var yc = await _context.YeuCauKiemKe.FindAsync(id);
            if (yc == null) return NotFound();

            yc.trangThai = 2;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Xoa(int id)
        {
            var yc = await _context.YeuCauKiemKe.FindAsync(id);
            if (yc == null) return NotFound();

            var chiTiet = _context.ChiTietYeuCauKiemKe.Where(c => c.idYeuCauKiemKe == id);
            _context.ChiTietYeuCauKiemKe.RemoveRange(chiTiet);
            _context.YeuCauKiemKe.Remove(yc);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }

    public class YeuCauKiemKeRequestDto
    {
        public int idNguoiTao { get; set; }
        public string ghiChu { get; set; } = string.Empty;
        public List<int> danhSachSanPham { get; set; } = new();
    }
}