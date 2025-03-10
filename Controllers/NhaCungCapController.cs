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
    public class NhaCungCapController : ControllerBase
    {
        private readonly WarehouseContext _context;

        public NhaCungCapController(WarehouseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NhaCungCap>>> GetNhaCungCap()
        {
            return await _context.NhaCungCap
                .Include(nc => nc.PhuongXa) // Load thông tin Phường/Xã của Nhà Cung Cấp
                .ThenInclude(px => px.QuanHuyen) // Load Quận/Huyện
                .ThenInclude(qh => qh.TinhThanh) // Load Tỉnh/Thành
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<NhaCungCap>> GetNhaCungCap(int id)
        {
            var nhaCungCap = await _context.NhaCungCap
                .Include(nc => nc.PhuongXa)
                .ThenInclude(px => px.QuanHuyen)
                .ThenInclude(qh => qh.TinhThanh)
                .FirstOrDefaultAsync(nc => nc.idNhaCungCap == id);

            if (nhaCungCap == null)
            {
                return NotFound();
            }

            return nhaCungCap;
        }

        [HttpPost]
        public async Task<ActionResult<NhaCungCap>> PostNhaCungCap(NhaCungCap nhaCungCap)
        {
            _context.NhaCungCap.Add(nhaCungCap);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetNhaCungCap), new { id = nhaCungCap.idNhaCungCap }, nhaCungCap);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutNhaCungCap(int id, NhaCungCap nhaCungCap)
        {
            if (id != nhaCungCap.idNhaCungCap)
            {
                return BadRequest();
            }

            _context.Entry(nhaCungCap).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.NhaCungCap.Any(nc => nc.idNhaCungCap == id))
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNhaCungCap(int id)
        {
            var nhaCungCap = await _context.NhaCungCap.FindAsync(id);
            if (nhaCungCap == null)
            {
                return NotFound();
            }

            _context.NhaCungCap.Remove(nhaCungCap);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
