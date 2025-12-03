using InnovArt_Backend_Dotnet.Application.DTOs;
using InnovArt_Backend_Dotnet.Domain.Entities;
using InnovArt_Backend_Dotnet.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace InnovArt_Backend_Dotnet.Application.Services;

public class ReportService : IReportService
{
    private readonly IUnitOfWork _uow;
    private readonly IExternalApiService _externalApiService;

    public ReportService(IUnitOfWork uow, IExternalApiService externalApiService)
    {
        _uow = uow;
        _externalApiService = externalApiService;
    }

    public async Task<AdminSummaryDto> GetAdminSummaryAsync()
    {
        var usersCount = await _uow.Repository<User>().Query().CountAsync();
        var productsCount = await _uow.Repository<Product>().Query().CountAsync();
        var pedidosCount = await _uow.Repository<Pedido>().Query().CountAsync();
        var mensajesCount = await _uow.Repository<Mensaje>().Query().CountAsync();
        var promedio = await _uow.Repository<Review>().Query().AnyAsync()
            ? await _uow.Repository<Review>().Query().AverageAsync(r => r.Rating)
            : 0;

        return new AdminSummaryDto
        {
            Usuarios = usersCount,
            Productos = productsCount,
            Pedidos = pedidosCount,
            Mensajes = mensajesCount,
            CalificacionPromedio = Math.Round(promedio, 2)
        };
    }

    public async Task<ArtesanoSummaryDto> GetArtesanoSummaryAsync(int artesanoId)
    {
        var productos = await _uow.Repository<Product>().Query().Where(p => p.UsuarioId == artesanoId).ToListAsync();
        var productosIds = productos.Select(p => p.Id).ToHashSet();

        var pedidos = await _uow.Repository<Pedido>().Query().Where(p => p.UserId == artesanoId).ToListAsync();
        var mensajes = await _uow.Repository<Mensaje>().Query().Where(m => m.ToUserId == artesanoId).ToListAsync();
        var reviews = await _uow.Repository<Review>().Query().Where(r => productosIds.Contains(r.ProductId)).ToListAsync();

        var calificacionPromedio = reviews.Any() ? reviews.Average(r => r.Rating) : 0;
        var ventas = pedidos.Count(p => string.Equals(p.Status, "completado", StringComparison.OrdinalIgnoreCase) ||
                                        string.Equals(p.Status, "completed", StringComparison.OrdinalIgnoreCase));

        return new ArtesanoSummaryDto
        {
            Ventas = ventas,
            Calificacion = Math.Round(calificacionPromedio, 1),
            Mensajes = mensajes.Count,
            Visitas = productos.Count * 10
        };
    }

    public async Task<OrdersReportDto> GetOrdersReportAsync()
    {
        var pedidos = await _uow.Repository<Pedido>().Query().ToListAsync();
        var statusCounts = pedidos
            .GroupBy(p => string.IsNullOrWhiteSpace(p.Status) ? "sin_estado" : p.Status.ToLower())
            .ToDictionary(g => g.Key, g => g.Count());

        return new OrdersReportDto
        {
            TotalPedidos = pedidos.Count,
            PedidosPorEstado = statusCounts
        };
    }

    public Task<IEnumerable<ExternalInspirationDto>> GetExternalInspirationsAsync(CancellationToken cancellationToken)
        => _externalApiService.GetCraftInspirationsAsync(cancellationToken);
}
