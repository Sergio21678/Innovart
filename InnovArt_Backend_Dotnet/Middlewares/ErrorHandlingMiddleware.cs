using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;

namespace InnovArt_Backend_Dotnet.Middlewares;

public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlingMiddleware> _logger;

    public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        var startTime = DateTime.UtcNow;
        var path = context.Request.Path;
        var method = context.Request.Method;

        try
        {
            await _next(context);
            var duration = (DateTime.UtcNow - startTime).TotalMilliseconds;
            _logger.LogInformation(
                "HTTP {Method} {Path} responded {StatusCode} in {Duration}ms",
                method, path, context.Response.StatusCode, duration);
        }
        catch (Exception ex)
        {
            var duration = (DateTime.UtcNow - startTime).TotalMilliseconds;
            _logger.LogError(ex, 
                "Unhandled exception in {Method} {Path} after {Duration}ms", 
                method, path, duration);

            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            context.Response.ContentType = "application/json";
            
            var result = JsonSerializer.Serialize(new { 
                error = "An unexpected error occurred.",
                path = path,
                method = method
            });
            await context.Response.WriteAsync(result);
        }
    }
}
