using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyKhoHangFPTShop.Data;
using QuanLyKhoHangFPTShop.Models;

namespace QuanLyKhoHangFPTShop.Controllers
{
    [Route("api/thongso-chi-tiet")]
    [ApiController]
    public class ChiTietThongSoController : ControllerBase
    {
        private readonly WarehouseContext _context;

        public ChiTietThongSoController(WarehouseContext context)
        {
            _context = context;
        }

        [HttpGet("{idSanPham}")]
        public async Task<IActionResult> GetBySanPham(int idSanPham)
        {
            var list = await _context.ChiTietThongSoKyThuat
                .Where(x => x.idSanPham == idSanPham)
                .Include(x => x.ThongSoKyThuat)
                .ToListAsync();

            return Ok(list.Select(x => new
            {
                x.idThongSo,
                tenThongSo = x.ThongSoKyThuat.tenThongSo,
                x.giaTriThongSo
            }));
        }

        [HttpPost]
        public async Task<IActionResult> AddOrUpdateList([FromBody] List<ChiTietThongSoKyThuat> ds)
        {
            if (ds == null || ds.Count == 0)
                return BadRequest("Danh sách trống");

            int idSanPham = ds[0].idSanPham;

            // Xoá cũ
            var old = await _context.ChiTietThongSoKyThuat
                .Where(x => x.idSanPham == idSanPham)
                .ToListAsync();

            _context.ChiTietThongSoKyThuat.RemoveRange(old);

            // Thêm mới
            _context.ChiTietThongSoKyThuat.AddRange(ds);
            await _context.SaveChangesAsync();

            return Ok(new { message = "✅ Đã lưu thông số kỹ thuật!" });
        }
    }


}
