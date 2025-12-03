using InnovArt_Backend_Dotnet.Application.DTOs;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace InnovArt_Backend_Dotnet.Application.Services;

public interface IReportService
{
    Task<AdminSummaryDto> GetAdminSummaryAsync();
    Task<ArtesanoSummaryDto> GetArtesanoSummaryAsync(int artesanoId);
    Task<OrdersReportDto> GetOrdersReportAsync();
    Task<IEnumerable<ExternalInspirationDto>> GetExternalInspirationsAsync(CancellationToken cancellationToken);
}
