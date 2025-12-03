using FluentValidation;
using InnovArt_Backend_Dotnet.Application.DTOs;

namespace InnovArt_Backend_Dotnet.Application.Validators;

public class RegisterValidator : AbstractValidator<RegisterDto>
{
    public RegisterValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
        RuleFor(x => x.Name).NotEmpty().MinimumLength(2).MaximumLength(100);
        RuleFor(x => x.Role)
            .Must(r => string.IsNullOrEmpty(r) || r == "cliente" || r == "artesano" || r == "admin" || r == "user")
            .WithMessage("Role must be cliente, artesano, admin or user");
    }
}

public class LoginValidator : AbstractValidator<LoginDto>
{
    public LoginValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty();
    }
}
