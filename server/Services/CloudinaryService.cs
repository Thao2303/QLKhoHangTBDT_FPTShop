using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;

namespace QuanLyKhoHangFPTShop.server.Services
{
    public class CloudinaryService
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryService(IConfiguration config)
        {
            var account = new Account(
                config["Cloudinary:CloudName"],
                config["Cloudinary:ApiKey"],
                config["Cloudinary:ApiSecret"]
            );

            _cloudinary = new Cloudinary(account);
            _cloudinary.Api.Secure = true; // đảm bảo trả về URL https
        }

        public async Task<string> UploadImageAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("Ảnh không hợp lệ");

            await using var stream = file.OpenReadStream();

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = "quanlykho",           // thư mục Cloudinary
                UseFilename = true,             // giữ tên file gốc
                UniqueFilename = true,          // tránh trùng lặp
                Overwrite = false
            };

            var result = await _cloudinary.UploadAsync(uploadParams);

            if (result.StatusCode == System.Net.HttpStatusCode.OK)
                return result.SecureUrl.ToString();

            throw new Exception("Upload thất bại: " + result.Error?.Message);
        }
    }
}
