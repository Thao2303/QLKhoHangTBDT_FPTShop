using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace QuanLyKhoHangFPTShop.server.Models
{
    [Table("THONGSOKYTHUAT")]
    public class ThongSoKyThuat
    {
        public int idThongSo { get; set; }

        [Required]
        public string tenThongSo { get; set; }

        [JsonIgnore]
        public ICollection<ChiTietThongSoKyThuat> ChiTietThongSoKyThuat { get; set; }


    }


}
