namespace QuanLyKhoHangFPTShop.server.Models
{
    public class TaiKhoanCreateDto
    {
        public string tenTaiKhoan { get; set; }
        public string matKhau { get; set; }
        public string email { get; set; }
        public bool trangThai { get; set; }
        public DateTime ngayCap { get; set; }
        public int idChucVu { get; set; }
    }
}
