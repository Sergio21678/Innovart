using Microsoft.AspNetCore.Mvc;
using InnovArt_Backend_Dotnet.Application.Services;

namespace InnovArt_Backend_Dotnet.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;
    private readonly IUserService _userService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService auth, IUserService userService, ILogger<AuthController> logger)
    {
        _auth = auth;
        _userService = userService;
        _logger = logger;
    }

    [HttpPost("login")]
    [Microsoft.AspNetCore.Authorization.AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] InnovArt_Backend_Dotnet.Application.DTOs.LoginDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var user = await _userService.ValidateCredentialsAsync(dto.Email, dto.Password);
            if (user is null)
            {
                _logger.LogWarning("Failed login attempt for email: {Email}", dto.Email);
                return Unauthorized(new { error = "Invalid credentials" });
            }

            var token = _auth.GenerateToken(user);
            _logger.LogInformation("User {UserId} logged in successfully", user.Id);
            return Ok(new { token, user = new { user.Id, user.Email, user.Name, user.Role } });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for email: {Email}", dto.Email);
            return StatusCode(500, new { error = "An error occurred during login" });
        }
    }

    [HttpPost("register")]
    [Microsoft.AspNetCore.Authorization.AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] InnovArt_Backend_Dotnet.Application.DTOs.RegisterDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var role = string.IsNullOrEmpty(dto.Role) ? "cliente" : dto.Role.ToLower();
            if (role != "cliente" && role != "artesano" && role != "admin" && role != "user")
                return BadRequest(new { error = "Rol no permitido. Usa cliente, artesano o admin." });

            var created = await _userService.RegisterAsync(dto, role);
            _logger.LogInformation("New user registered: {UserId}, {Email}", created.Id, created.Email);
            return CreatedAtAction(null, new { id = created.Id }, new { created.Id, created.Email, created.Name });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("Registration failed: {Message}", ex.Message);
            return Conflict(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration for email: {Email}", dto.Email);
            return StatusCode(500, new { error = "An error occurred during registration" });
        }
    }
}
