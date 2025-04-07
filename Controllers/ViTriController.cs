using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyKhoHangFPTShop.Data;
using QuanLyKhoHangFPTShop.Models;
using System.Collections.Generic;
using System.Linq;
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

        // GET: api/vitri
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ViTri>>> GetViTri()
        {
            return await _context.ViTri.ToListAsync();
        }

        // GET: api/vitri/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ViTri>> GetViTri(int id)
        {
            var viTri = await _context.ViTri.FindAsync(id);

            if (viTri == null)
            {
                return NotFound();
            }

            return viTri;
        }

        // POST: api/vitri
        [HttpPost]
        public async Task<ActionResult<ViTri>> PostViTri(ViTri viTri)
        {
            _context.ViTri.Add(viTri);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetViTri), new { id = viTri.IdViTri }, viTri);
        }

        // PUT: api/vitri/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutViTri(int id, ViTri viTri)
        {
            if (id != viTri.IdViTri)
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

        // DELETE: api/vitri/5
        [HttpDelete("{id}")]
        private bool ViTriExists(int id)
        {
            return _context.ViTri.Any(v => v.IdViTri == id); // Kiểm tra sự tồn tại của vị trí theo ID
        }

        // DELETE: api/vitri/5
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
    }
}
