using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyKhoHangFPTShop.Data;
using QuanLyKhoHangFPTShop.Models;

namespace QuanLyKhoHangFPTShop.Controllers
{
    [Route("api/thongso")]
    [ApiController]
    public class ThongSoKyThuatController : ControllerBase
    {
        private readonly WarehouseContext _context;

        public ThongSoKyThuatController(WarehouseContext context)
        {
            _context = context;
        }

        // GET: api/thongso
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _context.ThongSoKyThuat.ToListAsync();
            return Ok(list);
        }

        // POST: api/thongso
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ThongSoKyThuat ts)
        {
            if (ts == null || string.IsNullOrWhiteSpace(ts.tenThongSo))
                return BadRequest("Tên thông số không được để trống");

            var newTS = new ThongSoKyThuat
            {
                tenThongSo = ts.tenThongSo
            };

            _context.ThongSoKyThuat.Add(newTS);
            await _context.SaveChangesAsync();

            return Ok(new { message = "✅ Đã thêm", id = newTS.idThongSo });
        }

        // DELETE: api/thongso/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ts = await _context.ThongSoKyThuat.FindAsync(id);
            if (ts == null) return NotFound("Không tìm thấy thông số");

            _context.ThongSoKyThuat.Remove(ts);
            await _context.SaveChangesAsync();

            return Ok(new { message = "✅ Đã xoá thông số" });
        }
    }
}
