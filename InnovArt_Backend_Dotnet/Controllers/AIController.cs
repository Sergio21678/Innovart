using InnovArt_Backend_Dotnet.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InnovArt_Backend_Dotnet.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AIController : ControllerBase
{
    private readonly IAIService _aiService;
    private readonly ILogger<AIController> _logger;

    public AIController(IAIService aiService, ILogger<AIController> logger)
    {
        _aiService = aiService;
        _logger = logger;
    }

    [HttpGet("recommendations")]
    [AllowAnonymous]
    public async Task<IActionResult> GetRecommendations([FromQuery] int? userId, [FromQuery] int take = 5)
    {
        try
        {
            var items = await _aiService.RecommendProductsAsync(userId, take);
            return Ok(items);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting AI recommendations");
            return StatusCode(500, new { error = "An error occurred while generating recommendations" });
        }
    }
}

