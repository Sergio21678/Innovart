using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InnovArt_Backend_Dotnet.Infrastructure.Data;
using InnovArt_Backend_Dotnet.Domain.Entities;
using InnovArt_Backend_Dotnet.Application.Services;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _svc;
    public ReviewsController(IReviewService svc) => _svc = svc;

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] int? productoId, [FromQuery] int? clienteId, [FromQuery] int? artesanoId)
        => Ok(await _svc.GetAllAsync(productoId, clienteId, artesanoId));

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var item = await _svc.GetByIdAsync(id);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> Post([FromBody] InnovArt_Backend_Dotnet.Application.DTOs.ReviewCreateDto dto)
    {
        var review = new Review { ProductId = dto.ProductId, UserId = dto.UserId, Rating = dto.Rating, Comment = dto.Comment };
        var created = await _svc.CreateAsync(review);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await _svc.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }
}
