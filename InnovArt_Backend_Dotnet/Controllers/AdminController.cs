using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using InnovArt_Backend_Dotnet.Application.Services;
using Microsoft.Extensions.Logging;

namespace InnovArt_Backend_Dotnet.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "admin")]
public class AdminController : ControllerBase
{
    private readonly IReportService _reportService;
    private readonly ILogger<AdminController> _logger;

    public AdminController(
        IReportService reportService,
        ILogger<AdminController> logger)
    {
        _reportService = reportService;
        _logger = logger;
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        try
        {
            var summary = await _reportService.GetAdminSummaryAsync();
            return Ok(summary);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting admin summary");
            return StatusCode(500, new { error = "An error occurred while retrieving admin summary" });
        }
    }
}

