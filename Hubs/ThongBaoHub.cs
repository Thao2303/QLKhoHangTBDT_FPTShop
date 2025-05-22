using Microsoft.AspNetCore.SignalR;

namespace QuanLyKhoHangFPTShop.Hubs
{
    public class ThongBaoHub : Hub
    {
        public async Task GuiThongBao(string userId, string message)
        {
            await Clients.User(userId).SendAsync("NhanThongBao", message);
        }

        public override Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var id = httpContext?.Request.Query["userId"];

            Console.WriteLine("📡 [SignalR] Client connected with userId = " + id); // ✅ Thêm dòng này để log

            if (!string.IsNullOrEmpty(id))
                Context.Items["userId"] = id;

            return base.OnConnectedAsync();
        }

    }
}
