using System;
using System.Threading.Tasks;

namespace InnovArt_Backend_Dotnet.Domain.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IRepository<T> Repository<T>() where T : class;
    Task<int> SaveChangesAsync();
}

