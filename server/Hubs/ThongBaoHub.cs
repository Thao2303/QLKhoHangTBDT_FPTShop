using Microsoft.AspNetCore.SignalR;

namespace QuanLyKhoHangFPTShop.server.Hubs
{
    public class ThongBaoHub : Hub
    {
        public override Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier;
            Console.WriteLine($"📡 [SignalR] Connected: userId = {userId}");
            return base.OnConnectedAsync();
        }

        public Task GuiThongBao(string userId, string message)
        {
            return Clients.User(userId).SendAsync("NhanThongBao", message);
        }
    }

}
