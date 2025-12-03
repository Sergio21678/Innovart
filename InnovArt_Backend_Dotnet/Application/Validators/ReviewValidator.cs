using FluentValidation;
using InnovArt_Backend_Dotnet.Application.DTOs;

namespace InnovArt_Backend_Dotnet.Application.Validators;

public class ReviewCreateValidator : AbstractValidator<ReviewCreateDto>
{
    public ReviewCreateValidator()
    {
        RuleFor(x => x.ProductId).GreaterThan(0);
        RuleFor(x => x.UserId).GreaterThan(0);
        RuleFor(x => x.Rating).InclusiveBetween(1, 5);
        RuleFor(x => x.Comment).MaximumLength(1000);
    }
}

