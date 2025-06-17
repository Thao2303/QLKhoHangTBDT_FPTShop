using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyKhoHangFPTShop.server.Models;
using QuanLyKhoHangFPTShop.server.Data;
using QuanLyKhoHangFPTShop.server.Dtos;

namespace QuanLyKhoHangFPTShop.server.Controllers
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
        [HttpGet("{id}")]
        public async Task<ActionResult<SanPham>> GetSanPham(int id)
        {
            var sp = await _context.SanPham.FindAsync(id);
            if (sp == null)
            {
                return NotFound();
            }
            return sp;
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
                chieuCao = dto.chieuCao,
                hinhAnh = dto.hinhAnh
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
            sp.hinhAnh = dto.hinhAnh;

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

        [HttpGet("{id}/vitri-theo-lo")]
        public IActionResult GetViTriTheoLo(int id)
        {
            var result = (from ct in _context.ChiTietLuuTru
                          join vt in _context.ViTri on ct.idViTri equals vt.idViTri
                          join lo in _context.LoHang on ct.idLoHang equals lo.idLoHang
                          where ct.idSanPham == id && ct.soLuong > 0
                          select new
                          {
                              ct.idViTri,
                              tenViTri = $"Dãy {vt.day} - Cột {vt.cot} - Tầng {vt.tang}",
                              ct.soLuong,
                              lo.idLoHang,
                              lo.tenLo
                          }).ToList();

            return Ok(result);
        }
        [HttpGet("{id}/vitri")]
        public IActionResult GetViTriTheoSanPham(int id)
        {
            var result = (from ct in _context.ChiTietLuuTru
                          join vt in _context.ViTri on ct.idViTri equals vt.idViTri
                          where ct.idSanPham == id && ct.soLuong > 0
                          group ct by new { ct.idViTri, vt.day, vt.cot, vt.tang, vt.sucChua, vt.daDung } into g
                          select new
                          {
                              idViTri = g.Key.idViTri,
                              day = g.Key.day,
                              cot = g.Key.cot,
                              tang = g.Key.tang,
                              tenViTri = $"Dãy {g.Key.day} - Cột {g.Key.cot} - Tầng {g.Key.tang}",
                              soLuong = g.Sum(x => x.soLuong),
                              sucChua = g.Key.sucChua,
                              daDung = g.Key.daDung
                          }).ToList();

            return Ok(result);
        }

        [HttpPut("update-toithieu/{id}")]
        public async Task<IActionResult> UpdateTonToiThieu(int id, [FromBody] int soLuongToiThieu)
        {
            var sp = await _context.SanPham.FindAsync(id);
            if (sp == null) return NotFound();

            sp.soLuongToiThieu = soLuongToiThieu;
            await _context.SaveChangesAsync();

            return Ok(new { message = "✅ Đã cập nhật tồn tối thiểu" });
        }


    }


}
