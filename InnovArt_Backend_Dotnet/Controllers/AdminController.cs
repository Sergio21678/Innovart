using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using InnovArt_Backend_Dotnet.Application.Services;
using System.Security.Claims;
using System.Linq;

namespace InnovArt_Backend_Dotnet.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "admin")]
public class AdminController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IProductService _productService;
    private readonly IPedidoService _pedidoService;
    private readonly IMensajeService _mensajeService;
    private readonly ILogger<AdminController> _logger;

    public AdminController(
        IUserService userService,
        IProductService productService,
        IPedidoService pedidoService,
        IMensajeService mensajeService,
        ILogger<AdminController> logger)
    {
        _userService = userService;
        _productService = productService;
        _pedidoService = pedidoService;
        _mensajeService = mensajeService;
        _logger = logger;
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        try
        {
            var users = await _userService.GetAllAsync();
            var products = await _productService.GetAllAsync();
            var pedidos = await _pedidoService.GetAllAsync();
            var mensajes = await _mensajeService.GetAllAsync();

            var summary = new
            {
                usuarios = users.Count(),
                productos = products.Count(),
                pedidos = pedidos.Count(),
                mensajes = mensajes.Count()
            };

            return Ok(summary);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting admin summary");
            return StatusCode(500, new { error = "An error occurred while retrieving admin summary" });
        }
    }
}

