using System.Collections.Generic;

namespace InnovArt_Backend_Dotnet.Application.DTOs;

public class AdminSummaryDto
{
    public int Usuarios { get; set; }
    public int Productos { get; set; }
    public int Pedidos { get; set; }
    public int Mensajes { get; set; }
    public double CalificacionPromedio { get; set; }
}

public class ArtesanoSummaryDto
{
    public int Ventas { get; set; }
    public double Calificacion { get; set; }
    public int Mensajes { get; set; }
    public int Visitas { get; set; }
}

public class OrdersReportDto
{
    public int TotalPedidos { get; set; }
    public IDictionary<string, int> PedidosPorEstado { get; set; } = new Dictionary<string, int>();
}

public class ExternalInspirationDto
{
    public string Title { get; set; } = string.Empty;
    public string Source { get; set; } = string.Empty;
    public string? Url { get; set; }
    public string? Description { get; set; }
}
