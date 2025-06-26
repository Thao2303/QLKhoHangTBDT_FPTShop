using Microsoft.ML.Data;

namespace QuanLyKhoHangFPTShop.server.Models

{
    public class ViTriInput
    {
        [LoadColumn(0)]
        public float idSanPham { get; set; }

        [LoadColumn(1)]
        public float soLuong { get; set; }

        [LoadColumn(2)]
        public float trongLuong { get; set; }

        [LoadColumn(3)]
        public float idDanhMuc { get; set; }

        [LoadColumn(4)]
        public string loaiKhuVuc { get; set; }

        [LoadColumn(5)]
        public float Label { get; set; }
    }

    public class ViTriPrediction
    {
        [ColumnName("Score")]
        public float PredictedViTri { get; set; }
    }
}
