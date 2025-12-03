using InnovArt_Backend_Dotnet.Domain.Entities;
using InnovArt_Backend_Dotnet.Domain.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InnovArt_Backend_Dotnet.Application.Services;

public class MensajeService : IMensajeService
{
    private readonly IUnitOfWork _uow;

    public MensajeService(IUnitOfWork uow) => _uow = uow;

    public async Task<Mensaje> CreateAsync(Mensaje mensaje)
    {
        await _uow.Repository<Mensaje>().AddAsync(mensaje);
        await _uow.SaveChangesAsync();
        return mensaje;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var item = await _uow.Repository<Mensaje>().GetByIdAsync(id);
        if (item is null) return false;
        _uow.Repository<Mensaje>().Remove(item);
        await _uow.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<Mensaje>> GetAllAsync(int? fromUserId = null, int? toUserId = null)
    {
        var all = (await _uow.Repository<Mensaje>().GetAllAsync()).ToList();
        if (fromUserId.HasValue) all = all.Where(m => m.FromUserId == fromUserId.Value).ToList();
        if (toUserId.HasValue) all = all.Where(m => m.ToUserId == toUserId.Value).ToList();
        return all;
    }

    public async Task<Mensaje?> GetByIdAsync(int id) => await _uow.Repository<Mensaje>().GetByIdAsync(id);
}
