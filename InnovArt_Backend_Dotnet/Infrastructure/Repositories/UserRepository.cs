using InnovArt_Backend_Dotnet.Domain.Entities;
using InnovArt_Backend_Dotnet.Domain.Interfaces;
using InnovArt_Backend_Dotnet.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace InnovArt_Backend_Dotnet.Infrastructure.Repositories;

public class UserRepository : BaseRepository<User>, IUserRepository
{
    public UserRepository(ApplicationDbContext db) : base(db) { }

    public async Task<User?> GetByEmailNormalizedAsync(string emailNormalized) =>
        await _db.Users.AsNoTracking()
            .FirstOrDefaultAsync(u => u.Email != null && u.Email.ToLower() == emailNormalized);
}

