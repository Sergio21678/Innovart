using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InnovArt_Backend_Dotnet.Application.Services;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace InnovArt_Backend_Dotnet.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;
    private readonly ILogger<ReportsController> _logger;

    public ReportsController(IReportService reportService, ILogger<ReportsController> logger)
    {
        _reportService = reportService;
        _logger = logger;
    }

    [HttpGet("admin")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> GetAdminReport()
    {
        try
        {
            var summary = await _reportService.GetAdminSummaryAsync();
            return Ok(summary);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating admin report");
            return StatusCode(500, new { error = "An error occurred while generating the admin report" });
        }
    }

    [HttpGet("artesano")]
    [Authorize]
    public async Task<IActionResult> GetArtesanoReport()
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
            _logger.LogError(ex, "Error generating artesano report");
            return StatusCode(500, new { error = "An error occurred while generating the artesano report" });
        }
    }

    [HttpGet("orders")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> GetOrdersReport()
    {
        try
        {
            var report = await _reportService.GetOrdersReportAsync();
            return Ok(report);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating orders report");
            return StatusCode(500, new { error = "An error occurred while generating the orders report" });
        }
    }
}
