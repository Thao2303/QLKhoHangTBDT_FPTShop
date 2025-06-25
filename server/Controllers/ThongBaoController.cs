using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyKhoHangFPTShop.server.Data;
using QuanLyKhoHangFPTShop.server.Models;
using QuanLyKhoHangFPTShop.server.Hubs;
using Microsoft.AspNetCore.SignalR;
namespace QuanLyKhoHangFPTShop.server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ThongBaoController : ControllerBase
    {
        private readonly WarehouseContext _context;
        private readonly IHubContext<ThongBaoHub> _hubContext;

        public ThongBaoController(WarehouseContext context, IHubContext<ThongBaoHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        // Lấy tất cả thông báo của người dùng
        [HttpGet("nguoi-nhan/{idTaiKhoan}")]
        public async Task<IActionResult> GetByUser(int idTaiKhoan)
        {
            var tb = await _context.ThongBao
                .Where(t => t.idNguoiNhan == idTaiKhoan)
                .OrderByDescending(t => t.ngayTao)
                .ToListAsync();

            return Ok(tb);
        }

        // Đánh dấu đã đọc thông báo
        [HttpPut("danh-dau-da-doc/{idThongBao}")]
        public async Task<IActionResult> MarkAsRead(int idThongBao)
        {
            var tb = await _context.ThongBao.FindAsync(idThongBao);
            if (tb == null) return NotFound();

            tb.daXem = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Thêm thông báo mới
        [HttpPost]
        public async Task<IActionResult> Create(ThongBao tb)
        {
            tb.ngayTao = DateTime.Now;
            tb.daXem = false;

            _context.ThongBao.Add(tb);
            await _context.SaveChangesAsync();

            // Gửi realtime qua SignalR
            await _hubContext.Clients.User(tb.idNguoiNhan.ToString())
                .SendAsync("NhanThongBao", tb);

            return Ok(tb);
        }


        [HttpGet("taikhoan/ten/{tenTaiKhoan}")]
        public async Task<IActionResult> LayIdTheoTen(string tenTaiKhoan)
        {
            var acc = await _context.TaiKhoan.FirstOrDefaultAsync(x => x.tenTaiKhoan == tenTaiKhoan);
            if (acc == null) return NotFound();
            return Ok(new { acc.idTaiKhoan });
        }

    }


}
