using InnovArt_Backend_Dotnet.Domain.Entities;
using System.Threading.Tasks;

namespace InnovArt_Backend_Dotnet.Domain.Interfaces;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailNormalizedAsync(string emailNormalized);
}

