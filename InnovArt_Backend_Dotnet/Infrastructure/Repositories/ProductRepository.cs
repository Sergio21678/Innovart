using InnovArt_Backend_Dotnet.Domain.Entities;
using InnovArt_Backend_Dotnet.Domain.Interfaces;
using InnovArt_Backend_Dotnet.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InnovArt_Backend_Dotnet.Infrastructure.Repositories;

public class ProductRepository : BaseRepository<Product>, IProductRepository
{
    public ProductRepository(ApplicationDbContext db) : base(db) { }

    public async Task<IEnumerable<Product>> GetByUserAsync(int usuarioId) =>
        await _db.Products.AsNoTracking().Where(p => p.UsuarioId == usuarioId).ToListAsync();
}

