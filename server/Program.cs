using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;
using QuanLyKhoHangFPTShop.server.Hubs;
using Microsoft.AspNetCore.SignalR;
using QuanLyKhoHangFPTShop.server.Data;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Identity.UI.Services;

var builder = WebApplication.CreateBuilder(args);

// ✅ Cấu hình CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
     "http://localhost:3000",    // 👈 cần thêm dòng này
     "https://localhost:3000",
     "https://quanlykho-fpt.site"
 )


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

builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddEnvironmentVariables();

//builder.Services.AddTransient<IEmailSender, ElasticEmailSender>();

builder.Services.AddSingleton<IUserIdProvider, CustomUserIdProvider>(); // ✅ thêm vào đây
builder.Services.AddSingleton<ResendEmailSender>();

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
        opt.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

// ✅ Bỏ ép lỗi model binding tự động 400 Bad Request
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});

//builder.Services.AddScoped<MailjetService>();

// ✅ Bỏ yêu cầu implicit [Required] với kiểu reference không nullable
builder.Services.Configure<MvcOptions>(options =>
{
    options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true;
});
builder.Services.AddSingleton<IUserIdProvider, CustomUserIdProvider>();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Warehouse API", Version = "v1" });

    // Nếu có generate file XML comment thì bật cái này (tùy chọn)
    // var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    // var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    // c.IncludeXmlComments(xmlPath);
});


var app = builder.Build();

// ✅ Bật Swagger cho mọi môi trường
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Warehouse API V1");
    c.RoutePrefix = string.Empty;
});

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();
app.MapHub<ThongBaoHub>("/hub/thongbao");
app.UseStaticFiles();
app.Run();

