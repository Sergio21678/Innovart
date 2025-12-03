using AutoMapper;
using InnovArt_Backend_Dotnet.Application.DTOs;
using InnovArt_Backend_Dotnet.Domain.Entities;

namespace InnovArt_Backend_Dotnet.Infrastructure.Mapping;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<UserCreateDto, User>();
        CreateMap<UserUpdateDto, User>();
        CreateMap<ProductCreateDto, Product>();
        CreateMap<ProductUpdateDto, Product>();
        CreateMap<ReviewCreateDto, Review>();
        CreateMap<PedidoCreateDto, Pedido>();
        CreateMap<PedidoUpdateDto, Pedido>();
        CreateMap<MensajeCreateDto, Mensaje>();
    }
}
