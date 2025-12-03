using InnovArt_Backend_Dotnet.Domain.Entities;
using InnovArt_Backend_Dotnet.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InnovArt_Backend_Dotnet.Application.Services;

public class ReviewService : IReviewService
{
    private readonly IUnitOfWork _uow;

    public ReviewService(IUnitOfWork uow) => _uow = uow;

    public async Task<Review> CreateAsync(Review review)
    {
        if (review.Rating < 1 || review.Rating > 5) throw new ArgumentException("Rating debe estar entre 1 y 5");
        await _uow.Repository<Review>().AddAsync(review);
        await _uow.SaveChangesAsync();
        return review;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var item = await _uow.Repository<Review>().GetByIdAsync(id);
        if (item is null) return false;
        _uow.Repository<Review>().Remove(item);
        await _uow.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<Review>> GetAllAsync(int? productoId = null, int? clienteId = null, int? artesanoId = null)
    {
        var query = _uow.Repository<Review>().Query();
        if (productoId.HasValue) query = query.Where(r => r.ProductId == productoId.Value);
        if (clienteId.HasValue) query = query.Where(r => r.UserId == clienteId.Value);

        if (artesanoId.HasValue)
        {
            var products = await _uow.Repository<Product>()
                .Query()
                .Where(p => p.UsuarioId == artesanoId.Value)
                .Select(p => p.Id)
                .ToListAsync();

            var productIds = products.ToHashSet();
            query = query.Where(r => productIds.Contains(r.ProductId));
        }

        return await query.ToListAsync();
    }

    public async Task<Review?> GetByIdAsync(int id) => await _uow.Repository<Review>().GetByIdAsync(id);
}
