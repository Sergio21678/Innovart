using FluentValidation;
using InnovArt_Backend_Dotnet.Application.DTOs;

namespace InnovArt_Backend_Dotnet.Application.Validators;

public class PedidoCreateValidator : AbstractValidator<PedidoCreateDto>
{
    public PedidoCreateValidator()
    {
        RuleFor(x => x.UserId).GreaterThan(0);
        RuleFor(x => x.Status)
            .Must(BeValidStatus)
            .WithMessage("Estado inválido. Usa creado, procesando, completado o cancelado");
    }

    private bool BeValidStatus(string? status)
    {
        if (string.IsNullOrWhiteSpace(status)) return true;
        var s = status.Trim().ToLower();
        return s is "creado" or "procesando" or "completado" or "cancelado";
    }
}

public class PedidoUpdateValidator : AbstractValidator<PedidoUpdateDto>
{
    public PedidoUpdateValidator()
    {
        RuleFor(x => x.Status)
            .NotEmpty()
            .Must(status => new[] { "creado", "procesando", "completado", "cancelado" }.Contains(status?.Trim().ToLower()))
            .WithMessage("Estado inválido. Usa creado, procesando, completado o cancelado");
    }
}

