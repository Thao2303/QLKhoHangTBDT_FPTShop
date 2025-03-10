using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyKhoHangFPTShop.Data;
using QuanLyKhoHangFPTShop.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace QLKhoHangFPTShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DanhMucController:ControllerBase
    {
        private readonly WarehouseContext _context;

        public DanhMucController(WarehouseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DanhMuc>>> GetDanhMuc()
        {
            return await _context.DanhMuc.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DanhMuc>> GetDanhMuc(int id)
        {
            var danhMuc = await _context.DanhMuc.FindAsync(id);
            if (danhMuc == null)
            {
                return NotFound();
            }
            return Ok(danhMuc);
        }

        [HttpPost]
        public async Task<ActionResult<DanhMuc>> PostDanhMuc(DanhMuc danhMuc)
        {
            _context.DanhMuc.Add(danhMuc);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetDanhMuc), new { id = danhMuc.idDanhMuc}, danhMuc);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutDanhMuc(int id, DanhMuc danhMuc)
        {
            if (id != danhMuc.idDanhMuc)
            {
                return BadRequest();
            }

            _context.Entry(danhMuc).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDanhMuc(int id)
        {
            var danhMuc = await _context.DanhMuc.FindAsync(id);
            if (danhMuc != null)
            {
                return NotFound();
            }

            _context.DanhMuc.Remove(danhMuc);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
