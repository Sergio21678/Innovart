using InnovArt_Backend_Dotnet.Domain.Entities;
namespace InnovArt_Backend_Dotnet.Application.Services;

public interface IAuthService
{
    string GenerateToken(User user);
    User? ValidateCredentials(string email, string password);
}
