using InnovArt_Backend_Dotnet.Domain.Entities;
using Microsoft.Extensions.DependencyInjection;

namespace InnovArt_Backend_Dotnet.Infrastructure.Data;

public static class DataSeeder
{
    public static void Seed(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        if (!db.Users.Any())
        {
            var u1 = new User { Name = "Admin", Email = "admin@innovart.test", Role = "admin", PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123") };
            var u2 = new User { Name = "Cliente", Email = "cliente@innovart.test", Role = "cliente", PasswordHash = BCrypt.Net.BCrypt.HashPassword("cliente123") };
            db.Users.AddRange(u1, u2);
            db.SaveChanges();

            if (!db.Products.Any())
            {
                var p1 = new Product { Title = "Jarron Ceramico", Description = "Jarron hecho a mano", Price = 35.5m, Category = "Ceramica", Location = "Cusco", ImageUrl = "/default-artesania.png", UsuarioId = u1.Id };
                var p2 = new Product { Title = "Collar de cuentas", Description = "Collar tradicional", Price = 15.0m, Category = "Joyeria", Location = "Ayacucho", ImageUrl = "/default-artesania.png", UsuarioId = u1.Id };
                db.Products.AddRange(p1, p2);
                db.SaveChanges();

                db.Reviews.Add(new Review { ProductId = p1.Id, UserId = u2.Id, Rating = 5, Comment = "Excelente trabajo" });
                db.SaveChanges();
            }

            if (!db.Pedidos.Any())
            {
                db.Pedidos.Add(new Pedido { UserId = u2.Id, Status = "Creado" });
                db.SaveChanges();
            }

            if (!db.Mensajes.Any())
            {
                db.Mensajes.Add(new Mensaje { FromUserId = u2.Id, ToUserId = u1.Id, Content = "Tienes stock?" });
                db.SaveChanges();
            }
        }
    }
}
