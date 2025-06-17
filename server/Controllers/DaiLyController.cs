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
    public class DaiLyController : ControllerBase
    {
        private readonly WarehouseContext _context;

        public DaiLyController(WarehouseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DaiLy>>> GetDaiLy()
        {
            return await _context.DaiLy.ToListAsync();
        }



        [HttpGet("{id}")]
        public async Task<ActionResult<DaiLy>> GetDaiLy(int id)
        {
            var daiLy = await _context.DaiLy.FindAsync(id);
            if (daiLy == null)
            {
                return NotFound();
            }
            return daiLy;
        }

        [HttpPost]
        public async Task<ActionResult<DaiLy>> PostDaiLy(DaiLy daiLy)
        {
            _context.DaiLy.Add(daiLy);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetDaiLy), new { id = daiLy.idDaiLy }, daiLy);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutDaiLy(int id, DaiLy daiLy)
        {
            if (id != daiLy.idDaiLy)
            {
                return BadRequest();
            }

            _context.Entry(daiLy).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync(); // ✅ thêm dòng này để lưu vào DB
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.DaiLy.Any(e => e.idDaiLy == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent(); // thành công
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDaiLy(int id)
        {
            var daiLy = await _context.DaiLy.FindAsync(id);
            if (daiLy == null)
            {
                return NotFound();
            }

            _context.DaiLy.Remove(daiLy);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
