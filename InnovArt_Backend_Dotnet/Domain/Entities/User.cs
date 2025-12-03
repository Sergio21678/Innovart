namespace InnovArt_Backend_Dotnet.Domain.Entities;

public class User
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Role { get; set; }
    // Hashed password (BCrypt). Null for legacy/test users without password.
    public string? PasswordHash { get; set; }
    public string? Especialidades { get; set; }
    public string? Telefono { get; set; }
    public string? Ciudad { get; set; }
    public string? Pais { get; set; }
    public string? Descripcion { get; set; }
    public string? FotoPerfil { get; set; }
}
