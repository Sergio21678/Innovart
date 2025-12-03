using Microsoft.EntityFrameworkCore;
using InnovArt_Backend_Dotnet.Infrastructure.Data;
using FluentValidation.AspNetCore;
using FluentValidation;

var builder = WebApplication.CreateBuilder(args);

// Honor Render/hosting PORT if provided
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port) && int.TryParse(port, out var parsedPort))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{parsedPort}");
}

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "InnovArt API", Version = "v1" });
    var securityScheme = new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your valid token in the text input below.\r\n\r\nExample: \"Bearer abcdef12345\""
    };
    c.AddSecurityDefinition("Bearer", securityScheme);
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        { securityScheme, new[] { "Bearer" } }
    });
});
// AutoMapper
builder.Services.AddAutoMapper(typeof(InnovArt_Backend_Dotnet.Infrastructure.Mapping.AutoMapperProfile));
// FluentValidation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();
builder.Services.AddValidatorsFromAssemblyContaining<InnovArt_Backend_Dotnet.Application.Validators.ProductCreateValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<InnovArt_Backend_Dotnet.Application.Validators.RegisterValidator>();

// Configure EF Core with SQLite (file database) or Postgres via CONNECTION_STRING env var
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ??
                       Environment.GetEnvironmentVariable("CONNECTION_STRING") ??
                       "Data Source=innovart.db";
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    if (!string.IsNullOrEmpty(connectionString) && (connectionString.Contains("Host=") || connectionString.StartsWith("postgres", System.StringComparison.OrdinalIgnoreCase)))
    {
        options.UseNpgsql(connectionString);
    }
    else
    {
        options.UseSqlite(connectionString);
    }
});

// Register UnitOfWork and application services
builder.Services.AddScoped<InnovArt_Backend_Dotnet.Domain.Interfaces.IUnitOfWork, InnovArt_Backend_Dotnet.Infrastructure.UnitOfWork.UnitOfWork>();
builder.Services.AddScoped<InnovArt_Backend_Dotnet.Application.Services.IUserService, InnovArt_Backend_Dotnet.Application.Services.UserService>();
builder.Services.AddScoped<InnovArt_Backend_Dotnet.Application.Services.IProductService, InnovArt_Backend_Dotnet.Application.Services.ProductService>();
builder.Services.AddScoped<InnovArt_Backend_Dotnet.Application.Services.IReviewService, InnovArt_Backend_Dotnet.Application.Services.ReviewService>();
builder.Services.AddScoped<InnovArt_Backend_Dotnet.Application.Services.IPedidoService, InnovArt_Backend_Dotnet.Application.Services.PedidoService>();
builder.Services.AddScoped<InnovArt_Backend_Dotnet.Application.Services.IMensajeService, InnovArt_Backend_Dotnet.Application.Services.MensajeService>();
builder.Services.AddScoped<InnovArt_Backend_Dotnet.Application.Services.IAuthService, InnovArt_Backend_Dotnet.Application.Services.AuthService>();

// CORS - allow frontend to call API (adjust origins for production)
builder.Services.AddCors(options =>
{
    var frontend = Environment.GetEnvironmentVariable("FRONTEND_URL") ?? builder.Configuration["FRONTEND_URL"];
    if (!string.IsNullOrEmpty(frontend))
    {
        options.AddPolicy("AllowFrontend", p => p.WithOrigins(frontend).AllowAnyMethod().AllowAnyHeader());
    }
    options.AddPolicy("AllowAll", p => p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

// Authentication (register before building the app)
var jwtSecret = builder.Configuration["JWT_SECRET"] ?? Environment.GetEnvironmentVariable("JWT_SECRET") ?? "change_this_secret_for_prod";
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(jwtSecret))
        };
    });

var app = builder.Build();

// Apply migrations / ensure database created
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    // Aplica siempre migraciones para evitar desajustes de columnas
    db.Database.Migrate();
    // Seed initial data for development/testing
    InnovArt_Backend_Dotnet.Infrastructure.Data.DataSeeder.Seed(app.Services);
}

// Enable swagger in all environments for testing; in production Render you can disable via env var
var enableSwagger = builder.Configuration.GetValue<bool?>("EnableSwagger") ?? true;
if (enableSwagger)
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Global error handling middleware registration (should be early in pipeline)
app.UseMiddleware<InnovArt_Backend_Dotnet.Middlewares.ErrorHandlingMiddleware>();

// CORS must be before UseHttpsRedirection, UseAuthentication and UseAuthorization
var frontend = Environment.GetEnvironmentVariable("FRONTEND_URL") ?? builder.Configuration["FRONTEND_URL"];
if (!string.IsNullOrEmpty(frontend))
{
    app.UseCors("AllowFrontend");
}
else
{
    // En desarrollo, permitir todas las conexiones
    app.UseCors("AllowAll");
}

// No redirigir a HTTPS en este entorno para evitar 307 que limpian headers Authorization

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

