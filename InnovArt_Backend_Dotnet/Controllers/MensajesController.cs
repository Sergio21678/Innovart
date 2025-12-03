using Microsoft.AspNetCore.Mvc;
using InnovArt_Backend_Dotnet.Domain.Entities;
using InnovArt_Backend_Dotnet.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

[ApiController]
[Route("api/[controller]")]
public class MensajesController : ControllerBase
{
    private readonly IMensajeService _svc;
    private readonly ILogger<MensajesController> _logger;

    public MensajesController(IMensajeService svc, ILogger<MensajesController> logger)
    {
        _svc = svc;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] int? fromUserId, [FromQuery] int? toUserId, [FromQuery] int? destinatarioId)
    {
        // Accept `destinatarioId` from frontend as alias for `toUserId`
        var effectiveTo = toUserId ?? destinatarioId;
        try
        {
            return Ok(await _svc.GetAllAsync(fromUserId, effectiveTo));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving messages");
            return StatusCode(500, new { error = "An error occurred while retrieving messages" });
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
            _logger.LogError(ex, "Error retrieving message {MessageId}", id);
            return StatusCode(500, new { error = "An error occurred while retrieving the message" });
        }
    }

    [HttpPost]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> Post([FromBody] InnovArt_Backend_Dotnet.Application.DTOs.MensajeCreateDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        try
        {
            var created = await _svc.SendAsync(dto.FromUserId, dto.ToUserId, dto.Content);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating message");
            return StatusCode(500, new { error = "An error occurred while creating the message" });
        }
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        if (id <= 0) return BadRequest(new { error = "Invalid message ID" });

        try
        {
            var ok = await _svc.DeleteAsync(id);
            return ok ? NoContent() : NotFound();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting message {MessageId}", id);
            return StatusCode(500, new { error = "An error occurred while deleting the message" });
        }
    }
}
