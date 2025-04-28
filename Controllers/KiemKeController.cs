// 📁 KiemKeController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyKhoHangFPTShop.Data;
using QuanLyKhoHangFPTShop.Models;
using QuanLyKhoHangFPTShop.DTOs;

namespace QuanLyKhoHangFPTShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KiemKeController : ControllerBase
    {
        private readonly WarehouseContext _context;

        public KiemKeController(WarehouseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var danhSach = await _context.KiemKe
                .Include(k => k.NguoiThucHien)
                .Include(k => k.ChiTietKiemKe)
                    .ThenInclude(ct => ct.SanPham)
                .OrderByDescending(k => k.ngayKiemKe)
                .ToListAsync();

            return Ok(danhSach);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var kiemKe = await _context.KiemKe
                .Include(k => k.NguoiThucHien)
                .Include(k => k.ChiTietKiemKe)
                    .ThenInclude(ct => ct.SanPham)
                .FirstOrDefaultAsync(k => k.idKiemKe == id);

            if (kiemKe == null) return NotFound();

            return Ok(kiemKe);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> CapNhat(int id, [FromBody] YeuCauKiemKe capNhat)
        {
            var yc = await _context.YeuCauKiemKe.FindAsync(id);
            if (yc == null) return NotFound();

            yc.ghiChu = capNhat.ghiChu;
            yc.trangThai = capNhat.trangThai;
            await _context.SaveChangesAsync();

            return Ok();
        }
       

        // ✅ API lấy danh sách tồn kho hiện tại để kiểm kê
        [HttpGet("tonghop")]
        public async Task<ActionResult> GetSanPhamTonKho()
        {
            var result = await _context.SanPham
                .Select(sp => new
                {
                    sp.idSanPham,
                    sp.tenSanPham,
                    sp.soLuongHienCon
                }).ToListAsync();

            return Ok(result);
        }
        [HttpPost]
        public async Task<IActionResult> LuuPhieuKiemKe([FromBody] KiemKeRequestDto dto)
        {
            var yeuCau = await _context.YeuCauKiemKe.FindAsync(dto.idYeuCauKiemKe);
            if (yeuCau == null) return NotFound("Không tìm thấy yêu cầu kiểm kê.");

            var phieu = new KiemKe
            {
                idYeuCauKiemKe = dto.idYeuCauKiemKe,
                ngayKiemKe = dto.ngayKiemKe ?? DateTime.Now,
                thoiGianThucHien = DateTime.Now,
                ghiChu = dto.ghiChu,
                mucDich = dto.mucDich,
                viTriKiemKe = dto.viTriKiemKe,
                tenTruongBan = dto.tenTruongBan,
                chucVuTruongBan = dto.chucVuTruongBan,
                tenUyVien1 = dto.tenUyVien1,
                chucVuUyVien1 = dto.chucVuUyVien1,
                tenUyVien2 = dto.tenUyVien2,
                chucVuUyVien2 = dto.chucVuUyVien2,
                idNguoiThucHien = 1 // giả định tạm thời cho người thực hiện (có thể lấy từ user login)
            };

            _context.KiemKe.Add(phieu);
            await _context.SaveChangesAsync();

            foreach (var item in dto.chiTiet)
            {
                var sanPham = await _context.SanPham.FindAsync(item.idSanPham);
                if (sanPham == null) continue;

                var chiTiet = new ChiTietKiemKe
                {
                    idKiemKe = phieu.idKiemKe,
                    idSanPham = item.idSanPham,
                    soLuongThucTe = item.soLuongThucTe,
                    soLuongTheoHeThong = sanPham.soLuongHienCon,
                    phamChat = item.phamChat
                };

                _context.ChiTietKiemKe.Add(chiTiet);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Lưu phiếu kiểm kê thành công!", id = phieu.idKiemKe });
        }

    }


}