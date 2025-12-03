using System;

namespace InnovArt_Backend_Dotnet.Domain.Entities;

public class Pedido
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string? Status { get; set; }
}

