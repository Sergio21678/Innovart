namespace InnovArt_Backend_Dotnet.Domain.Entities;

public class Product
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string? Category { get; set; }
    public string? Location { get; set; }
    public string? ImageUrl { get; set; }
    // Owner user id (frontend uses `usuarioId` query param)
    public int UsuarioId { get; set; }
}
