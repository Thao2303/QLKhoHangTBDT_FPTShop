using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyKhoHangFPTShop.Data;
using QuanLyKhoHangFPTShop.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace QuanLyKhoHangFPTShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KhuVucController : ControllerBase
    {
        private readonly WarehouseContext _context;

        public KhuVucController(WarehouseContext context)
        {
            _context = context;
        }

        // GET: api/khuvuc
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetAllKhuVuc()
        {
            var result = await _context.KhuVuc
                .Select(kv => new
                {
                    idKhuVuc = kv.idKhuVuc,
                    tenKhuVuc = kv.tenKhuVuc,
                    loaiKhuVuc = kv.loaiKhuVuc
                })
                .ToListAsync();

            return Ok(result);
        }
    }
}
