using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyKhoHangFPTShop.server.Models;
using QuanLyKhoHangFPTShop.server.Data;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
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
            if (taiKhoan == null)
            {
                return NotFound();
            }
            return taiKhoan;
        }
        [HttpPost]
        public async Task<ActionResult<TaiKhoan>> PostTaiKhoan(TaiKhoanCreateDto dto)

        {
            try
            {
                var chucVuTonTai = await _context.ChucVu.AnyAsync(cv => cv.idChucVu == dto.idChucVu);
                if (!chucVuTonTai)
                {
                    return BadRequest("Chức vụ không tồn tại.");
                }

                var taiKhoan = new TaiKhoan
                {
                    tenTaiKhoan = dto.tenTaiKhoan,
                    email = dto.email,
                    idChucVu = dto.idChucVu,
                    ngayCap = dto.ngayCap,
                    trangThai = dto.trangThai
                };

                var passwordHasher = new PasswordHasher<TaiKhoan>();
                taiKhoan.matKhau = passwordHasher.HashPassword(taiKhoan, dto.matKhau);

                _context.TaiKhoan.Add(taiKhoan);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetTaiKhoan), new { id = taiKhoan.idTaiKhoan }, taiKhoan);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi tạo tài khoản: {ex.Message}");
            }
        }


        [HttpPut("khoataikhoan/{id}")]
        public async Task<IActionResult> KhoaTaiKhoan(int id)
        {
            var tk = await _context.TaiKhoan.FindAsync(id);
            if (tk == null)
            {
                return NotFound();
            }

            // Toggle trạng thái
            tk.trangThai = !tk.trangThai;
            await _context.SaveChangesAsync();

            return NoContent();
        }



        [HttpPut("{id}")]
        public async Task<IActionResult> PutTaiKhoan(int id, TaiKhoan taiKhoan)
        {
            if (id != taiKhoan.idTaiKhoan)
            {
                return BadRequest();
            }

            _context.Entry(taiKhoan).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTaiKhoan(int id)
        {
            var taiKhoan = await _context.TaiKhoan.FindAsync(id);
            if (taiKhoan == null)
            {
                return NotFound();
            }

            _context.TaiKhoan.Remove(taiKhoan);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // Xử lý đăng nhập với mật khẩu đã được mã hóa
        [HttpPost("login")]
        public async Task<ActionResult<TaiKhoan>> Login([FromBody] LoginRequest request)
        {
            var taiKhoan = await _context.TaiKhoan
                .Include(t => t.ChucVu) // Bao gồm thông tin ChucVu
                .FirstOrDefaultAsync(t => t.tenTaiKhoan == request.Username);

            if (taiKhoan == null)
            {
                return Unauthorized("Tên tài khoản không tồn tại.");
            }

            var passwordHasher = new PasswordHasher<TaiKhoan>();
            var result = passwordHasher.VerifyHashedPassword(taiKhoan, taiKhoan.matKhau, request.Password);
            if (result == PasswordVerificationResult.Failed)
            {
                return Unauthorized("Mật khẩu không đúng.");
            }

            // Trả về thông tin người dùng cùng với vai trò (chucVu)
            return Ok(new
            {
                taiKhoan.idTaiKhoan,
                taiKhoan.tenTaiKhoan,
                taiKhoan.email,
                taiKhoan.ChucVu.tenChucVu  // Trả về thông tin chức vụ
            });

        }

        [HttpPost("quen-mat-khau")]
        public async Task<IActionResult> QuenMatKhau([FromBody] string email)
        {
            var user = await _context.TaiKhoan.FirstOrDefaultAsync(t => t.email == email);
            if (user == null) return NotFound("Email không tồn tại");

            // Tạo mật khẩu mới
            var newPassword = Guid.NewGuid().ToString().Substring(0, 8);
            var hasher = new PasswordHasher<TaiKhoan>();
            user.matKhau = hasher.HashPassword(user, newPassword);

            await _context.SaveChangesAsync();

            // (Optionally) Gửi mật khẩu mới qua email (nếu có SMTP)
            return Ok(new { message = "✅ Mật khẩu đã được cập nhật", newPassword }); // Tạm thời trả về để xem
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
        [HttpPost("yeu-cau-reset-mat-khau")]
        public async Task<IActionResult> YeuCauResetMatKhau([FromBody] string email)
        {
            var user = await _context.TaiKhoan.FirstOrDefaultAsync(t => t.email == email);
            if (user == null)
                return NotFound("Không tìm thấy email.");

            user.resetToken = Guid.NewGuid().ToString();
            user.resetTokenExpiry = DateTime.Now.AddMinutes(15);
            await _context.SaveChangesAsync();

            // Đọc từ cấu hình appsettings.json
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

            using (var smtp = new SmtpClient())
            {
                await smtp.ConnectAsync("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(senderEmail, senderPassword);
                await smtp.SendAsync(message);
                await smtp.DisconnectAsync(true);
            }

            return Ok(new
            {
                message = "✅ Hướng dẫn đặt lại mật khẩu đã được gửi qua email."
            });
        }

        public class ResetPasswordRequest
        {
            public string? Token { get; set; }
            public string? NewPassword { get; set; }
        }



    }
}
