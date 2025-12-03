using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;

namespace InnovArt_Backend_Dotnet.Middlewares;

public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        var start = DateTime.UtcNow;
        var method = context.Request.Method;
        var path = context.Request.Path;

        try
        {
            await _next(context);
        }
        finally
        {
            var elapsed = (DateTime.UtcNow - start).TotalMilliseconds;
            _logger.LogInformation("HTTP {Method} {Path} responded {StatusCode} in {Duration}ms",
                method, path, context.Response.StatusCode, elapsed);
        }
    }
}
