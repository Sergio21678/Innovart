using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InnovArt_Backend_Dotnet.Infrastructure.Data;
using InnovArt_Backend_Dotnet.Domain.Entities;
using InnovArt_Backend_Dotnet.Application.Services;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
public class PedidosController : ControllerBase
{
    private readonly IPedidoService _svc;
    public PedidosController(IPedidoService svc) => _svc = svc;

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] int? userId)
        => Ok(await _svc.GetAllAsync(userId));

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var item = await _svc.GetByIdAsync(id);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> Post([FromBody] InnovArt_Backend_Dotnet.Application.DTOs.PedidoCreateDto dto)
    {
        var pedido = new Pedido { UserId = dto.UserId, Status = dto.Status };
        var created = await _svc.CreateAsync(pedido);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> Put(int id, [FromBody] InnovArt_Backend_Dotnet.Application.DTOs.PedidoUpdateDto dto)
    {
        var updated = new Pedido { Status = dto.Status };
        var ok = await _svc.UpdateAsync(id, updated);
        return ok ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await _svc.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }
}

