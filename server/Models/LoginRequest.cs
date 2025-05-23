using System.ComponentModel.DataAnnotations;

namespace QuanLyKhoHangFPTShop.server.Models
{
    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
