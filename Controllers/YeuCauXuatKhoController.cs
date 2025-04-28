// Controllers/LuuTruController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyKhoHangFPTShop.Data;
using QuanLyKhoHangFPTShop.Models;

namespace QuanLyKhoHangFPTShop.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class YeuCauXuatKhoController : ControllerBase
    {
        private readonly WarehouseContext _context;

        public YeuCauXuatKhoController(WarehouseContext context)
        {
            _context = context;
        }
        [HttpPost("tao")]
        public async Task<IActionResult> PostYeuCauXuatKho([FromBody] YeuCauXuatKho yc)
        {
            _context.YeuCauXuatKho.Add(yc);
            await _context.SaveChangesAsync();
            return Ok(yc);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> CapNhatYeuCauXuatKho(int id, [FromBody] YeuCauXuatKho yeuCau)
        {
            if (id != yeuCau.idYeuCauXuatKho)
                return BadRequest();

            // Cập nhật yêu cầu
            _context.Entry(yeuCau).State = EntityState.Modified;

            // Cập nhật từng chi tiết (xử lý lại hoặc xóa rồi thêm mới tùy logic)
            var chiTietCu = _context.ChiTietYeuCauXuatKho.Where(c => c.idYeuCauXuatKho == id);
            _context.ChiTietYeuCauXuatKho.RemoveRange(chiTietCu);
            await _context.SaveChangesAsync();

            if (yeuCau.ChiTietYeuCauXuatKhos != null)
            {
                foreach (var ct in yeuCau.ChiTietYeuCauXuatKhos)
                {
                    ct.idYeuCauXuatKho = id;
                    _context.ChiTietYeuCauXuatKho.Add(ct);
                }
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }
        [HttpPut("duyet/{id}")]
        public async Task<IActionResult> DuyetYeuCauXuatKho(int id)
        {
            var yc = await _context.YeuCauXuatKho.FindAsync(id);
            if (yc == null)
                return NotFound();

            yc.idTrangThaiXacNhan = 2; // đã duyệt
            await _context.SaveChangesAsync();
            return Ok(yc);
        }

        // 📌 3️⃣ Lấy 1 yêu cầu xuất kho cụ thể (bao gồm cả Chi tiết)
        [HttpGet("{id}")]
        public async Task<ActionResult<YeuCauXuatKho>> GetYeuCauById(int id)
        {
            var yeuCau = await _context.YeuCauXuatKho
                .Include(y => y.ChiTietYeuCauXuatKhos)
                .ThenInclude(ct => ct.SanPham)
                .Include(y => y.DaiLy)
                .Include(y => y.TrangThaiXacNhan)
                .FirstOrDefaultAsync(y => y.idYeuCauXuatKho == id);

            if (yeuCau == null)
                return NotFound();

            return yeuCau;
        }

        // 📌 1️⃣ Lấy tất cả yêu cầu xuất kho (có thể lọc theo trạng thái)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<YeuCauXuatKho>>> GetYeuCauXuatKho()
        {
            return await _context.YeuCauXuatKho
                .Include(yc => yc.DaiLy)
                .Include(yc => yc.TrangThaiXacNhan)
                .ToListAsync();
        }

        // 📌 2️⃣ Lấy chi tiết sản phẩm trong một yêu cầu
        [HttpGet("chitiet/{id}")]
        public async Task<ActionResult<IEnumerable<ChiTietYeuCauXuatKho>>> GetChiTiet(int id)
        {
            return await _context.ChiTietYeuCauXuatKho
                .Where(ct => ct.idYeuCauXuatKho == id)
                .Include(ct => ct.SanPham)
                .ToListAsync();
        }
    }

}
