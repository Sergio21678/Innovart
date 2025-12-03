using InnovArt_Backend_Dotnet.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InnovArt_Backend_Dotnet.Application.Services;

public interface IUserService
{
    Task<IEnumerable<User>> GetAllAsync();
    Task<User?> GetByIdAsync(int id);
    Task<User> CreateAsync(User user);
    Task<User> RegisterAsync(InnovArt_Backend_Dotnet.Application.DTOs.RegisterDto dto, string role = "user");
    Task<User?> ValidateCredentialsAsync(string email, string password);
    Task<User?> GetByEmailAsync(string email);
    Task<bool> UpdateAsync(int id, User user);
    Task<bool> DeleteAsync(int id);
}
