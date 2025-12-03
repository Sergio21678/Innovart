using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(new { status = "healthy" });

    [HttpGet("ready")]
    public IActionResult Ready() => Ok(new { ready = true });
}
