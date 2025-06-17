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

            // 1) Lấy bản ghi ở vị trí cũ
            var viTriCu = _context.ChiTietLuuTru
                .FirstOrDefault(x => x.idSanPham == dto.idSanPham && x.idViTri == dto.idViTriCu);

            if (viTriCu == null || viTriCu.soLuong < dto.soLuong)
                return BadRequest("Không đủ số lượng ở vị trí cũ để chuyển");

            // 2) Trừ số lượng ở vị trí cũ
            viTriCu.soLuong -= dto.soLuong;
            if (viTriCu.soLuong == 0)
                _context.ChiTietLuuTru.Remove(viTriCu);

            // 3) Tính thể tích sản phẩm
            decimal tongTheTich = 0;
            var sanPham = _context.SanPham.FirstOrDefault(sp => sp.idSanPham == dto.idSanPham);
            if (sanPham != null)
            {
                decimal theTichMotSP = (sanPham.chieuDai ?? 0)
                                     * (sanPham.chieuRong ?? 0)
                                     * (sanPham.chieuCao ?? 0);
                tongTheTich = theTichMotSP * dto.soLuong;
            }

            // 4) Cộng số lượng vào vị trí mới
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
                    thoiGianLuu = DateTime.Now,
                    idPhieuNhap = viTriCu.idPhieuNhap // ✅ đảm bảo không null
                });
            }

            // 5) Cập nhật DaDung cho vị trí
            var viTriEntityCu = _context.ViTri.FirstOrDefault(v => v.idViTri == dto.idViTriCu);
            if (viTriEntityCu != null)
                viTriEntityCu.daDung -= (int)Math.Ceiling((double)tongTheTich);

            var viTriEntityMoi = _context.ViTri.FirstOrDefault(v => v.idViTri == dto.idViTriMoi);
            if (viTriEntityMoi != null)
                viTriEntityMoi.daDung += (int)Math.Ceiling((double)tongTheTich);

            // 6) Lưu thay đổi
            _context.SaveChanges();

            return Ok(new { message = "✅ Đã chuyển vị trí thành công" });
        }

    }
}
