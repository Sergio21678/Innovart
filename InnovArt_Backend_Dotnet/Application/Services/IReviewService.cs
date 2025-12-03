using InnovArt_Backend_Dotnet.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InnovArt_Backend_Dotnet.Application.Services;

public interface IReviewService
{
    Task<IEnumerable<Review>> GetAllAsync(int? productoId = null, int? clienteId = null, int? artesanoId = null);
    Task<Review?> GetByIdAsync(int id);
    Task<Review> CreateAsync(Review review);
    Task<bool> DeleteAsync(int id);
}
