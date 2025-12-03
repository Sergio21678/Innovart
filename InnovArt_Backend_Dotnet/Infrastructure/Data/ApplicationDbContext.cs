using Microsoft.EntityFrameworkCore;
using InnovArt_Backend_Dotnet.Domain.Entities;

namespace InnovArt_Backend_Dotnet.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Pedido> Pedidos => Set<Pedido>();
    public DbSet<Mensaje> Mensajes => Set<Mensaje>();
    public DbSet<Review> Reviews => Set<Review>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // Basic constraints
        modelBuilder.Entity<User>().HasKey(u => u.Id);
        modelBuilder.Entity<Product>().HasKey(p => p.Id);
        modelBuilder.Entity<Pedido>().HasKey(p => p.Id);
        modelBuilder.Entity<Mensaje>().HasKey(m => m.Id);
        modelBuilder.Entity<Review>().HasKey(r => r.Id);
    }
}
