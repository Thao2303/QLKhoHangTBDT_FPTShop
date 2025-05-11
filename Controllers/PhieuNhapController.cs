using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyKhoHangFPTShop.Data;
using QuanLyKhoHangFPTShop.Dtos;
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

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPhieuNhapById(int id)
        {
            var phieuNhap = await _context.PhieuNhap.FindAsync(id);
            if (phieuNhap == null)
            {
                return NotFound();
            }
            return Ok(phieuNhap);
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
                    nguoiTao = p.TaiKhoan.tenTaiKhoan,
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
                // 1. Tạo phiếu nhập
                var phieuNhap = new PhieuNhap
                {
                    idTaiKhoan = dto.idTaiKhoan,
                    idNhaCungCap = dto.idNhaCungCap,
                    ngayNhap = dto.ngayNhap
                };

                _context.PhieuNhap.Add(phieuNhap);
                await _context.SaveChangesAsync(); // => để có idPhieuNhap

                // 2. Tạo lô hàng tương ứng
                var soLoTuDong = await TaoSoLoTuDong(dto.idNhaCungCap);

                var loHang = new LoHang
                {
                    ngayNhapLo = dto.ngayNhap,
                    idNhaCungCap = dto.idNhaCungCap,
                    idPhieuNhap = phieuNhap.idPhieuNhap,
                    trangThaiLoHang = 1,
                    tenLo = soLoTuDong // ✅ Tự sinh
                };
                _context.LoHang.Add(loHang);

                await _context.SaveChangesAsync();

                // 3. Tạo các dòng chi tiết phiếu nhập
                foreach (var item in dto.products)
                {
                    var chiTiet = new ChiTietPhieuNhap
                    {
                        idPhieuNhap = phieuNhap.idPhieuNhap,
                        idSanPham = item.product,
                        donGia = item.unitPrice,
                        tongTien = item.unitPrice * item.realQuantity,
                        soLuongTheoChungTu = item.quantity,
                        soLuongThucNhap = item.realQuantity,
                        trangThai = 1,
                        nguoiGiaoHang = item.nguoiGiaoHang
                    };

                    _context.ChiTietPhieuNhap.Add(chiTiet);

                    // ✅ Cập nhật tồn kho
                    var sp = await _context.SanPham.FindAsync(item.product);
                    
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "Tạo phiếu nhập thành công", id = phieuNhap.idPhieuNhap });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi tạo phiếu nhập: " + ex.ToString());
                return StatusCode(500, new { error = ex.Message });
            }


        }

        [HttpPut("tuchoi/{id}")]
        public async Task<IActionResult> TuChoiPhieuNhap(int id)
        {
            try
            {
                var chiTietList = await _context.ChiTietPhieuNhap
                    .Where(x => x.idPhieuNhap == id)
                    .ToListAsync();

                if (!chiTietList.Any())
                    return NotFound($"Không tìm thấy chi tiết phiếu nhập với id = {id}");

                foreach (var ct in chiTietList)
                {
                    ct.trangThai = 3;
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = "Đã từ chối phiếu nhập!" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[TuChoiPhieuNhap] Lỗi: {ex.Message}");
                return StatusCode(500, $"Lỗi server: {ex.Message}");
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

        [HttpPut("duyet/{id}")]
        public async Task<IActionResult> DuyetPhieuNhap(int id)
        {
            try
            {
                var chiTietList = await _context.ChiTietPhieuNhap
                    .Where(x => x.idPhieuNhap == id)
                    .ToListAsync();

                if (!chiTietList.Any())
                    return NotFound("Không tìm thấy chi tiết phiếu nhập");

                foreach (var ct in chiTietList)
                {
                    ct.trangThai = 2;

                    var sp = await _context.SanPham.FindAsync(ct.idSanPham);
                    if (sp != null)
                    {
                        sp.soLuongHienCon += ct.soLuongThucNhap;
                    }
                }

                // ✅ Lưu vị trí đã nhập trước đó (nếu có)
                var viTriLuu = await _context.ChiTietLuuTru
                    .Where(x => chiTietList.Select(ct => ct.idSanPham).Contains(x.idSanPham))
                    .ToListAsync();

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

                await _context.SaveChangesAsync();
                await command.ExecuteNonQueryAsync();

                return Ok(new { message = "✅ Đã duyệt, cập nhật tồn kho và vị trí thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server khi duyệt: {ex.Message}");
            }
        }
        [HttpGet("trangthai/{id}")]
        public async Task<IActionResult> GetTrangThaiPhieuNhap(int id)
        {
            var trangThai = await _context.ChiTietPhieuNhap
                .Where(x => x.idPhieuNhap == id)
                .Select(x => (int?)x.trangThai)
                .FirstOrDefaultAsync();

            return Ok(new { trangThai = trangThai ?? 1 }); // 1 = chờ duyệt
        }
        [HttpGet("chitiet/{id}")]
        public async Task<ActionResult<IEnumerable<ChiTietPhieuNhap>>> GetChiTietPhieuNhap(int id)
        {
            return await _context.ChiTietPhieuNhap
                .Where(ct => ct.idPhieuNhap == id)
                .Include(ct => ct.SanPham)
                .ToListAsync();
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

        private async Task<string> TaoSoLoTuDong(int idNhaCungCap)
        {
            string maNcc = $"NCC{idNhaCungCap:D2}";
            string ngay = DateTime.Now.ToString("yyyyMMdd");

            // Đếm số lô đã tạo hôm nay của NCC này
            int stt = await _context.LoHang
                .Where(l => l.idNhaCungCap == idNhaCungCap && l.ngayNhapLo.Date == DateTime.Today)
                .CountAsync() + 1;

            return $"LO-{maNcc}-{ngay}-{stt:D2}";
        }

        [HttpPost("luu-vi-tri")]
        public async Task<IActionResult> LuuViTriLuuTru([FromBody] List<ChiTietLuuTruDto> ds)
        {
            if (ds == null || !ds.Any())
                return BadRequest("❌ Payload gửi lên rỗng hoặc sai định dạng!");

            // ✅ Xoá lưu trữ cũ trước khi thêm mới (áp dụng từng sản phẩm)
            var idSanPhams = ds.Select(d => d.idSanPham).Distinct().ToList();
            var oldRecords = await _context.ChiTietLuuTru
                .Where(x => idSanPhams.Contains(x.idSanPham))
                .ToListAsync();
            _context.ChiTietLuuTru.RemoveRange(oldRecords);
            await _context.SaveChangesAsync();

            // ✅ Thêm mới lại toàn bộ
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

            // ✅ Cập nhật lại daDung chính xác theo dữ liệu đã có
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
        [HttpPut("update-full/{id}")]
        public async Task<IActionResult> UpdatePhieuNhapFull(int id, [FromBody] PhieuNhapUpdateDto dto)
        {
            if (id != dto.idPhieuNhap)
                return BadRequest("ID phiếu nhập không khớp.");

            var phieuNhap = await _context.PhieuNhap
                .Include(p => p.ChiTietPhieuNhap)
                .FirstOrDefaultAsync(p => p.idPhieuNhap == id);

            if (phieuNhap == null)
                return NotFound("Không tìm thấy phiếu nhập.");

            var trangThai = phieuNhap.ChiTietPhieuNhap.Select(x => x.trangThai).FirstOrDefault();
            if (trangThai == 2)
                return BadRequest("⛔ Phiếu đã duyệt, không được phép sửa.");

            try
            {
                phieuNhap.ngayNhap = dto.ngayNhap;

                _context.ChiTietPhieuNhap.RemoveRange(phieuNhap.ChiTietPhieuNhap);

                foreach (var ct in dto.chiTietPhieuNhaps)
                {
                    Console.WriteLine($"➡️ Add CT: idSP={ct.idSanPham}, SL={ct.soLuong}, ĐG={ct.donGia}, GhiChu={ct.ghiChu}");

                    if (ct.idSanPham <= 0 || ct.soLuong <= 0 || ct.donGia <= 0)
                        return BadRequest("Dữ liệu chi tiết phiếu nhập không hợp lệ!");

                    _context.ChiTietPhieuNhap.Add(new ChiTietPhieuNhap
                    {
                        idPhieuNhap = id,
                        idSanPham = ct.idSanPham,
                        soLuongTheoChungTu = ct.soLuong,
                        soLuongThucNhap = ct.soLuong,
                        donGia = ct.donGia,            // ✅ Không cần ép kiểu nữa
                        tongTien = ct.soLuong * ct.donGia,
                        trangThai = 1,
                        nguoiGiaoHang = ct.ghiChu ?? ""
                    });
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = "Cập nhật phiếu nhập thành công!" });
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Lỗi UpdatePhieuNhapFull:");
                Console.WriteLine("ID: " + dto.idPhieuNhap);
                Console.WriteLine("Ngày nhập: " + dto.ngayNhap);
                Console.WriteLine("Chi tiết:");
                foreach (var ct in dto.chiTietPhieuNhaps)
                {
                    Console.WriteLine($"- SP: {ct.idSanPham}, SL: {ct.soLuong}, ĐG: {ct.donGia}, Ghi chú: {ct.ghiChu}");
                }
                Console.WriteLine("Chi tiết lỗi: " + ex.ToString());
                return StatusCode(500, $"❌ Lỗi server: {ex.Message}");
            }

        }

    }
}