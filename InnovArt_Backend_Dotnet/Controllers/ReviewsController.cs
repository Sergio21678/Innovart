using Microsoft.AspNetCore.Mvc;
using InnovArt_Backend_Dotnet.Domain.Entities;
using InnovArt_Backend_Dotnet.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _svc;
    private readonly ILogger<ReviewsController> _logger;

    public ReviewsController(IReviewService svc, ILogger<ReviewsController> logger)
    {
        _svc = svc;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] int? productoId, [FromQuery] int? clienteId, [FromQuery] int? artesanoId)
    {
        try
        {
            return Ok(await _svc.GetAllAsync(productoId, clienteId, artesanoId));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving reviews");
            return StatusCode(500, new { error = "An error occurred while retrieving reviews" });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        try
        {
            var item = await _svc.GetByIdAsync(id);
            return item is null ? NotFound() : Ok(item);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving review {ReviewId}", id);
            return StatusCode(500, new { error = "An error occurred while retrieving the review" });
        }
    }

    [HttpPost]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> Post([FromBody] InnovArt_Backend_Dotnet.Application.DTOs.ReviewCreateDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        try
        {
            var review = new Review { ProductId = dto.ProductId, UserId = dto.UserId, Rating = dto.Rating, Comment = dto.Comment };
            var created = await _svc.CreateAsync(review);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating review");
            return StatusCode(500, new { error = "An error occurred while creating the review" });
        }
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        if (id <= 0) return BadRequest(new { error = "Invalid review ID" });

        try
        {
            var ok = await _svc.DeleteAsync(id);
            return ok ? NoContent() : NotFound();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting review {ReviewId}", id);
            return StatusCode(500, new { error = "An error occurred while deleting the review" });
        }
    }
}
