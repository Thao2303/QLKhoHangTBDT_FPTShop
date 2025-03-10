using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyKhoHangFPTShop.Data;
using QuanLyKhoHangFPTShop.Models;

namespace WarehouseManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SanPhamController : ControllerBase
    {
        private readonly WarehouseContext _context;

        public SanPhamController(WarehouseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SanPham>>> GetSanPhams()
        {
            return await _context.SanPham.ToListAsync();
        }
   

        [HttpGet("{id}")]
        public async Task<ActionResult<SanPham>> GetSanPham(int id)
        {
            var sanPham = await _context.SanPham.FindAsync(id);
            if (sanPham == null) return NotFound();
            return sanPham;
        }

        [HttpPost]
        public async Task<ActionResult<SanPham>> PostSanPham(SanPham sanPham)
        {
            _context.SanPham.Add(sanPham);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetSanPham), new { id = sanPham.idSanPham }, sanPham);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutSanPham(int id, SanPham sanPham)
        {
            if (id != sanPham.idSanPham) return BadRequest();
            _context.Entry(sanPham).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSanPham(int id)
        {
            var sanPham = await _context.SanPham.FindAsync(id);
            if (sanPham == null) return NotFound();
            _context.SanPham.Remove(sanPham);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
