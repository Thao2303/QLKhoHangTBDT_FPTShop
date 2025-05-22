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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetViTri()
        {
            var list = await _context.ViTri
                .Include(v => v.KhuVuc)
                .Select(v => new
                {
                    idViTri = v.IdViTri,
                    day = v.Day,
                    cot = v.Cot,
                    tang = v.Tang,
                    sucChua = v.SucChua,
                    daDung = v.DaDung,
                  chieuDai = v.chieuDai,
                  chieuRong = v.chieuRong,
                  chieuCao = v.chieuCao,
                    khuVuc = new
                    {
                        idKhuVuc = v.KhuVuc.idKhuVuc,
                        tenKhuVuc = v.KhuVuc.tenKhuVuc,
                        loaiKhuVuc = v.KhuVuc.loaiKhuVuc
                    }
                })
                .ToListAsync();

            return Ok(list);
        }

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

        [HttpPost]
        public async Task<ActionResult<ViTri>> PostViTri(ViTri viTri)
        {
            if (viTri == null)
                return BadRequest("❌ Dữ liệu vị trí không hợp lệ!");

            if (viTri.idKhuVuc <= 0)
                return BadRequest("❌ Vui lòng chọn khu vực hợp lệ!");

            var khuVucTonTai = await _context.KhuVuc.AnyAsync(kv => kv.idKhuVuc == viTri.idKhuVuc);
            if (!khuVucTonTai)
                return BadRequest("❌ Khu vực không tồn tại!");

            _context.ViTri.Add(viTri);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetViTri), new { id = viTri.IdViTri }, viTri);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> PutViTri(int id, ViTri viTri)
        {
            if (id != viTri.IdViTri)
                return BadRequest("ID không khớp.");

            if (viTri == null || viTri.idKhuVuc == 0)
                return BadRequest("❌ Vui lòng chọn khu vực!");

            var khuVucTonTai = await _context.KhuVuc.AnyAsync(kv => kv.idKhuVuc == viTri.idKhuVuc);
            if (!khuVucTonTai)
                return BadRequest("❌ Khu vực không tồn tại!");


            _context.Entry(viTri).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ViTriExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        private bool ViTriExists(int id)
        {
            return _context.ViTri.Any(v => v.IdViTri == id);
        }

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
