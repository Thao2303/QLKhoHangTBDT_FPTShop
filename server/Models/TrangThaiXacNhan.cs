﻿using System.ComponentModel.DataAnnotations;

namespace QuanLyKhoHangFPTShop.server.Models
{
    public class TrangThaiXacNhan
    {
        [Key]
        public int idTrangThaiXacNhan { get; set; }
        public string tenTrangThaiXacNhan { get; set; }
    }
}
