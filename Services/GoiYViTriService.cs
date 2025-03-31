using QuanLyKhoHangFPTShop.Models;

namespace QuanLyKhoHangFPTShop.Services
{
    public class GoiYViTriService
    {
        private readonly List<ViTriKho> viTriTrongKho;

        public GoiYViTriService()
        {
            // Giả lập dữ liệu vị trí trống trong kho
            viTriTrongKho = new List<ViTriKho>
            {
                new ViTriKho("A", 1, 1, 20),
                new ViTriKho("A", 1, 2, 30),
                new ViTriKho("B", 2, 1, 50),
                new ViTriKho("C", 1, 3, 15),
                new ViTriKho("D", 1, 4, 25),
                new ViTriKho("E", 1, 5, 40),
                // Có thể load từ DB trong thực tế
            };
        }

        public List<ViTriDeXuatDto> ChayThuatToanGA(GoiYViTriRequest request)
        {
            var result = new List<ViTriDeXuatDto>();

            foreach (var sp in request.SanPhams)
            {
                int soLuongConLai = sp.SoLuong;
                var deXuat = new ViTriDeXuatDto
                {
                    IdSanPham = sp.IdSanPham,
                    TenSanPham = $"Sản phẩm #{sp.IdSanPham}",
                    DonViTinh = "Cái",
                    SoLuong = sp.SoLuong,
                    ViTriDeXuat = new List<DeXuatViTri>()
                };

                foreach (var vt in viTriTrongKho.OrderByDescending(v => v.SucChua))
                {
                    if (soLuongConLai <= 0) break;

                    int soLuongLuu = Math.Min(vt.SucChua, soLuongConLai);
                    deXuat.ViTriDeXuat.Add(new DeXuatViTri
                    {
                        Day = vt.Day,
                        Tang = vt.Tang,
                        Cot = vt.Cot,
                        SoLuong = soLuongLuu
                    });
                    soLuongConLai -= soLuongLuu;
                }

                result.Add(deXuat);
            }

            return result;
        }
    }

    public class ViTriKho
    {
        public string Day { get; set; }
        public int Tang { get; set; }
        public int Cot { get; set; }
        public int SucChua { get; set; }

        public ViTriKho(string day, int tang, int cot, int sucChua)
        {
            Day = day;
            Tang = tang;
            Cot = cot;
            SucChua = sucChua;
        }
    }
}
