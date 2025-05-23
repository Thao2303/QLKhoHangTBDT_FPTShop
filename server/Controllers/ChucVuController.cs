using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyKhoHangFPTShop.server.Data;
using QuanLyKhoHangFPTShop.server.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace QuanLyKhoHangFPTShop.server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChucVuController : ControllerBase
    {
        private readonly WarehouseContext _context;

        public ChucVuController(WarehouseContext context)
        {
            _context = context;
        }

        // Lấy danh sách chức vụ
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChucVu>>> GetChucVu()
        {
            return await _context.ChucVu.ToListAsync();
        }

        // Lấy chi tiết một chức vụ
        [HttpGet("{id}")]
        public async Task<ActionResult<ChucVu>> GetChucVu(int id)
        {
            var chucVu = await _context.ChucVu.FindAsync(id);
            if (chucVu == null)
            {
                return NotFound();
            }
            return chucVu;
        }

        // Tạo chức vụ mới
        [HttpPost]
        public async Task<ActionResult<ChucVu>> PostChucVu(ChucVu chucVu)
        {
            _context.ChucVu.Add(chucVu);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetChucVu), new { id = chucVu.idChucVu }, chucVu);
        }

        // Cập nhật chức vụ
        [HttpPut("{id}")]
        public async Task<IActionResult> PutChucVu(int id, ChucVu chucVu)
        {
            if (id != chucVu.idChucVu)
            {
                return BadRequest();
            }

            _context.Entry(chucVu).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Xóa chức vụ
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteChucVu(int id)
        {
            var chucVu = await _context.ChucVu.FindAsync(id);
            if (chucVu == null)
            {
                return NotFound();
            }

            _context.ChucVu.Remove(chucVu);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
