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

        // 📌 1️⃣ Lấy danh sách phiếu xuất
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PhieuXuat>>> GetPhieuXuat()
        {
            return await _context.PhieuXuat
                .Include(px => px.YeuCauXuatKho) // Load yêu cầu xuất kho
                .Include(px => px.ChiTietPhieuXuats) // Load chi tiết phiếu xuất
                .ThenInclude(ct => ct.SanPham) // Load sản phẩm xuất
                .ToListAsync();
        }

        // 📌 2️⃣ Lấy phiếu xuất theo ID
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

        // 📌 3️⃣ Thêm phiếu xuất mới
        [HttpPost]
        public async Task<ActionResult<PhieuXuat>> PostPhieuXuat(PhieuXuat phieuXuat)
        {
            _context.PhieuXuat.Add(phieuXuat);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPhieuXuat), new { id = phieuXuat.idPhieuXuat }, phieuXuat);
        }

        // 📌 4️⃣ Cập nhật phiếu xuất
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

        // 📌 5️⃣ Xóa phiếu xuất
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
