using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyKhoHangFPTShop.server.Data;
using QuanLyKhoHangFPTShop.server.Models;

namespace QuanLyKhoHangFPTShop.server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhuongXaController : ControllerBase
    {
        private readonly WarehouseContext _context;

        public PhuongXaController(WarehouseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PhuongXa>>> GetByHuyenId([FromQuery] int huyenId)
        {
            return await _context.PhuongXa
                .Where(x => x.idQuanHuyen == huyenId)
                .ToListAsync();
        }
    }
}
