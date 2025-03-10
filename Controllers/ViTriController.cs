using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyKhoHangFPTShop.Data;
using QuanLyKhoHangFPTShop.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace QuanLyKhoHangFPTShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ViTriController : ControllerBase
    {
        private readonly WarehouseContext _context;

        public ViTriController(WarehouseContext context)
        {
            _context = context;
        }

        // 📌 1️⃣ Lấy danh sách vị trí
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ViTri>>> GetViTri()
        {
            return await _context.ViTri
                .Include(v => v.Tang) // ViTri có Tang
                .ThenInclude(t => t.Cot) // Tang có Cot
                .ThenInclude(c => c.Day) // Cot có Day
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ViTri>> GetViTri(int id)
        {
            var viTri = await _context.ViTri
                .Include(v => v.Tang)
                .ThenInclude(t => t.Cot)
                .ThenInclude(c => c.Day)
                .FirstOrDefaultAsync(v => v.idViTri == id);

            if (viTri == null)
            {
                return NotFound();
            }

            return viTri;
        }


        // 📌 3️⃣ Thêm vị trí mới
        [HttpPost]
        public async Task<ActionResult<ViTri>> PostViTri(ViTri viTri)
        {
            _context.ViTri.Add(viTri);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetViTri), new { id = viTri.idViTri }, viTri);
        }

        // 📌 4️⃣ Cập nhật vị trí
        [HttpPut("{id}")]
        public async Task<IActionResult> PutViTri(int id, ViTri viTri)
        {
            if (id != viTri.idViTri)
            {
                return BadRequest();
            }

            _context.Entry(viTri).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ViTriExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // 📌 5️⃣ Xóa vị trí
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteViTri(int id)
        {
            var viTri = await _context.ViTri.FindAsync(id);
            if (viTri == null)
            {
                return NotFound();
            }

            _context.ViTri.Remove(viTri);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // 📌 6️⃣ Kiểm tra vị trí có tồn tại không
        private bool ViTriExists(int id)
        {
            return _context.ViTri.Any(v => v.idViTri == id);
        }
    }
}
