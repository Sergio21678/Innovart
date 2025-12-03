using InnovArt_Backend_Dotnet.Domain.Interfaces;
using InnovArt_Backend_Dotnet.Infrastructure.Data;
using InnovArt_Backend_Dotnet.Infrastructure.Repositories;
using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;

namespace InnovArt_Backend_Dotnet.Infrastructure.UnitOfWork;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _db;
    private readonly ConcurrentDictionary<Type, object> _repositories = new();

    public UnitOfWork(ApplicationDbContext db) => _db = db;

    public IRepository<T> Repository<T>() where T : class
    {
        var type = typeof(T);
        if (!_repositories.ContainsKey(type))
        {
            var repo = new BaseRepository<T>(_db);
            _repositories[type] = repo;
        }
        return (IRepository<T>)_repositories[type]!;
    }

    public Task<int> SaveChangesAsync() => _db.SaveChangesAsync();

    public void Dispose() => _db.Dispose();
}
