using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyKhoHangFPTShop.server.Models;
using QuanLyKhoHangFPTShop.server.Data;

[Route("api/[controller]")]
[ApiController]
public class DonViTinhController : ControllerBase
{
    private readonly WarehouseContext _context;

    public DonViTinhController(WarehouseContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DonViTinh>>> GetAll()
    {
        return await _context.DonViTinh.ToListAsync();
    }
}
