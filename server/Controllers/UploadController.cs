using Microsoft.AspNetCore.Mvc;
using QuanLyKhoHangFPTShop.server.Services;

namespace QuanLyKhoHangFPTShop.server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UploadController : ControllerBase
    {
        private readonly CloudinaryService _cloudinaryService;

        public UploadController(CloudinaryService cloudinaryService)
        {
            _cloudinaryService = cloudinaryService;
        }

        [HttpPost("image")]
        public async Task<IActionResult> UploadImage([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Không có ảnh được gửi lên.");

            try
            {
                var imageUrl = await _cloudinaryService.UploadImageAsync(file);
                return Ok(new { url = imageUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
