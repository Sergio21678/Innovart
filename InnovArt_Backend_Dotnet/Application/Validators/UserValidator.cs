using FluentValidation;
using InnovArt_Backend_Dotnet.Application.DTOs;

namespace InnovArt_Backend_Dotnet.Application.Validators;

public class UserCreateValidator : AbstractValidator<UserCreateDto>
{
    public UserCreateValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
    }
}

public class UserUpdateValidator : AbstractValidator<UserUpdateDto>
{
    public UserUpdateValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
    }
}
