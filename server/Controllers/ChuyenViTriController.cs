using Microsoft.AspNetCore.Mvc;
using QuanLyKhoHangFPTShop.server.Models;
using QuanLyKhoHangFPTShop.server.Data;
using QuanLyKhoHangFPTShop.server.Dtos;

namespace QuanLyKhoHangFPTShop.server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChuyenViTriController : ControllerBase
    {
        private readonly WarehouseContext _context;

        public ChuyenViTriController(WarehouseContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult ChuyenViTri([FromBody] ChuyenViTriDto dto)
        {
            if (dto.soLuong <= 0)
                return BadRequest("Số lượng phải lớn hơn 0");

            var viTriCu = _context.ChiTietLuuTru
                .FirstOrDefault(x => x.idSanPham == dto.idSanPham && x.idViTri == dto.idViTriCu);

            if (viTriCu == null || viTriCu.soLuong < dto.soLuong)
                return BadRequest("Không đủ số lượng ở vị trí cũ để chuyển");

            // Trừ vị trí cũ
            viTriCu.soLuong -= dto.soLuong;
            if (viTriCu.soLuong == 0)
                _context.ChiTietLuuTru.Remove(viTriCu);

            // Cộng vị trí mới
            var viTriMoi = _context.ChiTietLuuTru
                .FirstOrDefault(x => x.idSanPham == dto.idSanPham && x.idViTri == dto.idViTriMoi);

            if (viTriMoi != null)
            {
                viTriMoi.soLuong += dto.soLuong;
            }
            else
            {
                _context.ChiTietLuuTru.Add(new ChiTietLuuTru
                {
                    idSanPham = dto.idSanPham,
                    idViTri = dto.idViTriMoi,
                    soLuong = dto.soLuong,
                    thoiGianLuu = DateTime.Now
                });
            }

            // ✅ Cập nhật lại DaDung cho vị trí cũ và mới
            var sanPham = _context.SanPham.FirstOrDefault(sp => sp.idSanPham == dto.idSanPham);
            if (sanPham != null)
            {
                var theTichMotSP = (sanPham.chieuDai ?? 0) * (sanPham.chieuRong ?? 0) * (sanPham.chieuCao ?? 0);
                var tongTheTich = theTichMotSP * dto.soLuong;

                var viTriEntityCu = _context.ViTri.FirstOrDefault(v => v.IdViTri == dto.idViTriCu);
                if (viTriEntityCu != null)
                    viTriEntityCu.DaDung -= (int)Math.Ceiling(tongTheTich);

                var viTriEntityMoi = _context.ViTri.FirstOrDefault(v => v.IdViTri == dto.idViTriMoi);
                if (viTriEntityMoi != null)
                    viTriEntityMoi.DaDung += (int)Math.Ceiling(tongTheTich);
            }

            _context.SaveChanges();
            return Ok(new { message = "✅ Đã chuyển vị trí thành công" });
        }

    }

}
