using Microsoft.AspNetCore.Mvc;
using Microsoft.ML;
using Microsoft.ML.Data;
using QuanLyKhoHangFPTShop.server.Models;

namespace QuanLyKhoHangFPTShop.server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MLGoiYController : ControllerBase
    {
        private readonly MLContext _mlContext;
        private readonly PredictionEngine<ViTriInput, ViTriPrediction> _predEngine;

        public MLGoiYController()
        {
            _mlContext = new MLContext();
            var model = _mlContext.Model.Load("MLModels/mlmodel.zip", out _);
            _predEngine = _mlContext.Model.CreatePredictionEngine<ViTriInput, ViTriPrediction>(model);
        }

        [HttpPost("goi-y-vitri")]
        public IActionResult GoiY([FromBody] ViTriInput input)
        {
            var prediction = _predEngine.Predict(input);
            return Ok(new { idViTri = (int)Math.Round(prediction.PredictedViTri) });
        }
    }
}
