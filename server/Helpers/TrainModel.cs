using Microsoft.ML;
using Microsoft.ML.Data;
using QuanLyKhoHangFPTShop.server.Models; // Nếu ViTriInput nằm trong thư mục Models

namespace QuanLyKhoHangFPTShop.server.Helpers
{
    public class TrainModel
    {
        public static void Train()
        {
            var mlContext = new MLContext();

            var data = mlContext.Data.LoadFromTextFile<ViTriInput>(
                "Data/viTriData.csv",
                separatorChar: ',',
                hasHeader: true
            );

            var pipeline = mlContext.Transforms.Categorical.OneHotEncoding("loaiKhuVuc")
                .Append(mlContext.Transforms.Concatenate("Features",
                    "idSanPham", "soLuong", "trongLuong", "idDanhMuc", "loaiKhuVuc"))
                .Append(mlContext.Regression.Trainers.FastTree());

            var model = pipeline.Fit(data);

            mlContext.Model.Save(model, data.Schema, "MLModels/mlmodel.zip");
        }
    }
}
