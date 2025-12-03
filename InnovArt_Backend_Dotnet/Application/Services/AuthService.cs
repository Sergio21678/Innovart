using InnovArt_Backend_Dotnet.Domain.Entities;
using InnovArt_Backend_Dotnet.Domain.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Linq;

namespace InnovArt_Backend_Dotnet.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _uow;
    private readonly string _secret;

    public AuthService(IUnitOfWork uow, IConfiguration config)
    {
        _uow = uow;
        _secret = config["JWT_SECRET"] ?? "change_this_secret_for_prod";
    }

    public User? ValidateCredentials(string email, string password)
    {
        var normalized = email.Trim().ToLower();
        var user = _uow.Repository<User>()
            .Query()
            .FirstOrDefault(u => u.Email != null && u.Email.ToLower() == normalized);

        if (user is null || string.IsNullOrEmpty(user.PasswordHash)) return null;
        var ok = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
        return ok ? user : null;
    }

    public string GenerateToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[] {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Name ?? string.Empty),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
            new Claim(ClaimTypes.Role, user.Role ?? "user")
        };

        var token = new JwtSecurityToken(
            issuer: null,
            audience: null,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
