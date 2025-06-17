using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyKhoHangFPTShop.server.Data;
using QuanLyKhoHangFPTShop.server.Models;

namespace QuanLyKhoHangFPTShop.server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuanHuyenController : ControllerBase
    {
        private readonly WarehouseContext _context;

        public QuanHuyenController(WarehouseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<QuanHuyen>>> GetByTinhId([FromQuery] int tinhId)
        {
            return await _context.QuanHuyen
                .Where(q => q.idTinhThanh == tinhId)
                .ToListAsync();
        }
    }
}
