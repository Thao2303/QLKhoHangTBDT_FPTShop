using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyKhoHangFPTShop.Data;
using QuanLyKhoHangFPTShop.Dtos;
using QuanLyKhoHangFPTShop.Models;

namespace WarehouseManagementAPI.Controllers
{
    [Route("api/sanpham")]
    [ApiController]
    public class SanPhamController : ControllerBase
    {
        private readonly WarehouseContext _context;

        public SanPhamController(WarehouseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _context.SanPham
                .Include(sp => sp.DanhMuc)
                .Include(sp => sp.ThuongHieu)
                .Include(sp => sp.NhaCungCap)
                .Include(sp => sp.DonViTinh)
                .ToListAsync();

            return Ok(list);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SanPhamCreateDto dto)
        {
            if (await _context.SanPham.AnyAsync(x => x.sku == dto.sku))
                return BadRequest("❌ SKU đã tồn tại");

            var sp = new SanPham
            {
                sku = dto.sku,
                tenSanPham = dto.tenSanPham,
                moTa = dto.moTa,
                khoiLuong = dto.khoiLuong,
                donGiaBan = dto.donGiaBan,

                idDanhMuc = dto.idDanhMuc,
                idThuongHieu = dto.idThuongHieu,
                idNhaCungCap = dto.idNhaCungCap,
                idDonViTinh = dto.idDonViTinh,

                soLuongHienCon = dto.soLuongHienCon,
                soLuongToiThieu = dto.soLuongToiThieu,

                mauSac = dto.mauSac,
                ngaySanXuat = dto.ngaySanXuat,

                chieuDai = dto.chieuDai,
                chieuRong = dto.chieuRong,
                chieuCao = dto.chieuCao
            };

            _context.SanPham.Add(sp);
            await _context.SaveChangesAsync();
            return Ok(new { message = "✅ Đã thêm sản phẩm", id = sp.idSanPham });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] SanPhamCreateDto dto)
        {
            var sp = await _context.SanPham.FindAsync(id);
            if (sp == null) return NotFound("Không tìm thấy sản phẩm");

            sp.sku = dto.sku;
            sp.tenSanPham = dto.tenSanPham;
            sp.moTa = dto.moTa;
            sp.khoiLuong = dto.khoiLuong;
            sp.donGiaBan = dto.donGiaBan;

            sp.idDanhMuc = dto.idDanhMuc;
            sp.idThuongHieu = dto.idThuongHieu;
            sp.idNhaCungCap = dto.idNhaCungCap;
            sp.idDonViTinh = dto.idDonViTinh;

            sp.soLuongHienCon = dto.soLuongHienCon;
            sp.soLuongToiThieu = dto.soLuongToiThieu;

            sp.mauSac = dto.mauSac;
            sp.ngaySanXuat = dto.ngaySanXuat;

            sp.chieuDai = dto.chieuDai;
            sp.chieuRong = dto.chieuRong;
            sp.chieuCao = dto.chieuCao;

            await _context.SaveChangesAsync();
            return Ok(new { message = "✅ Cập nhật thành công" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var sp = await _context.SanPham.FindAsync(id);
            if (sp == null) return NotFound("Không tìm thấy");

            _context.SanPham.Remove(sp);
            await _context.SaveChangesAsync();
            return Ok(new { message = "🗑 Đã xoá sản phẩm" });
        }
    }


}
