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
        public async Task<IActionResult> GetAll()
        {
            var taiKhoans = await _context.TaiKhoan
                .Include(t => t.ChucVu)
                .Select(t => new {
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


    }
}
