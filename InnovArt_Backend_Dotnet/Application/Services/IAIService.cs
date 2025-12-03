using InnovArt_Backend_Dotnet.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InnovArt_Backend_Dotnet.Application.Services;

public interface IAIService
{
    Task<IEnumerable<Product>> RecommendProductsAsync(int? userId = null, int take = 5);
}

