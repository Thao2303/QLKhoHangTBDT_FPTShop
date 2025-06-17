using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyKhoHangFPTShop.server.Models;
using QuanLyKhoHangFPTShop.server.Data;
using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.AspNetCore.SignalR;
using QuanLyKhoHangFPTShop.server.Hubs;

namespace QuanLyKhoHangFPTShop.server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaiKhoanController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly WarehouseContext _context;
        private readonly IHubContext<ThongBaoHub> _hubContext;

        public TaiKhoanController(WarehouseContext context, IConfiguration config, IHubContext<ThongBaoHub> hubContext)
        {
            _context = context;
            _config = config;
            _hubContext = hubContext;
        }

        private string TaoMatKhauNgauNhien(int length = 10)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
            var rnd = new Random();
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[rnd.Next(s.Length)]).ToArray());
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var taiKhoans = await _context.TaiKhoan
                .Include(t => t.ChucVu)
                .Select(t => new
                {
                    t.idTaiKhoan,
                    t.tenTaiKhoan,
                    t.email,
                    t.ngayCap,
                    t.trangThai,
                    t.idChucVu,
                    TenChucVu = t.ChucVu.tenChucVu
                })
                .ToListAsync();

            return Ok(taiKhoans);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaiKhoan>> GetTaiKhoan(int id)
        {
            var taiKhoan = await _context.TaiKhoan.FindAsync(id);
            return taiKhoan == null ? NotFound() : taiKhoan;
        }

        [HttpPost]
        public async Task<ActionResult<TaiKhoan>> PostTaiKhoan(TaiKhoanCreateDto dto)
        {
            if (!await _context.ChucVu.AnyAsync(cv => cv.idChucVu == dto.idChucVu))
                return BadRequest("❌ Chức vụ không tồn tại.");

            // Kiểm tra trùng tên tài khoản
            if (await _context.TaiKhoan.AnyAsync(t => t.tenTaiKhoan == dto.tenTaiKhoan))
                return BadRequest("❌ Tên tài khoản đã tồn tại.");

            // Kiểm tra trùng email
            if (await _context.TaiKhoan.AnyAsync(t => t.email == dto.email))
                return BadRequest("❌ Email đã tồn tại.");

            var plainPassword = TaoMatKhauNgauNhien();
            var passwordHasher = new PasswordHasher<TaiKhoan>();

            var taiKhoan = new TaiKhoan
            {
                tenTaiKhoan = dto.tenTaiKhoan,
                email = dto.email,
                idChucVu = dto.idChucVu,
                idDaiLy = dto.idDaiLy,
                ngayCap = dto.ngayCap,
                trangThai = dto.trangThai,
                matKhau = passwordHasher.HashPassword(null, plainPassword),
                doiMatKhau = true
            };

            _context.TaiKhoan.Add(taiKhoan);
            await _context.SaveChangesAsync();

            var domain = _config["FrontendDomain"] ?? "http://localhost:3000";
            var loginUrl = $"{domain}/login";
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("FPT Shop", _config["Mail:Username"]));
            message.To.Add(new MailboxAddress("", taiKhoan.email));
            message.Subject = "Thông tin tài khoản hệ thống FPT Shop";
            message.Body = new TextPart("plain")
            {
                Text = $"Chào {taiKhoan.tenTaiKhoan},\n\nBạn đã được cấp tài khoản truy cập hệ thống quản lý kho FPT Shop. Dưới đây là thông tin:\n\n➤ Tên đăng nhập: {taiKhoan.tenTaiKhoan}\n➤ Mật khẩu tạm thời: {plainPassword}\n➤ Đăng nhập tại: {loginUrl}\n\n⚠️ Vui lòng đổi mật khẩu sau khi đăng nhập để bảo mật tài khoản."
            };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(_config["Mail:Username"], _config["Mail:Password"]);
            await smtp.SendAsync(message);
            await smtp.DisconnectAsync(true);

            return CreatedAtAction(nameof(GetTaiKhoan), new { id = taiKhoan.idTaiKhoan }, taiKhoan);
        }

        [HttpPut("khoataikhoan/{id}")]
        public async Task<IActionResult> KhoaTaiKhoan(int id)
        {
            var tk = await _context.TaiKhoan.FindAsync(id);
            if (tk == null) return NotFound();

            tk.trangThai = !tk.trangThai;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTaiKhoan(int id, TaiKhoan taiKhoan)
        {
            if (id != taiKhoan.idTaiKhoan) return BadRequest();

            _context.Entry(taiKhoan).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTaiKhoan(int id)
        {
            var taiKhoan = await _context.TaiKhoan.FindAsync(id);
            if (taiKhoan == null) return NotFound();

            _context.TaiKhoan.Remove(taiKhoan);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginRequest request)
        {
            var taiKhoan = await _context.TaiKhoan
                .Include(t => t.ChucVu)
                .Include(t => t.DaiLy)
                .FirstOrDefaultAsync(t => t.tenTaiKhoan == request.Username);

            if (taiKhoan == null) return Unauthorized("Tên tài khoản không tồn tại.");

            if (taiKhoan.trangThai.HasValue && taiKhoan.trangThai == false)
                return Unauthorized("Tài khoản đã bị khóa.");


            var passwordHasher = new PasswordHasher<TaiKhoan>();
            var result = passwordHasher.VerifyHashedPassword(taiKhoan, taiKhoan.matKhau, request.Password);
            if (result == PasswordVerificationResult.Failed)
                return Unauthorized("Mật khẩu không đúng.");

            return Ok(new
            {
                taiKhoan.idTaiKhoan,
                taiKhoan.tenTaiKhoan,
                taiKhoan.email,
                taiKhoan.ChucVu.tenChucVu,
                doiMatKhau = taiKhoan.doiMatKhau,
                idDaiLy = taiKhoan.idDaiLy
            });
        }

        [HttpPost("yeu-cau-reset-mat-khau")]
        public async Task<IActionResult> YeuCauResetMatKhau([FromBody] string email)
        {
            var user = await _context.TaiKhoan.FirstOrDefaultAsync(t => t.email == email);
            if (user == null)
                return NotFound("Không tìm thấy email.");

            user.resetToken = Guid.NewGuid().ToString();
            user.resetTokenExpiry = DateTime.Now.AddMinutes(15);
            await _context.SaveChangesAsync();

            var domain = _config["FrontendDomain"] ?? "http://localhost:3000";
            var senderEmail = _config["Mail:Username"];
            var senderPassword = _config["Mail:Password"];

            var resetLink = $"{domain}/reset-password?token={user.resetToken}";

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("FPT Shop", senderEmail));
            message.To.Add(new MailboxAddress("", user.email));
            message.Subject = "Đặt lại mật khẩu - FPT Shop";

            message.Body = new TextPart("plain")
            {
                Text = $"Chào {user.tenTaiKhoan},\n\nBạn đã yêu cầu đặt lại mật khẩu. Bấm vào link sau để đặt lại:\n{resetLink}\n\nLink có hiệu lực trong 15 phút."
            };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(senderEmail, senderPassword);
            await smtp.SendAsync(message);
            await smtp.DisconnectAsync(true);

            return Ok(new
            {
                message = "✅ Hướng dẫn đặt lại mật khẩu đã được gửi qua email."
            });
        }

        [HttpPost("dat-lai-mat-khau")]
        public async Task<IActionResult> DatLaiMatKhau([FromBody] ResetPasswordRequest request)
        {
            var user = await _context.TaiKhoan.FirstOrDefaultAsync(t => t.resetToken == request.Token);
            if (user == null || user.resetTokenExpiry < DateTime.Now)
                return BadRequest("Token không hợp lệ hoặc đã hết hạn.");

            var hasher = new PasswordHasher<TaiKhoan>();
            user.matKhau = hasher.HashPassword(user, request.NewPassword);
            user.resetToken = null;
            user.resetTokenExpiry = null;

            await _context.SaveChangesAsync();

            return Ok("Mật khẩu đã được cập nhật thành công.");
        }

        public class ResetPasswordRequest
        {
            public string? Token { get; set; }
            public string? NewPassword { get; set; }
        }

        public class XacNhanTaiKhoanRequest
        {
            public string Token { get; set; }
            public string Password { get; set; }
        }
        [HttpGet("thukho")]
        public async Task<IActionResult> GetThuKhoAccounts()
        {
            var result = await _context.TaiKhoan
              .Where(tk => tk.idChucVu == 2)
              .Select(tk => new {
                  tk.idTaiKhoan,
                  tk.tenTaiKhoan
              })
            .ToListAsync();
            return Ok(result);
        }
        [HttpPost("doi-mat-khau")]
        public async Task<IActionResult> DoiMatKhau([FromBody] DoiMatKhauRequest req)
        {
            var user = await _context.TaiKhoan.FirstOrDefaultAsync(t => t.idTaiKhoan == req.idTaiKhoan);
            if (user == null) return NotFound("Không tìm thấy tài khoản");

            var hasher = new PasswordHasher<TaiKhoan>();
            var result = hasher.VerifyHashedPassword(user, user.matKhau, req.OldPassword);
            if (result == PasswordVerificationResult.Failed)
                return BadRequest("Mật khẩu cũ không đúng.");

            user.matKhau = hasher.HashPassword(user, req.NewPassword);
            user.doiMatKhau = false; // 👈 đã đổi rồi thì không cần ép nữa
            await _context.SaveChangesAsync();



            return Ok("Đổi mật khẩu thành công.");
        }

        public class DoiMatKhauRequest
        {
            public int idTaiKhoan { get; set; }
            public string OldPassword { get; set; }
            public string NewPassword { get; set; }
        }


    }
}