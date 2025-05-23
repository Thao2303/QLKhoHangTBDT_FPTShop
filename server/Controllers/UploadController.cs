// ✅ 1. API nhận ảnh và lưu vào wwwroot/images

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;

namespace QuanLyKhoHangFPTShop.server.Controllers
{
    [Route("api/upload")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public UploadController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpPost("image")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            // Tạo tên file duy nhất
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var savePath = Path.Combine(_env.WebRootPath, "images", fileName);

            // Tạo thư mục nếu chưa có
            var folder = Path.GetDirectoryName(savePath);
            if (!string.IsNullOrEmpty(folder))
            {
                Directory.CreateDirectory(folder);
            }


            using (var stream = new FileStream(savePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Trả về đường dẫn ảnh
            var imageUrl = $"/images/{fileName}";
            return Ok(new { url = imageUrl });
        }

        [HttpDelete("delete")]
        public IActionResult DeleteImage([FromQuery] string fileName)
        {
            var path = Path.Combine(_env.WebRootPath, "images", fileName);
            if (System.IO.File.Exists(path))
            {
                System.IO.File.Delete(path);
                return Ok(new { message = "Đã xoá ảnh." });
            }
            return NotFound();
        }

    }
}
