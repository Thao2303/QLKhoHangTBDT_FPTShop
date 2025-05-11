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

        public string? note { get; set; }        // ghi chú (có thể để trống)

        public string? nguoiGiaoHang { get; set; } // ✅ cho phép null để tránh lỗi validation
    }
}
