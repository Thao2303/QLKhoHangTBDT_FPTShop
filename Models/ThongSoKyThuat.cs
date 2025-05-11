using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace QuanLyKhoHangFPTShop.Models
{
    public class ThongSoKyThuat
    {
        public int idThongSo { get; set; }

        [Required]
        public string tenThongSo { get; set; }

        [JsonIgnore]
        public ICollection<ChiTietThongSoKyThuat> ChiTietThongSoKyThuat { get; set; }

 
    }


}
