using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using InnovArt_Backend_Dotnet.Application.Services;
using System.Security.Claims;
using Microsoft.Extensions.Logging;

namespace InnovArt_Backend_Dotnet.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ArtesanoController : ControllerBase
{
    private readonly IReportService _reportService;
    private readonly ILogger<ArtesanoController> _logger;

    public ArtesanoController(
        IReportService reportService,
        ILogger<ArtesanoController> logger)
    {
        _reportService = reportService;
        _logger = logger;
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                return Unauthorized(new { error = "Invalid token" });

            var summary = await _reportService.GetArtesanoSummaryAsync(userId);
            return Ok(summary);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting artesano summary");
            return StatusCode(500, new { error = "An error occurred while retrieving artesano summary" });
        }
    }
}

