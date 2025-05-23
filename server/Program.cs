using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;
using QuanLyKhoHangFPTShop.server.Hubs;
using Microsoft.AspNetCore.SignalR;
using QuanLyKhoHangFPTShop.server.Data;

var builder = WebApplication.CreateBuilder(args);

// ✅ Cấu hình CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});
builder.Services.AddSignalR()
    .AddHubOptions<ThongBaoHub>(options =>
    {
        options.EnableDetailedErrors = true;
    });



builder.Services.AddSingleton<IUserIdProvider, CustomUserIdProvider>(); // ✅ thêm vào đây

// ✅ Cấu hình DbContext
builder.Services.AddDbContext<WarehouseContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
    options.EnableSensitiveDataLogging(); // Debug SQL nếu cần
});

// ✅ Cấu hình controllers & JSON
builder.Services.AddControllers()
    .AddJsonOptions(opt =>
    {
        opt.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        opt.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// ✅ Bỏ ép lỗi model binding tự động 400 Bad Request
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});

// ✅ Bỏ yêu cầu implicit [Required] với kiểu reference không nullable
builder.Services.Configure<MvcOptions>(options =>
{
    options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true;
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Warehouse API V1");
        c.RoutePrefix = string.Empty;
    });
}

app.UseCors("AllowFrontend");

app.UseAuthorization();
app.MapControllers();
app.MapHub<ThongBaoHub>("/hub/thongbao");
app.UseStaticFiles();
app.Run();
builder.Logging.AddConsole();
