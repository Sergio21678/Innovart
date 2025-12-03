using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InnovArt_Backend_Dotnet.Infrastructure.Data;
using InnovArt_Backend_Dotnet.Domain.Entities;
using InnovArt_Backend_Dotnet.Application.Services;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
public class MensajesController : ControllerBase
{
    private readonly IMensajeService _svc;
    public MensajesController(IMensajeService svc) => _svc = svc;

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] int? fromUserId, [FromQuery] int? toUserId, [FromQuery] int? destinatarioId)
    {
        // Accept `destinatarioId` from frontend as alias for `toUserId`
        var effectiveTo = toUserId ?? destinatarioId;
        return Ok(await _svc.GetAllAsync(fromUserId, effectiveTo));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var item = await _svc.GetByIdAsync(id);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> Post([FromBody] InnovArt_Backend_Dotnet.Application.DTOs.MensajeCreateDto dto)
    {
        var mensaje = new Mensaje { FromUserId = dto.FromUserId, ToUserId = dto.ToUserId, Content = dto.Content };
        var created = await _svc.CreateAsync(mensaje);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await _svc.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }
}
