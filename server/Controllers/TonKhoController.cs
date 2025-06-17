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
    public class TonKhoController : ControllerBase
    {
        private readonly WarehouseContext _context;
        private readonly IHubContext<ThongBaoHub> _hubContext;
        public TonKhoController(WarehouseContext context, IHubContext<ThongBaoHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpGet]
        public IActionResult GetTonKho()
        {
            var result = _context.SanPham
                .Select(sp => new
                {
                    sp.idSanPham,
                    maSanPham = sp.sku,
                    sp.tenSanPham,
                    danhMuc = sp.DanhMuc.tenDanhMuc,
                    thuongHieu = sp.ThuongHieu.tenThuongHieu,
                    tonHeThong = sp.soLuongHienCon,
                    sp.soLuongToiThieu,
                    sp.moTa,
                    sp.hinhAnh
                })
                .ToList();

            return Ok(result);
        }

        [HttpPost("canhbao-tonkho")]
        public async Task<IActionResult> CanhBaoTonKho()
        {
            var thoiGianCanhBao = TimeSpan.FromHours(6);

            var thongBaoTonKho = _context.ThongBaoHeThong
                .FirstOrDefault(tb => tb.maLoai == "TON_KHO");

            if (thongBaoTonKho != null && DateTime.Now - thongBaoTonKho.lanCuoiGui < thoiGianCanhBao)
            {
                return Ok("🔁 Thông báo tồn kho đã được gửi gần đây.");
            }

            var sanPhamsCanNhap = _context.SanPham
                .Include(sp => sp.DanhMuc)
                .Where(sp => sp.soLuongHienCon < sp.soLuongToiThieu)
                .ToList();

            if (!sanPhamsCanNhap.Any())
                return Ok("✅ Không có sản phẩm nào dưới tồn tối thiểu.");

            var thuKhoList = await _context.TaiKhoan
                .Include(tk => tk.ChucVu)
                .Where(tk => tk.ChucVu.tenChucVu == "Thủ kho")
                .ToListAsync();

            foreach (var sp in sanPhamsCanNhap)
            {
                var ton = sp.soLuongHienCon;

                string noiDung = $"⚠️ Sản phẩm \"{sp.tenSanPham}\" tồn kho chỉ còn {ton}, thấp hơn mức tối thiểu {sp.soLuongToiThieu}. Vui lòng kiểm tra nhập hàng.";

                foreach (var thuKho in thuKhoList)
                {
                    // Gửi SignalR realtime
                    await _hubContext.Clients.User(thuKho.idTaiKhoan.ToString())
                        .SendAsync("NhanThongBao", new
                        {
                            noiDung,
                            ngayTao = DateTime.Now
                        });

                    // Lưu vào bảng ThongBao
                    _context.ThongBao.Add(new ThongBao
                    {
                        idNguoiNhan = thuKho.idTaiKhoan,
                        noiDung = noiDung,           // ✅ sửa ở đây
                        ngayTao = DateTime.Now,
                        daXem = false
                    });

                }
            }

            // Cập nhật thời gian gửi cảnh báo
            if (thongBaoTonKho == null)
            {
                _context.ThongBaoHeThong.Add(new ThongBaoHeThong
                {
                    maLoai = "TON_KHO",
                    lanCuoiGui = DateTime.Now
                });
            }
            else
            {
                thongBaoTonKho.lanCuoiGui = DateTime.Now;
            }

            await _context.SaveChangesAsync();
            return Ok($"✅ Đã gửi cảnh báo cho {sanPhamsCanNhap.Count} sản phẩm tồn thấp.");
        }

        [HttpGet("lohang")]
        public IActionResult GetTonTheoLo()
        {
            var result = (from lo in _context.LoHang
                          join pn in _context.PhieuNhap on lo.idPhieuNhap equals pn.idPhieuNhap
                          join ctpn in _context.ChiTietPhieuNhap on lo.idPhieuNhap equals ctpn.idPhieuNhap
                          join sp in _context.SanPham on ctpn.idSanPham equals sp.idSanPham
                          join ncc in _context.NhaCungCap on sp.idNhaCungCap equals ncc.idNhaCungCap
                          where ctpn.soLuongThucNhap > 0
                          group new { lo, pn, ctpn, sp, ncc } by new
                          {
                              sp.sku,
                              sp.tenSanPham,
                              lo.tenLo,
                              lo.ngayNhapLo,
                              ncc.tenNhaCungCap,
                              lo.idPhieuNhap,
                              sp.idSanPham
                          } into g
                          select new
                          {
                              maSanPham = g.Key.sku,
                              g.Key.tenSanPham,
                              g.Key.tenLo,
                              g.Key.ngayNhapLo,
                              g.Key.tenNhaCungCap,
                              soLuongNhap = g.Sum(x => x.ctpn.soLuongThucNhap),
                              soLuongConLai = _context.ChiTietLuuTru
                                  .Where(ct => ct.idSanPham == g.Key.idSanPham)
                                  .Sum(ct => (int?)ct.soLuong) ?? 0
                          })
                          .AsEnumerable() // chuyển sang LINQ to Objects để xử lý tiếp
                          .Select(x => new
                          {
                              x.maSanPham,
                              x.tenSanPham,
                              x.tenLo,
                              x.ngayNhapLo,
                              x.tenNhaCungCap,
                              x.soLuongNhap,
                              x.soLuongConLai,
                              tinhTrang = x.soLuongConLai == 0 ? "Đã xuất hết"
                                          : x.soLuongConLai <= 5 ? "Sắp hết"
                                          : "Còn hàng"
                          })
                          .ToList();

            return Ok(result);
        }



    }

}
