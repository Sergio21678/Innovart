using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using InnovArt_Backend_Dotnet.Domain.Entities;
using InnovArt_Backend_Dotnet.Application.Services;
using System.Security.Claims;

namespace InnovArt_Backend_Dotnet.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _svc;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(IProductService svc, ILogger<ProductsController> logger)
    {
        _svc = svc;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] int? usuarioId)
    {
        try
        {
            var products = await _svc.GetAllAsync(usuarioId);
            return Ok(products);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting products");
            return StatusCode(500, new { error = "An error occurred while retrieving products" });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        if (id <= 0)
            return BadRequest(new { error = "Invalid product ID" });

        try
        {
            var item = await _svc.GetByIdAsync(id);
            return item is null ? NotFound(new { error = "Product not found" }) : Ok(item);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting product {ProductId}", id);
            return StatusCode(500, new { error = "An error occurred while retrieving the product" });
        }
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Post([FromBody] InnovArt_Backend_Dotnet.Application.DTOs.ProductCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var product = new Product 
            { 
                Title = dto.Title, 
                Description = dto.Description, 
                Price = dto.Price, 
                Category = dto.Category, 
                Location = dto.Location, 
                ImageUrl = dto.ImageUrl,
                UsuarioId = dto.UsuarioId > 0 ? dto.UsuarioId : (userIdClaim != null ? int.Parse(userIdClaim) : 0)
            };
            var created = await _svc.CreateAsync(product);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating product");
            return StatusCode(500, new { error = "An error occurred while creating the product" });
        }
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Put(int id, [FromBody] InnovArt_Backend_Dotnet.Application.DTOs.ProductUpdateDto dto)
    {
        if (id <= 0)
            return BadRequest(new { error = "Invalid product ID" });

        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var updated = new Product 
            { 
                Title = dto.Title, 
                Description = dto.Description, 
                Price = dto.Price,
                Category = dto.Category,
                Location = dto.Location,
                ImageUrl = dto.ImageUrl
            };
            var ok = await _svc.UpdateAsync(id, updated);
            return ok ? NoContent() : NotFound(new { error = "Product not found" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating product {ProductId}", id);
            return StatusCode(500, new { error = "An error occurred while updating the product" });
        }
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        if (id <= 0)
            return BadRequest(new { error = "Invalid product ID" });

        try
        {
            var ok = await _svc.DeleteAsync(id);
            return ok ? NoContent() : NotFound(new { error = "Product not found" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting product {ProductId}", id);
            return StatusCode(500, new { error = "An error occurred while deleting the product" });
        }
    }
}

