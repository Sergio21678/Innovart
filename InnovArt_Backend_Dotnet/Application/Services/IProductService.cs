using InnovArt_Backend_Dotnet.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InnovArt_Backend_Dotnet.Application.Services;

public interface IProductService
{
    Task<IEnumerable<Product>> GetAllAsync(int? usuarioId = null);
    Task<Product?> GetByIdAsync(int id);
    Task<Product> CreateAsync(Product product);
    Task<bool> UpdateAsync(int id, Product product);
    Task<bool> DeleteAsync(int id);
}
