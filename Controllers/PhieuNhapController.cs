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
    public class PhieuNhapController : ControllerBase
    {
        private readonly WarehouseContext _context;

        public PhieuNhapController(WarehouseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PhieuNhap>>> GetPhieuNhap()
        {
            return await _context.PhieuNhap
                .Include(pn => pn.TaiKhoan)  
                .Include(pn => pn.NhaCungCap) 
                .Include(pn => pn.ChiTietPhieuNhaps)
                .ThenInclude(ct => ct.SanPham) 
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PhieuNhap>> GetPhieuNhap(int id)
        {
            var phieuNhap = await _context.PhieuNhap
                .Include(pn => pn.TaiKhoan)
                .Include(pn => pn.NhaCungCap)
                .Include(pn => pn.ChiTietPhieuNhaps)
                .ThenInclude(ct => ct.SanPham)
                .FirstOrDefaultAsync(pn => pn.idPhieuNhap == id);

            if (phieuNhap == null)
            {
                return NotFound();
            }

            return phieuNhap;
        }

        [HttpPost]
        public async Task<ActionResult<PhieuNhap>> PostPhieuNhap(PhieuNhap phieuNhap)
        {
            if (phieuNhap.ChiTietPhieuNhaps == null)
            {
                phieuNhap.ChiTietPhieuNhaps = new List<ChiTietPhieuNhap>();
            }

            foreach (var ct in phieuNhap.ChiTietPhieuNhaps)
            {
                ct.PhieuNhap = null; 
            }

            _context.PhieuNhap.Add(phieuNhap);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPhieuNhap), new { id = phieuNhap.idPhieuNhap }, phieuNhap);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutPhieuNhap(int id, PhieuNhap phieuNhap)
        {
            if (id != phieuNhap.idPhieuNhap)
            {
                return BadRequest();
            }

            _context.Entry(phieuNhap).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.PhieuNhap.Any(pn => pn.idPhieuNhap == id))
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
        public async Task<IActionResult> DeletePhieuNhap(int id)
        {
            var phieuNhap = await _context.PhieuNhap.FindAsync(id);
            if (phieuNhap == null)
            {
                return NotFound();
            }

            _context.PhieuNhap.Remove(phieuNhap);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
