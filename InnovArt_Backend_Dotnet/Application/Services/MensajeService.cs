using InnovArt_Backend_Dotnet.Domain.Entities;
using InnovArt_Backend_Dotnet.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InnovArt_Backend_Dotnet.Application.Services;

public class MensajeService : IMensajeService
{
    private readonly IUnitOfWork _uow;

    public MensajeService(IUnitOfWork uow) => _uow = uow;

    public async Task<Mensaje> SendAsync(int fromUserId, int toUserId, string content)
    {
        if (fromUserId <= 0 || toUserId <= 0) throw new ArgumentException("Ids inválidos");
        if (fromUserId == toUserId) throw new ArgumentException("No puedes enviarte mensajes a ti mismo");
        if (string.IsNullOrWhiteSpace(content)) throw new ArgumentException("El mensaje no puede estar vacío");

        var mensaje = new Mensaje { FromUserId = fromUserId, ToUserId = toUserId, Content = content.Trim() };
        await _uow.Repository<Mensaje>().AddAsync(mensaje);
        await _uow.SaveChangesAsync();
        return mensaje;
    }

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
        var query = _uow.Repository<Mensaje>().Query();
        if (fromUserId.HasValue) query = query.Where(m => m.FromUserId == fromUserId.Value);
        if (toUserId.HasValue) query = query.Where(m => m.ToUserId == toUserId.Value);
        return await query.ToListAsync();
    }

    public async Task<Mensaje?> GetByIdAsync(int id) => await _uow.Repository<Mensaje>().GetByIdAsync(id);
}
