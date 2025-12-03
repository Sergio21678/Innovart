using Microsoft.AspNetCore.Mvc;
using InnovArt_Backend_Dotnet.Domain.Entities;
using InnovArt_Backend_Dotnet.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly InnovArt_Backend_Dotnet.Application.Services.IUserService _svc;
    private readonly ILogger<UsersController> _logger;

    public UsersController(
        InnovArt_Backend_Dotnet.Application.Services.IUserService svc,
        ILogger<UsersController> logger)
    {
        _svc = svc;
        _logger = logger;
    }

    [HttpGet]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Get()
    {
        try
        {
            return Ok(await _svc.GetAllAsync());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving users list");
            return StatusCode(500, new { error = "An error occurred while retrieving users" });
        }
    }

    [HttpGet("me")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> GetMe()
    {
        try
        {
            var userIdClaim = HttpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                return Unauthorized(new { error = "Invalid token" });

            var user = await _svc.GetByIdAsync(userId);
            return user is null ? NotFound(new { error = "User not found" }) : Ok(user);
        }
        catch (Exception)
        {
            return StatusCode(500, new { error = "An error occurred while retrieving user information" });
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
            _logger.LogError(ex, "Error retrieving user {UserId}", id);
            return StatusCode(500, new { error = "An error occurred while retrieving the user" });
        }
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Post([FromBody] InnovArt_Backend_Dotnet.Application.DTOs.UserCreateDto dto)
    {
        try
        {
            var user = new User { Name = dto.Name, Email = dto.Email, Role = dto.Role, Especialidades = dto.Especialidades, Telefono = dto.Telefono, Ciudad = dto.Ciudad, Pais = dto.Pais, Descripcion = dto.Descripcion, FotoPerfil = dto.FotoPerfil };
            var created = await _svc.CreateAsync(user);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating user");
            return StatusCode(500, new { error = "An error occurred while creating the user" });
        }
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] InnovArt_Backend_Dotnet.Application.DTOs.LoginDto dto)
    {
        try
        {
            var user = await HttpContext.RequestServices.GetRequiredService<InnovArt_Backend_Dotnet.Application.Services.IUserService>().ValidateCredentialsAsync(dto.Email, dto.Password);
            if (user is null) return Unauthorized(new { error = "Invalid credentials" });
            var token = HttpContext.RequestServices.GetRequiredService<InnovArt_Backend_Dotnet.Application.Services.IAuthService>().GenerateToken(user);
            return Ok(new { token });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during user login for email {Email}", dto.Email);
            return StatusCode(500, new { error = "An error occurred during login" });
        }
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Put(int id, [FromBody] InnovArt_Backend_Dotnet.Application.DTOs.UserUpdateDto dto)
    {
        try
        {
            var updated = new User { Name = dto.Name, Email = dto.Email, Role = dto.Role, Especialidades = dto.Especialidades, Telefono = dto.Telefono, Ciudad = dto.Ciudad, Pais = dto.Pais, Descripcion = dto.Descripcion, FotoPerfil = dto.FotoPerfil };
            var ok = await _svc.UpdateAsync(id, updated);
            return ok ? NoContent() : NotFound();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user {UserId}", id);
            return StatusCode(500, new { error = "An error occurred while updating the user" });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var ok = await _svc.DeleteAsync(id);
            return ok ? NoContent() : NotFound();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting user {UserId}", id);
            return StatusCode(500, new { error = "An error occurred while deleting the user" });
        }
    }
}
