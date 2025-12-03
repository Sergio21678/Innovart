using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using InnovArt_Backend_Dotnet.Application.Services;
using InnovArt_Backend_Dotnet.Domain.Entities;
using System.Security.Claims;
using System.Linq;

namespace InnovArt_Backend_Dotnet.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ArtesanoController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly IPedidoService _pedidoService;
    private readonly IMensajeService _mensajeService;
    private readonly IReviewService _reviewService;
    private readonly ILogger<ArtesanoController> _logger;

    public ArtesanoController(
        IProductService productService,
        IPedidoService pedidoService,
        IMensajeService mensajeService,
        IReviewService reviewService,
        ILogger<ArtesanoController> logger)
    {
        _productService = productService;
        _pedidoService = pedidoService;
        _mensajeService = mensajeService;
        _reviewService = reviewService;
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

            // Obtener productos del artesano
            var productos = await _productService.GetAllAsync(userId);
            var productosList = productos.ToList();

            // Obtener pedidos del artesano (filtrar por userId del artesano)
            var pedidosArtesano = await _pedidoService.GetAllAsync(userId);
            var pedidosList = pedidosArtesano.ToList();

            // Obtener mensajes recibidos
            var mensajes = await _mensajeService.GetAllAsync(null, userId);
            var mensajesList = mensajes.ToList();

            // Obtener reviews de los productos del artesano
            var reviews = await _reviewService.GetAllAsync(null, null, userId);
            var reviewsList = reviews.ToList();
            
            var calificacionPromedio = reviewsList.Any() 
                ? reviewsList.Average(r => r.Rating) 
                : 0;

            var summary = new
            {
                ventas = pedidosList.Count(p => p.Status?.ToLower() == "completado" || p.Status?.ToLower() == "completed"),
                calificacion = Math.Round(calificacionPromedio, 1),
                mensajes = mensajesList.Count,
                visitas = productosList.Count * 10 // Placeholder - puedes agregar un campo de visitas en el futuro
            };

            return Ok(summary);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting artesano summary");
            return StatusCode(500, new { error = "An error occurred while retrieving artesano summary" });
        }
    }
}

