using FluentValidation;
using InnovArt_Backend_Dotnet.Application.DTOs;

namespace InnovArt_Backend_Dotnet.Application.Validators;

public class MensajeCreateValidator : AbstractValidator<MensajeCreateDto>
{
    public MensajeCreateValidator()
    {
        RuleFor(x => x.FromUserId).GreaterThan(0);
        RuleFor(x => x.ToUserId).GreaterThan(0);
        RuleFor(x => x).Must(x => x.FromUserId != x.ToUserId)
            .WithMessage("No puedes enviarte mensajes a ti mismo");
        RuleFor(x => x.Content).NotEmpty().MinimumLength(2).MaximumLength(1000);
    }
}

