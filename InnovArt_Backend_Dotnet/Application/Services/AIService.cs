using InnovArt_Backend_Dotnet.Domain.Entities;
using InnovArt_Backend_Dotnet.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InnovArt_Backend_Dotnet.Application.Services;

public class AIService : IAIService
{
    private readonly IUnitOfWork _uow;

    public AIService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    // Heurística simple: productos más recientes y, si se pasa userId, prioriza los del mismo artesano
    public async Task<IEnumerable<Product>> RecommendProductsAsync(int? userId = null, int take = 5)
    {
        var query = _uow.Products.Query();
        if (userId.HasValue)
        {
            query = query.OrderByDescending(p => p.UsuarioId == userId.Value)
                         .ThenByDescending(p => p.Id);
        }
        else
        {
            query = query.OrderByDescending(p => p.Id);
        }

        return await query.Take(take).ToListAsync();
    }
}

