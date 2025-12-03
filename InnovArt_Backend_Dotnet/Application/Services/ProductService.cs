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

    public async Task<Product> CreateAsync(Product product)
    {
        await _uow.Repository<Product>().AddAsync(product);
        await _uow.SaveChangesAsync();
        return product;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var item = await _uow.Repository<Product>().GetByIdAsync(id);
        if (item is null) return false;
        _uow.Repository<Product>().Remove(item);
        await _uow.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<Product>> GetAllAsync(int? usuarioId = null)
    {
        var query = _uow.Repository<Product>().Query();
        if (usuarioId.HasValue)
        {
            query = query.Where(p => p.UsuarioId == usuarioId.Value);
        }
        return await query.ToListAsync();
    }

    public async Task<Product?> GetByIdAsync(int id) => await _uow.Repository<Product>().GetByIdAsync(id);

    public async Task<bool> UpdateAsync(int id, Product product)
    {
        var item = await _uow.Repository<Product>().GetByIdAsync(id);
        if (item is null) return false;
        item.Title = product.Title;
        item.Description = product.Description;
        item.Price = product.Price;
        item.Category = product.Category;
        item.Location = product.Location;
        item.ImageUrl = product.ImageUrl;
        _uow.Repository<Product>().Update(item);
        await _uow.SaveChangesAsync();
        return true;
    }
}
