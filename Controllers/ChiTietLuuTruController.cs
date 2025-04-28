// Controllers/LuuTruController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyKhoHangFPTShop.Data;
using QuanLyKhoHangFPTShop.Models;

namespace QuanLyKhoHangFPTShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChiTietLuuTruController : ControllerBase
    {
        private readonly WarehouseContext _context;

        public ChiTietLuuTruController(WarehouseContext context)
        {
            _context = context;
        }

        // GET: api/luutru/vitri/5
        [HttpGet("vitri/{id}")]
        public async Task<IActionResult> GetSanPhamTheoViTri(int id)
        {
            var result = await _context.ChiTietLuuTru
                .Include(x => x.SanPham)
                .Where(x => x.idViTri == id)
                .Select(x => new
                {
                    x.SanPham.tenSanPham,
                    x.soLuong
                })
                .ToListAsync();

            return Ok(result);
        }

        [HttpGet("chitietluutru/vitri/{id}")]
        public async Task<IActionResult> GetSanPhamTrongViTri(int id)
        {
            var result = await _context.ChiTietLuuTru
                .Where(x => x.idViTri == id)
                .Include(x => x.SanPham)
                .Select(x => new
                {
                    x.idChiTietLuuTru,
                    x.soLuong,
                    x.thoiGianLuu,
                    tenSanPham = x.SanPham.tenSanPham,
                    sku = x.SanPham.sku,
                    mauSac = x.SanPham.mauSac
                })
                .ToListAsync();

            return Ok(result);
        }

        [HttpGet("sanpham/{ten}")]
        public async Task<IActionResult> GetByTenSanPham(string ten)
        {
            var danhSach = await _context.ChiTietLuuTru
                .Include(c => c.SanPham)
                .Include(c => c.ViTri)
                .Where(c => c.SanPham.tenSanPham.Contains(ten))
                .Select(c => new {
                    c.ViTri.IdViTri,
                    c.ViTri.Day,
                    c.ViTri.Cot,
                    c.ViTri.Tang,
                    c.SanPham.tenSanPham,
                    c.soLuong
                })
                .ToListAsync();

            return Ok(danhSach);
        }

        [HttpGet("chitietluutru/sanpham/{idSanPham}")]
        public async Task<ActionResult<IEnumerable<object>>> GetViTriTheoSanPham(int idSanPham)
        {
            var result = await _context.ChiTietLuuTru
                .Include(ct => ct.ViTri)
                .Where(ct => ct.idSanPham == idSanPham)
                .GroupBy(ct => ct.idViTri)
                .Select(g => new {
                    idViTri = g.Key,
                    soLuong = g.Sum(x => x.soLuong),
                    vitri = g.Select(x => x.ViTri).FirstOrDefault()
                })
                .ToListAsync();

            return Ok(result);
        }

    }
}
