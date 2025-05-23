using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyKhoHangFPTShop.server.Models;
using QuanLyKhoHangFPTShop.server.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace QuanLyKhoHangFPTShop.server.Controllers
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
                    kv.idKhuVuc,
                    kv.tenKhuVuc,
                    kv.loaiKhuVuc
                })
                .ToListAsync();

            return Ok(result);
        }
    }
}
