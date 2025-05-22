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
        public async Task<IActionResult> GetViTriTheoSanPham(int idSanPham)
        {
            var result = await _context.ChiTietLuuTru
                .Where(ct => ct.idSanPham == idSanPham)
                .Include(ct => ct.ViTri)
                .Include(ct => ct.SanPham)
                .GroupBy(ct => new {
                    ct.idViTri,
                    ct.ViTri.Day,
                    ct.ViTri.Cot,
                    ct.ViTri.Tang,
                    ct.SanPham.tenSanPham
                })
                .Select(g => new {
                    idViTri = g.Key.idViTri,
                    soLuong = g.Sum(ct => ct.soLuong),
                    tenSanPham = g.Key.tenSanPham,
                    vitri = new
                    {
                        day = g.Key.Day,
                        cot = g.Key.Cot,
                        tang = g.Key.Tang
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
                    idSanPham = x.idSanPham,
                    tenSanPham = x.SanPham.tenSanPham,
                    idViTri = x.idViTri,
                    day = x.ViTri.Day,
                    cot = x.ViTri.Cot,
                    tang = x.ViTri.Tang,
                    soLuong = x.soLuong
                })
                .ToListAsync();

            return Ok(result);
        }


    }
}
