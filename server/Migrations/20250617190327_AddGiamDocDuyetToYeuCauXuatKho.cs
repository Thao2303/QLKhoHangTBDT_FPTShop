using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuanLyKhoHangFPTShop.Migrations
{
    /// <inheritdoc />
    public partial class AddGiamDocDuyetToYeuCauXuatKho : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "giamDocDuyet",
                table: "YEUCAUXUATKHO",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "giamDocDuyet",
                table: "YEUCAUXUATKHO");
        }
    }
}
