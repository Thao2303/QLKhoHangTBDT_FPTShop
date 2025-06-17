using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyKhoHangFPTShop.server.Data;
using QuanLyKhoHangFPTShop.server.Dtos;
using QuanLyKhoHangFPTShop.server.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuanLyKhoHangFPTShop.server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhieuXuatController : ControllerBase
    {
        private readonly WarehouseContext _context;

        public PhieuXuatController(WarehouseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PhieuXuat>>> GetPhieuXuat()
        {
            return await _context.PhieuXuat
                .Include(px => px.YeuCauXuatKho)
                    .ThenInclude(yc => yc.DaiLy)
                .Include(px => px.ChiTietPhieuXuats)
                    .ThenInclude(ct => ct.SanPham)
                .Include(px => px.ChiTietPhieuXuats)
                    .ThenInclude(ct => ct.ViTri) // 🔥 THÊM DÒNG NÀY
                .ToListAsync();
        }



        [HttpGet("{id}")]
        public async Task<ActionResult<PhieuXuat>> GetPhieuXuat(int id)
        {
            var phieuXuat = await _context.PhieuXuat
              
     .Include(px => px.YeuCauXuatKho)
         .ThenInclude(yc => yc.TrangThaiXacNhan)
     .Include(px => px.YeuCauXuatKho)
         .ThenInclude(yc => yc.DaiLy)
     .Include(px => px.ChiTietPhieuXuats)
         .ThenInclude(ct => ct.SanPham)
     .Include(px => px.ChiTietPhieuXuats)
         .ThenInclude(ct => ct.ViTri)
     .FirstOrDefaultAsync(px => px.IdPhieuXuat == id);


            if (phieuXuat == null)
            {
                return NotFound();
            }

            return phieuXuat;
        }

        [HttpPost("kiemtra-tonkho")]
        public async Task<IActionResult> KiemTraTonKho([FromBody] List<ChiTietPhieuXuat> ds)
        {
            foreach (var item in ds)
            {
                var sp = await _context.SanPham.FindAsync(item.IdSanPham);
                if (sp == null || sp.soLuongHienCon < item.SoLuong)
                {
                    return BadRequest($"Sản phẩm {item.IdSanPham} không đủ tồn kho.");
                }
            }
            return Ok();
        }
        [HttpGet("sanpham/danhmuc/{id}")]
        public async Task<IActionResult> GetSanPhamTheoDanhMuc(int id)
        {
            var list = await _context.SanPham
                .Where(sp => sp.idDanhMuc == id)
                .ToListAsync();
            return Ok(list);
        }
        [HttpGet("danhmuc")]
        public async Task<IActionResult> GetDanhMuc()
        {
            var list = await _context.DanhMuc.ToListAsync();
            return Ok(list);
        }

        [HttpPost]
        public async Task<IActionResult> PostPhieuXuat([FromBody] PhieuXuatDTO dto)
        {
            _context.ChangeTracker.Clear();

            var phieu = new PhieuXuat
            {
                MaPhieu = "PX" + DateTime.Now.ToString("yyMMddHHmmss"),
                NgayXuat = dto.NgayXuat.Date.Add(DateTime.Now.TimeOfDay),
                GhiChu = dto.GhiChu,
                NguoiXuat = dto.NguoiTao,
                IdYeuCauXuatKho = dto.IdYeuCauXuatKho,
                ChiTietPhieuXuats = new List<ChiTietPhieuXuat>()
            };

            foreach (var ct in dto.ChiTietPhieuXuats)
            {
                if (ct == null || ct.IdSanPham <= 0 || ct.SoLuong <= 0)
                    return BadRequest("Dữ liệu sản phẩm không hợp lệ.");

                var sp = await _context.SanPham.FindAsync(ct.IdSanPham);
                if (sp == null)
                    return BadRequest($"Không tìm thấy sản phẩm ID {ct.IdSanPham}.");

                if (sp.soLuongHienCon < ct.SoLuong)
                    return BadRequest($"Sản phẩm ID {ct.IdSanPham} không đủ tồn kho (hiện còn {sp.soLuongHienCon}, cần {ct.SoLuong}).");

                sp.soLuongHienCon -= ct.SoLuong;
           //     var thanhTien = ct.SoLuong * sp.donGiaBan;
                // ❌ KHÔNG dùng idLoHang nữa, lấy bất kỳ bản ghi ChiTietLuuTru theo idSanPham + idViTri
                var luuTru = await _context.ChiTietLuuTru
                    .Where(l => l.idSanPham == ct.IdSanPham && l.idViTri == ct.IdViTri)
                    .OrderBy(l => l.thoiGianLuu) // FIFO
                    .FirstOrDefaultAsync();

                if (luuTru == null)
                    return BadRequest($"Không tìm thấy vị trí lưu trữ cho SP {ct.IdSanPham} - VT {ct.IdViTri}");

                luuTru.soLuong -= ct.SoLuong;
                var donGia = sp.donGiaBan; // 💡 LẤY GIÁ BÁN HIỆN TẠI

                var chietKhau = ct.ChietKhau ?? 0;
                var giaSauChietKhau = donGia * (1 - chietKhau / 100m);
                var thanhTien = ct.SoLuong * giaSauChietKhau;

                phieu.ChiTietPhieuXuats.Add(new ChiTietPhieuXuat
                {
                    IdSanPham = ct.IdSanPham,
                    IdViTri = ct.IdViTri,
                    SoLuong = ct.SoLuong,
                    donGiaXuat = donGia,
                    chietKhau = chietKhau,
                    giaSauChietKhau = giaSauChietKhau,
                    tongTien = thanhTien
                });



            }

            _context.PhieuXuat.Add(phieu);
            await _context.SaveChangesAsync();

            // ✅ Cập nhật trạng thái yêu cầu
            if (dto.IdYeuCauXuatKho != null && dto.IdYeuCauXuatKho > 0)
            {
                var yc = await _context.YeuCauXuatKho.FindAsync(dto.IdYeuCauXuatKho);
                if (yc != null)
                {
                    yc.IdTrangThaiXacNhan = 4; // ✅ Đã xuất kho
                    await _context.SaveChangesAsync();
                }
            }

            return Ok(phieu);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutPhieuXuat(int id, PhieuXuat phieuXuat)
        {
            if (id != phieuXuat.IdPhieuXuat)
            {
                return BadRequest();
            }

            _context.Entry(phieuXuat).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.PhieuXuat.Any(px => px.IdPhieuXuat == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhieuXuat(int id)
        {
            var phieuXuat = await _context.PhieuXuat.FindAsync(id);
            if (phieuXuat == null)
            {
                return NotFound();
            }

            _context.PhieuXuat.Remove(phieuXuat);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpGet("vitri-sanpham/{id}")]
        public async Task<IActionResult> GetViTriTheoSanPham(int id)
        {
            var list = await _context.ChiTietLuuTru
                .Where(c => c.idSanPham == id && c.soLuong > 0)
                .Include(c => c.ViTri)
                .Select(c => new
                {
                    c.idViTri,
                    c.ViTri.day,
                    c.ViTri.cot,
                    c.ViTri.tang,
                    SoLuongCon = c.soLuong
                })
                .ToListAsync();

            return Ok(list);
        }


    }
}