using Microsoft.AspNetCore.Mvc;
using QuanLyKhoHangFPTShop.server.Data;
using QuanLyKhoHangFPTShop.server.Models;
using Microsoft.EntityFrameworkCore;

namespace QuanLyKhoHangFPTShop.server.Controllers
{
    [Route("api/danhmuc")]
    [ApiController]
    public class DanhMucController : ControllerBase
    {
        private readonly WarehouseContext _context;

        public DanhMucController(WarehouseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DanhMuc>>> GetDanhMuc()
        {
            var danhMucs = await _context.DanhMuc.ToListAsync();
            return Ok(danhMucs);
        }

        [HttpPost]
        public async Task<IActionResult> CreateDanhMuc([FromBody] DanhMuc dto)
        {
            if (string.IsNullOrWhiteSpace(dto.tenDanhMuc))
                return BadRequest("Tên danh mục không được để trống");

            _context.DanhMuc.Add(dto);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Thêm danh mục thành công", id = dto.idDanhMuc });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDanhMuc(int id, [FromBody] DanhMuc dto)
        {
            if (id != dto.idDanhMuc) return BadRequest("ID không khớp");

            var existing = await _context.DanhMuc.FindAsync(id);
            if (existing == null) return NotFound("Không tìm thấy danh mục");

            existing.tenDanhMuc = dto.tenDanhMuc;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật thành công" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDanhMuc(int id)
        {
            var dm = await _context.DanhMuc.FindAsync(id);
            if (dm == null) return NotFound("Không tìm thấy danh mục");

            _context.DanhMuc.Remove(dm);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xoá danh mục" });
        }

    }
}
