using InnovArt_Backend_Dotnet.Application.DTOs;
using System.Collections.Generic;
using System.Net.Http.Json;
using System.Text.Json;

namespace InnovArt_Backend_Dotnet.Application.Services;

public class ExternalApiService : IExternalApiService
{
    private readonly HttpClient _httpClient;
    private const string ApiUrl = "https://fakestoreapi.com/products?limit=5";

    public ExternalApiService(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _httpClient.Timeout = TimeSpan.FromSeconds(5);
    }

    public async Task<IEnumerable<ExternalInspirationDto>> GetCraftInspirationsAsync(CancellationToken cancellationToken)
    {
        try
        {
            using var response = await _httpClient.GetAsync(ApiUrl, cancellationToken);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync(cancellationToken);
            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;

            var items = new List<ExternalInspirationDto>();
            foreach (var item in root.EnumerateArray())
            {
                items.Add(new ExternalInspirationDto
                {
                    Title = item.GetProperty("title").GetString() ?? "Sin título",
                    Description = item.TryGetProperty("description", out var desc) ? desc.GetString() : null,
                    Url = item.TryGetProperty("image", out var img) ? img.GetString() : null,
                    Source = "fakestoreapi.com"
                });
            }

            return items;
        }
        catch
        {
            // Fallback para entornos sin acceso de red
            return new List<ExternalInspirationDto>
            {
                new ExternalInspirationDto { Title = "Cerámica minimalista", Description = "Inspiración offline", Source = "fallback", Url = null },
                new ExternalInspirationDto { Title = "Textiles andinos", Description = "Inspiración offline", Source = "fallback", Url = null }
            };
        }
    }
}
