using InnovArt_Backend_Dotnet.Domain.Interfaces;
using InnovArt_Backend_Dotnet.Infrastructure.Data;
using InnovArt_Backend_Dotnet.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;

namespace InnovArt_Backend_Dotnet.Infrastructure.UnitOfWork;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _db;
    private readonly ConcurrentDictionary<Type, object> _repositories = new();
    private IDbContextTransaction? _transaction;

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

    public async Task BeginTransactionAsync()
    {
        if (_transaction is null)
        {
            _transaction = await _db.Database.BeginTransactionAsync();
        }
    }

    public async Task CommitAsync()
    {
        if (_transaction is not null)
        {
            await _transaction.CommitAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackAsync()
    {
        if (_transaction is not null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _db.Dispose();
    }
}
