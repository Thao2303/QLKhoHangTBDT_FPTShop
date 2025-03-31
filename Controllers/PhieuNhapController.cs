using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyKhoHangFPTShop.Data;
using QuanLyKhoHangFPTShop.Models;

namespace QuanLyKhoHangFPTShop.Controllers
{
    [Route("api/phieunhap")]
    [ApiController]
    public class PhieuNhapController : ControllerBase
    {
        private readonly WarehouseContext _context;

        public PhieuNhapController(WarehouseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetPhieuNhap()
        {
            var phieuNhaps = await _context.PhieuNhap
                .Include(p => p.NhaCungCap)
                .Include(p => p.TaiKhoan)
                .Include(p => p.ChiTietPhieuNhap)
                .Select(p => new
                {
                    p.idPhieuNhap,
                    p.ngayNhap,
                    p.idTaiKhoan,
                    p.idNhaCungCap,
                    nhaCungCap = new
                    {
                        p.NhaCungCap.idNhaCungCap,
                        p.NhaCungCap.tenNhaCungCap
                    },
                    taiKhoan = new
                    {
                        p.TaiKhoan.idTaiKhoan,
                        p.TaiKhoan.tenTaiKhoan
                    },
                    trangThai = p.ChiTietPhieuNhap.Select(ct => (int?)ct.trangThai).FirstOrDefault() ?? 1
                })
                .ToListAsync();

            return Ok(phieuNhaps);
        }

        [HttpPost]
        public async Task<ActionResult> CreatePhieuNhap(PhieuNhapCreateDto dto)
        {
            try
            {
                var phieuNhap = new PhieuNhap
                {
                    idTaiKhoan = dto.idTaiKhoan,
                    idNhaCungCap = dto.idNhaCungCap,
                    ngayNhap = dto.ngayNhap
                };

                _context.PhieuNhap.Add(phieuNhap);
                await _context.SaveChangesAsync();

                foreach (var item in dto.products)
                {
                    var chiTiet = new ChiTietPhieuNhap
                    {
                        idPhieuNhap = phieuNhap.idPhieuNhap,
                        idSanPham = item.product,
                        tongTien = item.unitPrice * item.quantity,
                        trangThai = 1,
                        soLuongTheoChungTu = item.quantity,
                        soLuongThucNhap = 0
                    };

                    _context.ChiTietPhieuNhap.Add(chiTiet);
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = "Tạo phiếu nhập thành công", id = phieuNhap.idPhieuNhap });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePhieuNhap(int id, PhieuNhap phieuNhap)
        {
            if (id != phieuNhap.idPhieuNhap) return BadRequest();
            _context.Entry(phieuNhap).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhieuNhap(int id)
        {
            var phieuNhap = await _context.PhieuNhap.FindAsync(id);
            if (phieuNhap == null) return NotFound();
            _context.PhieuNhap.Remove(phieuNhap);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}