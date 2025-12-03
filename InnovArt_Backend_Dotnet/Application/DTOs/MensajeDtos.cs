namespace InnovArt_Backend_Dotnet.Application.DTOs;

public class MensajeCreateDto
{
    public int FromUserId { get; set; }
    public int ToUserId { get; set; }
    public string? Content { get; set; }
}
