using InnovArt_Backend_Dotnet.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InnovArt_Backend_Dotnet.Application.Services;

public interface IMensajeService
{
    Task<IEnumerable<Mensaje>> GetAllAsync(int? fromUserId = null, int? toUserId = null);
    Task<Mensaje?> GetByIdAsync(int id);
    Task<Mensaje> CreateAsync(Mensaje mensaje);
    Task<bool> DeleteAsync(int id);
}
