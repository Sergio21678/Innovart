using InnovArt_Backend_Dotnet.Domain.Entities;
using InnovArt_Backend_Dotnet.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InnovArt_Backend_Dotnet.Application.Services;

public class ProductService : IProductService
{
    private readonly IUnitOfWork _uow;

    public ProductService(IUnitOfWork uow) => _uow = uow;

    public async Task<Product> CreateAsync(Product product, string? actorRole = null)
    {
        if (!IsRoleAllowed(actorRole)) throw new UnauthorizedAccessException("Solo artesanos o admin pueden crear productos");
        await _uow.Products.AddAsync(product);
        await _uow.SaveChangesAsync();
        return product;
    }

    public async Task<bool> DeleteAsync(int id, string? actorRole = null)
    {
        if (!IsRoleAllowed(actorRole)) throw new UnauthorizedAccessException("Solo artesanos o admin pueden eliminar productos");
        var item = await _uow.Products.GetByIdAsync(id);
        if (item is null) return false;
        _uow.Products.Remove(item);
        await _uow.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<Product>> GetAllAsync(int? usuarioId = null)
    {
        if (usuarioId.HasValue) return await _uow.Products.GetByUserAsync(usuarioId.Value);
        return await _uow.Products.Query().ToListAsync();
    }

    public async Task<Product?> GetByIdAsync(int id) => await _uow.Products.GetByIdAsync(id);

    public async Task<bool> UpdateAsync(int id, Product product, string? actorRole = null)
    {
        if (!IsRoleAllowed(actorRole)) throw new UnauthorizedAccessException("Solo artesanos o admin pueden actualizar productos");
        var item = await _uow.Products.GetByIdAsync(id);
        if (item is null) return false;
        item.Title = product.Title;
        item.Description = product.Description;
        item.Price = product.Price;
        item.Category = product.Category;
        item.Location = product.Location;
        item.ImageUrl = product.ImageUrl;
        _uow.Products.Update(item);
        await _uow.SaveChangesAsync();
        return true;
    }

    private static bool IsRoleAllowed(string? role)
    {
        if (string.IsNullOrWhiteSpace(role)) return false;
        var r = role.Trim().ToLower();
        return r == "artesano" || r == "admin";
    }
}
