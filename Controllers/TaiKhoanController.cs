using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLKhoHangFPTShop.Models;
using QuanLyKhoHangFPTShop.Data;
using QuanLyKhoHangFPTShop.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace QLKhoHangFPTShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaiKhoanController : ControllerBase
    {
        private readonly WarehouseContext _context;

        public TaiKhoanController(WarehouseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaiKhoan>>> GetTaiKhoan()
        {
            return await _context.TaiKhoan.ToListAsync();
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

        // Đảm bảo mật khẩu được mã hóa trước khi lưu vào cơ sở dữ liệu
        [HttpPost]
        public async Task<ActionResult<TaiKhoan>> PostTaiKhoan(TaiKhoan taiKhoan)
        {
            try
            {
                // Nếu idChucVu không có giá trị, gán giá trị mặc định (ví dụ: 0)
                if (taiKhoan.idChucVu == 0)
                {
                    // Gán giá trị mặc định cho idChucVu (nếu cần)
                    taiKhoan.idChucVu = 0;
                }
                else
                {
                    // Kiểm tra xem idChucVu có hợp lệ không trước khi thêm
                    var chucVu = await _context.ChucVu.FindAsync(taiKhoan.idChucVu);
                    if (chucVu == null)
                    {
                        return BadRequest("Chức vụ không tồn tại.");
                    }
                }

                // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
                var passwordHasher = new PasswordHasher<TaiKhoan>();
                taiKhoan.matKhau = passwordHasher.HashPassword(taiKhoan, taiKhoan.matKhau);

                _context.TaiKhoan.Add(taiKhoan);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetTaiKhoan), new { id = taiKhoan.idTaiKhoan }, taiKhoan);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi tạo tài khoản: {ex.Message}");
            }
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
            try
            {
                // Kiểm tra xem tên tài khoản có tồn tại không
                var taiKhoan = await _context.TaiKhoan
                    .FirstOrDefaultAsync(t => t.tenTaiKhoan == request.Username);

                if (taiKhoan == null)
                {
                    return Unauthorized("Tên tài khoản không tồn tại.");
                }

                // Kiểm tra mật khẩu (so sánh mật khẩu đã mã hóa với mật khẩu nhập vào)
                var passwordHasher = new PasswordHasher<TaiKhoan>();
                var result = passwordHasher.VerifyHashedPassword(taiKhoan, taiKhoan.matKhau, request.Password);
                if (result == PasswordVerificationResult.Failed)
                {
                    return Unauthorized("Mật khẩu không đúng.");
                }

                // Trả về thông tin tài khoản nếu đăng nhập thành công
                return Ok(taiKhoan);
            }
            catch (Exception ex)
            {
                // Log lỗi hoặc trả về thông tin chi tiết
                return StatusCode(500, $"Lỗi khi xử lý đăng nhập: {ex.Message}");
            }
        }
    }
}
