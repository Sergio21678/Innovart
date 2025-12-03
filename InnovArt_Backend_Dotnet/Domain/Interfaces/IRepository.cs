using System.Collections.Generic;
using System.Threading.Tasks;

namespace InnovArt_Backend_Dotnet.Domain.Interfaces;

public interface IRepository<T> where T : class
{
    Task<IEnumerable<T>> GetAllAsync();
    Task<T?> GetByIdAsync(int id);
    Task AddAsync(T entity);
    void Update(T entity);
    void Remove(T entity);
}
