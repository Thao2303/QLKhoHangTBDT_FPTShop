using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyKhoHangFPTShop.server.Models;
using QuanLyKhoHangFPTShop.server.Data;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text;

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
            if (dto == null || dto.idChucVu == 0)
                return BadRequest("❌ Dữ liệu chức vụ không hợp lệ.");

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
            var domain = _config["FrontendDomain"] ?? "https://localhost:3000";
            var loginUrl = $"{domain}/login";

            var payload = new
            {
                from = _config["Resend:FromEmail"], // onboarding@resend.dev nếu chưa verify domain
                to = taiKhoan.email,
                subject = "Thông tin tài khoản hệ thống FPT Shop",
                html = $@"<p>Chào {taiKhoan.tenTaiKhoan},</p>
              <p>Bạn đã được cấp tài khoản truy cập hệ thống quản lý kho FPT Shop:</p>
              <ul>
                  <li><b>Tên đăng nhập:</b> {taiKhoan.tenTaiKhoan}</li>
                  <li><b>Mật khẩu tạm thời:</b> {plainPassword}</li>
                  <li><b>Đăng nhập tại:</b> <a href='{loginUrl}'>{loginUrl}</a></li>
              </ul>
              <p><i>⚠️ Vui lòng đổi mật khẩu sau khi đăng nhập để bảo mật tài khoản.</i></p>"
            };

            using var client = new HttpClient();
            client.BaseAddress = new Uri("https://api.resend.com/");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config["Resend:ApiKey"]);

            var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
            var response = await client.PostAsync("emails", content);
            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                return StatusCode(500, "Lỗi gửi mail: " + error);
            }



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

            var domain = _config["FrontendDomain"] ?? "https://localhost:3000";
      

   

            var resetLink = $"{domain}/reset-password?token={user.resetToken}";
            var htmlBody = $@"<p>Chào {user.tenTaiKhoan},</p>
<p>Bạn đã yêu cầu đặt lại mật khẩu. Nhấn vào link bên dưới để thực hiện:</p>
<p><a href='{resetLink}'>{resetLink}</a></p>
<p><i>Link có hiệu lực trong 15 phút.</i></p>";

            var payload = new
            {
                from = _config["Resend:FromEmail"],
                to = user.email,
                subject = "Đặt lại mật khẩu - FPT Shop",
                html = htmlBody
            };

            using var client = new HttpClient();
            client.BaseAddress = new Uri("https://api.resend.com/");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config["Resend:ApiKey"]);

            var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
            var response = await client.PostAsync("emails", content);
            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                return StatusCode(500, "Lỗi gửi mail: " + error);
            }



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