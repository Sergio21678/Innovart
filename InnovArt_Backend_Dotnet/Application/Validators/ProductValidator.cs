using FluentValidation;
using InnovArt_Backend_Dotnet.Application.DTOs;

namespace InnovArt_Backend_Dotnet.Application.Validators;

public class ProductCreateValidator : AbstractValidator<ProductCreateDto>
{
    public ProductCreateValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Price).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Category).MaximumLength(100);
        RuleFor(x => x.Location).MaximumLength(150);
        RuleFor(x => x.ImageUrl).MaximumLength(500);
    }
}

public class ProductUpdateValidator : AbstractValidator<ProductUpdateDto>
{
    public ProductUpdateValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Price).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Category).MaximumLength(100);
        RuleFor(x => x.Location).MaximumLength(150);
        RuleFor(x => x.ImageUrl).MaximumLength(500);
    }
}
