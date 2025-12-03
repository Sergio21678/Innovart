namespace InnovArt_Backend_Dotnet.Application.DTOs;

public class ProductCreateDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string? Category { get; set; }
    public string? Location { get; set; }
    public string? ImageUrl { get; set; }
    public int UsuarioId { get; set; }
}

public class ProductUpdateDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string? Category { get; set; }
    public string? Location { get; set; }
    public string? ImageUrl { get; set; }
}
