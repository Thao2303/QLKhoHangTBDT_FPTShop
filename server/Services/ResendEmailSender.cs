using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

public class ResendEmailSender
{
    private readonly IConfiguration _config;
    private readonly HttpClient _http;

    public ResendEmailSender(IConfiguration config)
    {
        _config = config;
        _http = new HttpClient();
        _http.BaseAddress = new Uri("https://api.resend.com/");
        _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config["Resend:ApiKey"]);
    }

    public async Task SendEmailAsync(string to, string subject, string html)
    {
        var payload = new
        {
            from = _config["Resend:FromEmail"],
            to = to,
            subject = subject,
            html = html
        };

        var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
        var response = await _http.PostAsync("emails", content);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            throw new Exception("Email sending failed: " + error);
        }
    }
}
