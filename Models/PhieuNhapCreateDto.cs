using System;
using System.Collections.Generic;

namespace QuanLyKhoHangFPTShop.Models
{
    public class PhieuNhapCreateDto
    {
        public int idTaiKhoan { get; set; }
        public int idNhaCungCap { get; set; }
        public DateTime ngayNhap { get; set; }

        // ✅ KHÔNG BẮT BUỘC nữa vì server sẽ tự tạo
        public string? soLo { get; set; }

        public List<ChiTietDto> products { get; set; }
    }

    public class ChiTietDto
    {
        public int product { get; set; }
        public int quantity { get; set; }        // số lượng theo chứng từ
        public int realQuantity { get; set; }    // số lượng thực nhập
        public decimal unitPrice { get; set; }
        public string? note { get; set; }
        public string? nguoiGiaoHang { get; set; }

        // ✅ Bổ sung danh sách vị trí lưu
        public List<ViTriLuuDto>? positions { get; set; }
    }
    public class ViTriLuuDto
    {
        public int idViTri { get; set; }
        public int soLuong { get; set; }
    }

}
