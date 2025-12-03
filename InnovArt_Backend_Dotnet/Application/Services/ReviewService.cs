using InnovArt_Backend_Dotnet.Domain.Entities;
using InnovArt_Backend_Dotnet.Domain.Interfaces;
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
        var all = (await _uow.Repository<Review>().GetAllAsync()).ToList();
        if (productoId.HasValue) all = all.Where(r => r.ProductId == productoId.Value).ToList();
        if (clienteId.HasValue) all = all.Where(r => r.UserId == clienteId.Value).ToList();
        if (artesanoId.HasValue)
        {
            var products = (await _uow.Repository<Product>().GetAllAsync()).Where(p => p.UsuarioId == artesanoId.Value).Select(p => p.Id).ToHashSet();
            all = all.Where(r => products.Contains(r.ProductId)).ToList();
        }
        return all;
    }

    public async Task<Review?> GetByIdAsync(int id) => await _uow.Repository<Review>().GetByIdAsync(id);
}
