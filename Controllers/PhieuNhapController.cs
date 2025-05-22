using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using QuanLyKhoHangFPTShop.Data;
using QuanLyKhoHangFPTShop.Dtos;
using QuanLyKhoHangFPTShop.Hubs;
using QuanLyKhoHangFPTShop.Models;

namespace QuanLyKhoHangFPTShop.Controllers
{
    [Route("api/phieunhap")]
    [ApiController]
    public class PhieuNhapController : ControllerBase
    {
        private readonly WarehouseContext _context;

        private readonly IHubContext<ThongBaoHub> _hubContext;

        public PhieuNhapController(WarehouseContext context, IHubContext<ThongBaoHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
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
                    ngayNhap = DateTime.Now
                };

                _context.PhieuNhap.Add(phieuNhap);
                await _context.SaveChangesAsync(); // => lấy được idPhieuNhap

                // 2. Tạo lô hàng tương ứng
                var soLoTuDong = await TaoSoLoTuDong(dto.idNhaCungCap);
                var loHang = new LoHang
                {
                    ngayNhapLo = DateTime.Now,
                    idNhaCungCap = dto.idNhaCungCap,
                    idPhieuNhap = phieuNhap.idPhieuNhap,
                    trangThaiLoHang = 1,
                    tenLo = soLoTuDong
                };

                _context.LoHang.Add(loHang);
                await _context.SaveChangesAsync();

                // 3. Tạo chi tiết phiếu nhập + chi tiết lưu trữ
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

                    // ✅ Tạo các dòng ChiTietLuuTru từ item.positions
                    if (item.positions != null && item.positions.Any())
                    {
                        foreach (var pos in item.positions)
                        {
                            var chiTietLuu = new ChiTietLuuTru
                            {
                                idSanPham = item.product,
                                idViTri = pos.idViTri,
                                soLuong = pos.soLuong,
                                thoiGianLuu = DateTime.Now,
                                idPhieuNhap = phieuNhap.idPhieuNhap
                            };

                            _context.ChiTietLuuTru.Add(chiTietLuu);
                        }
                    }
                }

                await _context.SaveChangesAsync();
                // 🔔 Gửi thông báo tới tất cả Thủ kho
                var thuKhos = await _context.TaiKhoan
                    .Include(t => t.ChucVu)
                    .Where(t => t.ChucVu.tenChucVu == "Thủ kho")
                    .ToListAsync();

                foreach (var tk in thuKhos)
                {
                    var content = $"📥 Phiếu nhập mới #{phieuNhap.idPhieuNhap} từ người dùng {dto.idTaiKhoan}";

                    await _hubContext.Clients.User(tk.idTaiKhoan.ToString())
                        .SendAsync("NhanThongBao", new
                        {
                            idPhieuNhap = phieuNhap.idPhieuNhap,
                            noiDung = content,
                            ngayTao = DateTime.Now
                        });

                    _context.ThongBao.Add(new ThongBao
                    {
                        idNguoiNhan = tk.idTaiKhoan,
                        noiDung = content,
                        ngayTao = DateTime.Now,
                        daXem = false
                    });
                }

                return Ok(new { message = "Tạo phiếu nhập thành công", id = phieuNhap.idPhieuNhap });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi tạo phiếu nhập: " + ex);
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
                var nguoiTao = await _context.PhieuNhap
    .Include(p => p.TaiKhoan)
    .Where(p => p.idPhieuNhap == id)
    .Select(p => p.TaiKhoan)
    .FirstOrDefaultAsync();

                if (nguoiTao != null)
                {
                    var msg = $"✅ Phiếu nhập #{id} của bạn đã được duyệt.";

                    await _hubContext.Clients.User(nguoiTao.idTaiKhoan.ToString())
                        .SendAsync("NhanThongBao", msg);

                    _context.ThongBao.Add(new ThongBao
                    {
                        idNguoiNhan = nguoiTao.idTaiKhoan,
                        noiDung = msg,
                        ngayTao = DateTime.Now,
                        daXem = false
                    });
                }

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
        public async Task<ActionResult<IEnumerable<object>>> GetChiTietPhieuNhap(int id)
        {
            var chiTiet = await _context.ChiTietPhieuNhap
     .Where(ct => ct.idPhieuNhap == id)
     .Include(ct => ct.SanPham)
     .Select(ct => new
     {
         ct.idPhieuNhap,
         ct.idSanPham,
         sanPham = new
         {
             ct.SanPham.tenSanPham,
             ct.SanPham.idSanPham,
             ct.SanPham.DanhMuc,
             ct.SanPham.hinhAnh
         },
         nguoiGiao = ct.nguoiGiaoHang,
         ct.soLuongTheoChungTu,
         ct.soLuongThucNhap,
         ct.donGia,
         ct.tongTien,

         viTri = _context.ChiTietLuuTru
    .Where(l => l.idSanPham == ct.idSanPham && l.idPhieuNhap == id)
             .Join(_context.ViTri,
                 l => l.idViTri,
                 v => v.IdViTri,
                 (l, v) => new
                 {
                     v.IdViTri,
                     v.Day,
                     v.Cot,
                     v.Tang,
                     l.soLuong
                 })
             .ToList()
     })
     .ToListAsync();


            return Ok(chiTiet);
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

            foreach (var item in ds)
            {
                if (item.idPhieuNhap == 0)
                {
                    return BadRequest("Thiếu idPhieuNhap trong chi tiết lưu trữ.");
                }

                var entity = new ChiTietLuuTru
                {
                    idSanPham = item.idSanPham,
                    idViTri = item.idViTri,
                    soLuong = item.soLuong,
                    thoiGianLuu = item.thoiGianLuu,
                    idPhieuNhap = item.idPhieuNhap // ✅ Gắn đúng phiếu
                };

                _context.ChiTietLuuTru.Add(entity);
            }


            await _context.SaveChangesAsync();

            // ✅ Cập nhật lại daDung theo thực tế
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

            return Ok(new { message = "✅ Đã lưu và cập nhật dung tích thành công!" });
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
                // ✅ Cập nhật ngày nhập mới
                phieuNhap.ngayNhap = dto.ngayNhap ?? DateTime.Now;


                // ✅ Xoá tất cả ChiTietLuuTru cũ thuộc phiếu này
                var luuTruCu = await _context.ChiTietLuuTru
                    .Where(x => x.idPhieuNhap == id)
                    .ToListAsync();
                _context.ChiTietLuuTru.RemoveRange(luuTruCu);

                // ✅ Xoá toàn bộ chi tiết phiếu nhập cũ
                _context.ChiTietPhieuNhap.RemoveRange(phieuNhap.ChiTietPhieuNhap);

                await _context.SaveChangesAsync(); // Lưu lại các xoá trước

                // ✅ Thêm lại chi tiết phiếu nhập mới
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
                        donGia = ct.donGia,
                        tongTien = ct.soLuong * ct.donGia,
                        trangThai = 1,
                     
                        nguoiGiaoHang = ct.nguoiGiaoHang ?? ""
                    });
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "✅ Cập nhật phiếu nhập thành công!" });
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