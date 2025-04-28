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
    public class PhieuXuatController : ControllerBase
    {
        private readonly WarehouseContext _context;

        public PhieuXuatController(WarehouseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PhieuXuat>>> GetPhieuXuat()
        {
            return await _context.PhieuXuat
                .Include(px => px.YeuCauXuatKho)
                .Include(px => px.ChiTietPhieuXuats)
                .ThenInclude(ct => ct.SanPham)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PhieuXuat>> GetPhieuXuat(int id)
        {
            var phieuXuat = await _context.PhieuXuat
                .Include(px => px.YeuCauXuatKho)
                .Include(px => px.ChiTietPhieuXuats)
                .ThenInclude(ct => ct.SanPham)
                .FirstOrDefaultAsync(px => px.idPhieuXuat == id);

            if (phieuXuat == null)
            {
                return NotFound();
            }

            return phieuXuat;
        }

        [HttpPost("kiemtra-tonkho")]
        public async Task<IActionResult> KiemTraTonKho([FromBody] List<ChiTietPhieuXuat> ds)
        {
            foreach (var item in ds)
            {
                var sp = await _context.SanPham.FindAsync(item.idSanPham);
                if (sp == null || sp.soLuongHienCon < item.soLuong)
                {
                    return BadRequest($"Sản phẩm {item.idSanPham} không đủ tồn kho.");
                }
            }
            return Ok();
        }

        [HttpPost]
        public async Task<ActionResult<PhieuXuat>> PostPhieuXuat(PhieuXuat phieuXuat)
        {
            foreach (var ct in phieuXuat.ChiTietPhieuXuats)
            {
                var sp = await _context.SanPham.FindAsync(ct.idSanPham);
                if (sp != null) sp.soLuongHienCon -= ct.soLuong;
            }

            _context.PhieuXuat.Add(phieuXuat);
            await _context.SaveChangesAsync();

            var yc = await _context.YeuCauXuatKho.FindAsync(phieuXuat.idYeuCauXuatKho);
            if (yc != null)
            {
                yc.idTrangThaiXacNhan = 3;
                await _context.SaveChangesAsync();
            }

            return CreatedAtAction(nameof(GetPhieuXuat), new { id = phieuXuat.idPhieuXuat }, phieuXuat);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutPhieuXuat(int id, PhieuXuat phieuXuat)
        {
            if (id != phieuXuat.idPhieuXuat)
            {
                return BadRequest();
            }

            _context.Entry(phieuXuat).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.PhieuXuat.Any(px => px.idPhieuXuat == id))
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
        public async Task<IActionResult> DeletePhieuXuat(int id)
        {
            var phieuXuat = await _context.PhieuXuat.FindAsync(id);
            if (phieuXuat == null)
            {
                return NotFound();
            }

            _context.PhieuXuat.Remove(phieuXuat);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}