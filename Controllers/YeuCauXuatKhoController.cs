// YeuCauXuatKhoController.cs - cập nhật nhận dữ liệu mở rộng
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
            yc.NgayYeuCau = DateTime.Now;
            _context.YeuCauXuatKho.Add(yc);
            await _context.SaveChangesAsync();
            return Ok(yc);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> CapNhatYeuCauXuatKho(int id, [FromBody] YeuCauXuatKho yeuCau)
        {
            if (id != yeuCau.IdYeuCauXuatKho) return BadRequest();



            _context.Entry(yeuCau).State = EntityState.Modified;

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

            yc.IdTrangThaiXacNhan = 2;
            await _context.SaveChangesAsync();
            return Ok(yc);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<YeuCauXuatKho>> GetYeuCauById(int id)
        {
            var yeuCau = await _context.YeuCauXuatKho
                .Include(y => y.ChiTietYeuCauXuatKhos).ThenInclude(ct => ct.SanPham)
                .Include(y => y.DaiLy)
                .Include(y => y.TrangThaiXacNhan)
                .FirstOrDefaultAsync(y => y.IdYeuCauXuatKho == id);

            if (yeuCau == null)
                return NotFound();

            return yeuCau;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<YeuCauXuatKho>>> GetYeuCauXuatKho()
        {
            return await _context.YeuCauXuatKho
                .Include(yc => yc.DaiLy)
                .Include(yc => yc.TrangThaiXacNhan)
                .ToListAsync();
        }

        [HttpGet("chitiet/{id}")]
        public async Task<ActionResult<IEnumerable<ChiTietYeuCauXuatKho>>> GetChiTiet(int id)
        {
            return await _context.ChiTietYeuCauXuatKho
                .Where(ct => ct.idYeuCauXuatKho == id)
                .Include(ct => ct.SanPham)
                .ToListAsync();
        }

        // Lấy tất cả danh mục
        [HttpGet("danhmuc")]
        public async Task<IActionResult> GetDanhMuc()
        {
            var list = await _context.DanhMuc.ToListAsync();
            return Ok(list);
        }

        [HttpGet("donvitinh")] // không có slash đầu
        public async Task<IActionResult> GetDonViTinh()
        {
            var list = await _context.DonViTinh.ToListAsync();
            return Ok(list);
        }


        // Lấy sản phẩm theo danh mục
        [HttpGet("sanpham/danhmuc/{id}")]
        public async Task<IActionResult> GetSanPhamTheoDanhMuc(int id)
        {
            var list = await _context.SanPham
                .Where(sp => sp.idDanhMuc == id)
                .ToListAsync();
            return Ok(list);
        }
        [HttpGet("tonkho/{id}")]
        public IActionResult GetTonKho(int id)
        {
            var sp = _context.SanPham.FirstOrDefault(s => s.idSanPham == id);
            if (sp == null)
                return NotFound();

            return Ok(sp.soLuongHienCon);
        }

    }
}
