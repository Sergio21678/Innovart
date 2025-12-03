using System;

namespace InnovArt_Backend_Dotnet.Application.DTOs;

public class PedidoCreateDto
{
    public int UserId { get; set; }
    public string? Status { get; set; }
}

public class PedidoUpdateDto
{
    public string? Status { get; set; }
}
