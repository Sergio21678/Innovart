using InnovArt_Backend_Dotnet.Application.Services;
using InnovArt_Backend_Dotnet.Domain.Entities;
using InnovArt_Backend_Dotnet.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InnovArt_Backend_Dotnet.Application.Services;

public class UserService : IUserService
{
    private readonly IUnitOfWork _uow;

    public UserService(IUnitOfWork uow) => _uow = uow;

    public async Task<User> CreateAsync(User user)
    {
        await _uow.Users.AddAsync(user);
        await _uow.SaveChangesAsync();
        return user;
    }

    public async Task<User> RegisterAsync(InnovArt_Backend_Dotnet.Application.DTOs.RegisterDto dto, string role = "user")
    {
        await _uow.BeginTransactionAsync();
        try
        {
            var existing = await GetByEmailAsync(dto.Email);
            if (existing is not null) throw new InvalidOperationException("Email already registered");

            var hashed = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            var user = new User { Email = dto.Email, Name = dto.Name, PasswordHash = hashed, Role = role };
            await _uow.Users.AddAsync(user);
            await _uow.SaveChangesAsync();
            await _uow.CommitAsync();
            return user;
        }
        catch
        {
            await _uow.RollbackAsync();
            throw;
        }
    }

    public async Task<User?> ValidateCredentialsAsync(string email, string password)
    {
        var user = await GetByEmailAsync(email);
        if (user is null || string.IsNullOrEmpty(user.PasswordHash)) return null;
        return BCrypt.Net.BCrypt.Verify(password, user.PasswordHash) ? user : null;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var item = await _uow.Users.GetByIdAsync(id);
        if (item is null) return false;
        _uow.Users.Remove(item);
        await _uow.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<User>> GetAllAsync() => await _uow.Users.Query().ToListAsync();

    public async Task<User?> GetByIdAsync(int id) => await _uow.Users.GetByIdAsync(id);

    public async Task<User?> GetByEmailAsync(string email)
    {
        var normalized = email.Trim().ToLower();
        return await _uow.Users.GetByEmailNormalizedAsync(normalized);
    }

    public async Task<bool> UpdateAsync(int id, User user)
    {
        var item = await _uow.Users.GetByIdAsync(id);
        if (item is null) return false;
        item.Name = user.Name;
        item.Email = user.Email;
        item.Role = user.Role;
        item.Especialidades = user.Especialidades;
        item.Telefono = user.Telefono;
        item.Ciudad = user.Ciudad;
        item.Pais = user.Pais;
        item.Descripcion = user.Descripcion;
        item.FotoPerfil = user.FotoPerfil;
        _uow.Users.Update(item);
        await _uow.SaveChangesAsync();
        return true;
    }
}
