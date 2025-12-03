using InnovArt_Backend_Dotnet.Domain.Entities;
using InnovArt_Backend_Dotnet.Domain.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InnovArt_Backend_Dotnet.Application.Services;

public class PedidoService : IPedidoService
{
    private readonly IUnitOfWork _uow;

    public PedidoService(IUnitOfWork uow) => _uow = uow;

    public async Task<Pedido> CreateAsync(Pedido pedido)
    {
        await _uow.Repository<Pedido>().AddAsync(pedido);
        await _uow.SaveChangesAsync();
        return pedido;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var item = await _uow.Repository<Pedido>().GetByIdAsync(id);
        if (item is null) return false;
        _uow.Repository<Pedido>().Remove(item);
        await _uow.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<Pedido>> GetAllAsync(int? userId = null)
    {
        var all = (await _uow.Repository<Pedido>().GetAllAsync()).ToList();
        if (userId.HasValue) all = all.Where(p => p.UserId == userId.Value).ToList();
        return all;
    }

    public async Task<Pedido?> GetByIdAsync(int id) => await _uow.Repository<Pedido>().GetByIdAsync(id);

    public async Task<bool> UpdateAsync(int id, Pedido pedido)
    {
        var item = await _uow.Repository<Pedido>().GetByIdAsync(id);
        if (item is null) return false;
        item.Status = pedido.Status;
        _uow.Repository<Pedido>().Update(item);
        await _uow.SaveChangesAsync();
        return true;
    }
}
