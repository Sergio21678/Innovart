using System;

namespace InnovArt_Backend_Dotnet.Domain.Entities;

public class Mensaje
{
    public int Id { get; set; }
    public int FromUserId { get; set; }
    public int ToUserId { get; set; }
    public string? Content { get; set; }
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
}
