using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyKhoHangFPTShop.server.Data;
using QuanLyKhoHangFPTShop.server.Models;

namespace QuanLyKhoHangFPTShop.server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TinhThanhController : ControllerBase
    {
        private readonly WarehouseContext _context;

        public TinhThanhController(WarehouseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TinhThanh>>> GetTinhThanh()
        {
            return await _context.TinhThanh.ToListAsync();
        }
    }
}
