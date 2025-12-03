using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InnovArt_Backend_Dotnet.Application.Services;
using Microsoft.Extensions.Logging;

namespace InnovArt_Backend_Dotnet.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IntegrationsController : ControllerBase
{
    private readonly IExternalApiService _externalApiService;
    private readonly ILogger<IntegrationsController> _logger;

    public IntegrationsController(IExternalApiService externalApiService, ILogger<IntegrationsController> logger)
    {
        _externalApiService = externalApiService;
        _logger = logger;
    }

    [HttpGet("inspiration")]
    [AllowAnonymous]
    public async Task<IActionResult> GetInspiration(CancellationToken cancellationToken)
    {
        try
        {
            var inspirations = await _externalApiService.GetCraftInspirationsAsync(cancellationToken);
            return Ok(inspirations);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching external inspiration content");
            return StatusCode(500, new { error = "An error occurred while fetching external inspirations" });
        }
    }
}
