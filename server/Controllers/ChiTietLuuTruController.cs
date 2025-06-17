// Controllers/LuuTruController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyKhoHangFPTShop.server.Models;
using QuanLyKhoHangFPTShop.server.Data;

namespace QuanLyKhoHangFPTShop.server.Controllers
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
                    x.SanPham.tenSanPham,
                    x.SanPham.sku,
                    x.SanPham.mauSac
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
                .Select(c => new
                {
                    c.ViTri.idViTri,
                    c.ViTri.day,
                    c.ViTri.cot,
                    c.ViTri.tang,
                    c.SanPham.tenSanPham,
                    c.soLuong
                })
                .ToListAsync();

            return Ok(danhSach);
        }

        [HttpGet("chitietluutru/sanpham/{idSanPham}")]
        public async Task<IActionResult> GetViTriTheoSanPham(int idSanPham)
        {
            var result = await _context.ChiTietLuuTru
                .Where(ct => ct.idSanPham == idSanPham)
                .Include(ct => ct.ViTri)
                .Include(ct => ct.SanPham)
                .GroupBy(ct => new
                {
                    ct.idViTri,
                    ct.ViTri.day,
                    ct.ViTri.cot,
                    ct.ViTri.tang,
                    ct.SanPham.tenSanPham
                })
                .Select(g => new
                {
                    g.Key.idViTri,
                    soLuong = g.Sum(ct => ct.soLuong),
                    g.Key.tenSanPham,
                    vitri = new
                    {
                        day = g.Key.day,
                        cot = g.Key.cot,
                        tang = g.Key.tang
                    }
                })
                .ToListAsync();

            return Ok(result);
        }


        [HttpGet]
        public async Task<IActionResult> GetTatCaChiTietViTri()
        {
            var result = await _context.ChiTietLuuTru
                .Include(x => x.SanPham)
                .Include(x => x.ViTri)
                .Select(x => new
                {
                    x.idSanPham,
                    x.SanPham.tenSanPham,
                    x.idViTri,
                    day = x.ViTri.day,
                    cot = x.ViTri.cot,
                    tang = x.ViTri.tang,
                    x.soLuong
                })
                .ToListAsync();

            return Ok(result);
        }


    }
}
