using InnovArt_Backend_Dotnet.Application.DTOs;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace InnovArt_Backend_Dotnet.Application.Services;

public interface IExternalApiService
{
    Task<IEnumerable<ExternalInspirationDto>> GetCraftInspirationsAsync(CancellationToken cancellationToken);
}
