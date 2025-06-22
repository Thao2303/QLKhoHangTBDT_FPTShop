using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using QuanLyKhoHangFPTShop.server.Models;
using QuanLyKhoHangFPTShop.server.Data;
using QuanLyKhoHangFPTShop.server.Hubs;


namespace QuanLyKhoHangFPTShop.server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class YeuCauXuatKhoController : ControllerBase
    {
        private readonly WarehouseContext _context;
        private readonly IHubContext<ThongBaoHub> _hubContext;

        public YeuCauXuatKhoController(WarehouseContext context, IHubContext<ThongBaoHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpPost("tao")]
        public async Task<IActionResult> PostYeuCauXuatKho([FromBody] YeuCauXuatKho yc)
        {
            yc.NgayYeuCau = DateTime.Now;

            var nguoiTao = await _context.TaiKhoan
                .Include(tk => tk.ChucVu)
                .Include(tk => tk.DaiLy)
                .FirstOrDefaultAsync(tk => tk.idTaiKhoan == yc.idNguoiTao);
            Console.WriteLine("Người tạo: " + nguoiTao?.tenTaiKhoan + ", chức vụ: " + nguoiTao?.ChucVu?.tenChucVu);

            yc.NguoiYeuCau = nguoiTao?.DaiLy?.TenDaiLy ?? "Ẩn danh";
            yc.IdDaiLy = nguoiTao?.idDaiLy ?? 0;

            var chiTietTam = yc.ChiTietYeuCauXuatKhos.ToList();
            yc.ChiTietYeuCauXuatKhos.Clear();

            _context.YeuCauXuatKho.Add(yc);
            await _context.SaveChangesAsync();

            foreach (var ct in chiTietTam)
            {
                ct.idYeuCauXuatKho = yc.IdYeuCauXuatKho;
                _context.ChiTietYeuCauXuatKho.Add(ct);
            }
            await _context.SaveChangesAsync();

            // 🚦 Xử lý phân quyền gửi thông báo
            var tenChucVu = nguoiTao?.ChucVu?.tenChucVu?.Trim().ToLower();


            if (tenChucVu == "đại lý bán hàng")
            {
                // 🧑‍💼 Gửi tới Giám đốc đại lý
                var giamDoc = await _context.TaiKhoan
    .Include(t => t.ChucVu)  // Bắt buộc phải có
    .Where(t =>
        t.idDaiLy == nguoiTao.idDaiLy &&
        t.ChucVu != null &&
        t.ChucVu.tenChucVu.Trim().ToLower() == "giám đốc đại lý".ToLower())
    .FirstOrDefaultAsync();
                if (giamDoc == null)
                {
                    Console.WriteLine($"Không tìm thấy giám đốc cho đại lý {nguoiTao.idDaiLy}");
                }


                if (giamDoc != null)
                {
                    var noiDung = $"📝 Nhân viên {nguoiTao.tenTaiKhoan} vừa tạo yêu cầu xuất kho #{yc.IdYeuCauXuatKho}. Vui lòng duyệt.";

                    await _hubContext.Clients.User(giamDoc.idTaiKhoan.ToString())
                        .SendAsync("NhanThongBao", new { idYeuCau = yc.IdYeuCauXuatKho, noiDung, ngayTao = DateTime.Now });

                    _context.ThongBao.Add(new ThongBao
                    {
                        noiDung = noiDung,
                        ngayTao = DateTime.Now,
                        daXem = false,
                        idNguoiNhan = giamDoc.idTaiKhoan
                    });
                }
            }
            else if (tenChucVu == "thủ kho" || tenChucVu == "nhân viên")
            {
                // 🏷 Nếu là nhân viên kho/thủ kho thì gửi trực tiếp tới Thủ kho
                var thuKhoList = await _context.TaiKhoan
                    .Include(t => t.ChucVu)
                    .Where(t => t.ChucVu.tenChucVu == "Thủ kho")
                    .ToListAsync();

                foreach (var tk in thuKhoList)
                {
                    var noiDung = $"📝 Đại lý {yc.NguoiYeuCau} vừa gửi yêu cầu xuất kho mới. (Mã yêu cầu: #{yc.IdYeuCauXuatKho})";

                    await _hubContext.Clients.User(tk.idTaiKhoan.ToString())
                        .SendAsync("NhanThongBao", new { idYeuCau = yc.IdYeuCauXuatKho, noiDung, ngayTao = DateTime.Now });

                    _context.ThongBao.Add(new ThongBao
                    {
                        noiDung = noiDung,
                        ngayTao = DateTime.Now,
                        daXem = false,
                        idNguoiNhan = tk.idTaiKhoan
                    });
                }
            }

            await _context.SaveChangesAsync();
            return Ok(yc);
        }
        [HttpPut("giamdocduyet/{id}")]
        public async Task<IActionResult> GiamDocDuyetYeuCau(int id)
        {
            var yc = await _context.YeuCauXuatKho
                .Include(y => y.NguoiTao)
                .FirstOrDefaultAsync(y => y.IdYeuCauXuatKho == id);

            if (yc == null)
                return NotFound();

            // ✅ Cập nhật trạng thái: đã duyệt bởi Giám đốc
            yc.giamDocDuyet = true;

            // 🧾 Gửi thông báo tới tất cả thủ kho
            var thuKhoList = await _context.TaiKhoan
                .Include(t => t.ChucVu)
                .Where(t => t.ChucVu.tenChucVu == "Thủ kho")
                .ToListAsync();

            foreach (var tk in thuKhoList)
            {
                var noiDung = $"📝 Giám đốc đã duyệt yêu cầu xuất kho #{yc.IdYeuCauXuatKho}. Vui lòng kiểm tra và xử lý.";

                await _hubContext.Clients.User(tk.idTaiKhoan.ToString())
                    .SendAsync("NhanThongBao", new { idYeuCau = yc.IdYeuCauXuatKho, noiDung, ngayTao = DateTime.Now });

                _context.ThongBao.Add(new ThongBao
                {
                    noiDung = noiDung,
                    ngayTao = DateTime.Now,
                    daXem = false,
                    idNguoiNhan = tk.idTaiKhoan
                });
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Giám đốc đã duyệt và thông báo đã được gửi tới Thủ kho." });
        }


        [HttpPut("capnhattrangthai/{id}")]
        public async Task<IActionResult> CapNhatTrangThaiDaXuat(int id)
        {
            var yc = await _context.YeuCauXuatKho.FindAsync(id);
            if (yc == null)
                return NotFound();

            yc.IdTrangThaiXacNhan = 4; // ✅ 4 = Đã xuất kho
            await _context.SaveChangesAsync();
            return Ok(new { message = "Yêu cầu đã được cập nhật sang trạng thái ĐÃ XUẤT KHO." });
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
            var yc = await _context.YeuCauXuatKho
                .Include(y => y.DaiLy)
                    .Include(y => y.NguoiTao)
                .FirstOrDefaultAsync(y => y.IdYeuCauXuatKho == id);

            if (yc == null)
                return NotFound();

            yc.IdTrangThaiXacNhan = 2;

            // 🔔 Gửi thông báo về cho người tạo yêu cầu
            var nguoiTao = await _context.TaiKhoan
                .FirstOrDefaultAsync(tk => tk.idTaiKhoan == yc.idNguoiTao);

            if (nguoiTao != null)
            {
                await _hubContext.Clients.User(nguoiTao.idTaiKhoan.ToString())
                    .SendAsync("NhanThongBao", $"✅ Yêu cầu xuất kho #{yc.IdYeuCauXuatKho} của bạn đã được duyệt.");

                _context.ThongBao.Add(new ThongBao
                {
                    idNguoiNhan = nguoiTao.idTaiKhoan,
                    noiDung = $"✅ Yêu cầu xuất kho #{yc.IdYeuCauXuatKho} của bạn đã được duyệt.",
                    ngayTao = DateTime.Now,
                    daXem = false
                });
            }

            await _context.SaveChangesAsync();
            return Ok(yc);
        }
        [HttpPut("tuchoi/{id}")]
        public async Task<IActionResult> TuChoiYeuCauXuatKho(int id)
        {
            var yeuCau = await _context.YeuCauXuatKho.FindAsync(id);
            if (yeuCau == null)
                return NotFound();

            yeuCau.IdTrangThaiXacNhan = 3;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã từ chối yêu cầu!" });
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<YeuCauXuatKho>> GetYeuCauById(int id)
        {
            var yeuCau = await _context.YeuCauXuatKho
                .Include(y => y.ChiTietYeuCauXuatKhos).ThenInclude(ct => ct.SanPham)
                .Include(y => y.DaiLy)
                .Include(y => y.TrangThaiXacNhan)
                .Include(y => y.NguoiTao)

                .FirstOrDefaultAsync(y => y.IdYeuCauXuatKho == id);

            if (yeuCau == null)
                return NotFound();

            return yeuCau;
        }

        [HttpGet]
        public async Task<IActionResult> GetYeuCauXuatKho()
        {
            var danhSach = await _context.YeuCauXuatKho
                .Include(yc => yc.DaiLy)
                .Include(yc => yc.TrangThaiXacNhan)
                .Include(y => y.NguoiTao)
                .ToListAsync();

            var result = danhSach.Select(yc => new
            {
                yc.IdYeuCauXuatKho,
                yc.MaPhieu,
                yc.DiaChi,
                yc.LyDoXuat,
                yc.HinhThucXuat,
                yc.PhuongThucVanChuyen,
                
                yc.NgayYeuCau,
                yc.IdTrangThaiXacNhan,
                yc.giamDocDuyet,
                daiLy = new
                {
                    yc.DaiLy?.idDaiLy,
                    yc.DaiLy?.TenDaiLy
                },
                nguoiTao = new
                {
                    yc.NguoiTao?.idTaiKhoan,
                    yc.NguoiTao?.tenTaiKhoan
                },
                trangThai = yc.TrangThaiXacNhan?.tenTrangThaiXacNhan
            });

            return Ok(result);

        }


        [HttpGet("chitiet/{id}")]
        public async Task<IActionResult> GetChiTiet(int id)
        {
            var list = await _context.ChiTietYeuCauXuatKho
                .Where(c => c.idYeuCauXuatKho == id)
                .Include(c => c.SanPham) // ✅ Thêm dòng này
                .ToListAsync();

            return Ok(list);
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
