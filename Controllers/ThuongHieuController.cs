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
    public class ThuongHieuController : ControllerBase
    {
        private readonly WarehouseContext _context;

        public ThuongHieuController(WarehouseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ThuongHieu>>> GetThuongHieu()
        {
            return await _context.ThuongHieu.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ThuongHieu>> GetThuongHieu(int id)
        {
            var thuongHieu = await _context.ThuongHieu.FindAsync(id);
            if (thuongHieu == null)
            {
                return NotFound();
            }
            return thuongHieu;
        }

        [HttpPost]
        public async Task<ActionResult<ThuongHieu>> PostThuongHieu(ThuongHieu thuongHieu)
        {
            _context.ThuongHieu.Add(thuongHieu);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetThuongHieu), new { id = thuongHieu.idThuongHieu }, thuongHieu);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutThuongHieu(int id, ThuongHieu thuongHieu)
        {
            if (id != thuongHieu.idThuongHieu)
            {
                return BadRequest();
            }

            _context.Entry(thuongHieu).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteThuongHieu(int id)
        {
            var thuongHieu = await _context.ThuongHieu.FindAsync(id);
            if (thuongHieu == null)
            {
                return NotFound();
            }

            _context.ThuongHieu.Remove(thuongHieu);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
