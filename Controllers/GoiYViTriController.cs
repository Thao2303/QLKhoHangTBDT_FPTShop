using Microsoft.AspNetCore.Mvc;
using QuanLyKhoHangFPTShop.Models;
using QuanLyKhoHangFPTShop.Services;

namespace QuanLyKhoHangFPTShop.Controllers
{
    [ApiController]
    [Route("api/goiyvitri")]
    public class GoiYViTriController : ControllerBase
    {
        private readonly GoiYViTriService _service;

        public GoiYViTriController(GoiYViTriService service)
        {
            _service = service;
        }

        [HttpPost]
        public IActionResult GoiYViTri([FromBody] GoiYViTriRequest request)
        {
            var result = _service.ChayThuatToanGA(request);
            return Ok(result);
        }
    }

}
