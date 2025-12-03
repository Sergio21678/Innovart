using InnovArt_Backend_Dotnet.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InnovArt_Backend_Dotnet.Application.Services;

public interface IPedidoService
{
    Task<IEnumerable<Pedido>> GetAllAsync(int? userId = null);
    Task<Pedido?> GetByIdAsync(int id);
    Task<Pedido> CreateAsync(Pedido pedido);
    Task<bool> UpdateAsync(int id, Pedido pedido);
    Task<bool> DeleteAsync(int id);
}
