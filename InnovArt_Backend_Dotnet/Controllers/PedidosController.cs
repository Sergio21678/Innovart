using Microsoft.AspNetCore.Mvc;
using InnovArt_Backend_Dotnet.Domain.Entities;
using InnovArt_Backend_Dotnet.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

[ApiController]
[Route("api/[controller]")]
public class PedidosController : ControllerBase
{
    private readonly IPedidoService _svc;
    private readonly ILogger<PedidosController> _logger;

    public PedidosController(IPedidoService svc, ILogger<PedidosController> logger)
    {
        _svc = svc;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] int? userId)
    {
        try
        {
            return Ok(await _svc.GetAllAsync(userId));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving orders");
            return StatusCode(500, new { error = "An error occurred while retrieving orders" });
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
            _logger.LogError(ex, "Error retrieving order {OrderId}", id);
            return StatusCode(500, new { error = "An error occurred while retrieving the order" });
        }
    }

    [HttpPost]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> Post([FromBody] InnovArt_Backend_Dotnet.Application.DTOs.PedidoCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var pedido = new Pedido { UserId = dto.UserId, Status = dto.Status };
            var created = await _svc.CreateAsync(pedido);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating order");
            return StatusCode(500, new { error = "An error occurred while creating the order" });
        }
    }

    [HttpPut("{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> Put(int id, [FromBody] InnovArt_Backend_Dotnet.Application.DTOs.PedidoUpdateDto dto)
    {
        if (id <= 0) return BadRequest(new { error = "Invalid order ID" });
        if (!ModelState.IsValid) return BadRequest(ModelState);

        try
        {
            var updated = new Pedido { Status = dto.Status };
            var ok = await _svc.UpdateAsync(id, updated);
            return ok ? NoContent() : NotFound();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating order {OrderId}", id);
            return StatusCode(500, new { error = "An error occurred while updating the order" });
        }
    }

    [HttpDelete("{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        if (id <= 0) return BadRequest(new { error = "Invalid order ID" });

        try
        {
            var ok = await _svc.DeleteAsync(id);
            return ok ? NoContent() : NotFound();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting order {OrderId}", id);
            return StatusCode(500, new { error = "An error occurred while deleting the order" });
        }
    }
}
