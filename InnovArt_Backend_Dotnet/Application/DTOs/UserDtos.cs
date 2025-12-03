namespace InnovArt_Backend_Dotnet.Application.DTOs;

public class UserCreateDto
{
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Role { get; set; }
    public string? Especialidades { get; set; }
    public string? Telefono { get; set; }
    public string? Ciudad { get; set; }
    public string? Pais { get; set; }
    public string? Descripcion { get; set; }
    public string? FotoPerfil { get; set; }
}

public class UserUpdateDto
{
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Role { get; set; }
    public string? Especialidades { get; set; }
    public string? Telefono { get; set; }
    public string? Ciudad { get; set; }
    public string? Pais { get; set; }
    public string? Descripcion { get; set; }
    public string? FotoPerfil { get; set; }
}
