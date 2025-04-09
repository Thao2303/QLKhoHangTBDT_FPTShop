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
        // Controller: PhieuNhapController.cs
        [HttpPost("luu-vi-tri")]
        public async Task<IActionResult> LuuViTriLuuTru([FromBody] List<ChiTietLuuTruDto> ds)

        {
            if (ds == null || !ds.Any())
                return BadRequest("❌ Payload gửi lên rỗng hoặc sai định dạng!");

            foreach (var item in ds)
            {
                var entity = new ChiTietLuuTru
                {
                    idSanPham = item.idSanPham,
                    idViTri = item.idViTri,
                    soLuong = item.soLuong,
                    thoiGianLuu = item.thoiGianLuu
                };
                _context.ChiTietLuuTru.Add(entity);
            }

            await _context.SaveChangesAsync();

            using var connection = _context.Database.GetDbConnection();
            await connection.OpenAsync();
            using var command = connection.CreateCommand();

            command.CommandText = @"
        UPDATE V
        SET V.daDung = T.tongTheTich
        FROM ViTri V
        JOIN (
            SELECT 
                C.idViTri,
                SUM(SP.chieuDai * SP.chieuRong * SP.chieuCao * C.soLuong) AS tongTheTich
            FROM ChiTietLuuTru C
            JOIN SanPham SP ON C.idSanPham = SP.idSanPham
            GROUP BY C.idViTri
        ) T ON V.idViTri = T.idViTri;
    ";

            await command.ExecuteNonQueryAsync();

            return Ok(new { message = "✅ Lưu vào kho và cập nhật daDung thành công!" });
        }

        [HttpGet("luu-tru")]
        public async Task<IActionResult> GetChiTietLuuTru()
        {
            var result = await _context.ChiTietLuuTru
                .Include(ct => ct.SanPham) // ✅ Lấy kèm thông tin sản phẩm
                .ToListAsync();

            return Ok(result);
        }

    }
}