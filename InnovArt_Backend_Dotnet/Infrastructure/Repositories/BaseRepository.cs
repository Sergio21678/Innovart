using InnovArt_Backend_Dotnet.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using InnovArt_Backend_Dotnet.Infrastructure.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InnovArt_Backend_Dotnet.Infrastructure.Repositories;

public class BaseRepository<T> : IRepository<T> where T : class
{
    protected readonly ApplicationDbContext _db;
    protected readonly DbSet<T> _set;

    public BaseRepository(ApplicationDbContext db)
    {
        _db = db;
        _set = _db.Set<T>();
    }

    public async Task AddAsync(T entity) => await _set.AddAsync(entity).AsTask();

    public async Task<IEnumerable<T>> GetAllAsync() => await _set.ToListAsync();

    public async Task<T?> GetByIdAsync(int id) => await _set.FindAsync(id).AsTask();

    public void Remove(T entity) => _set.Remove(entity);

    public void Update(T entity) => _set.Update(entity);
}
