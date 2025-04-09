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

    }
}
